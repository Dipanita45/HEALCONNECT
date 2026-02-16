import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { withErrorHandling, withMethods, validate, rateLimit, compose } from '../../../lib/api/middleware';

// Login validation schema
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().default(false)
});

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return await loginUser(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

async function loginUser(req, res) {
  const { username, password, rememberMe } = req.body;

  try {
    // Find user by username or email
    const usersRef = collection(db, 'users');
    const usernameQuery = query(usersRef, where('username', '==', username));
    const emailQuery = query(usersRef, where('email', '==', username));

    const [usernameSnapshot, emailSnapshot] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(emailQuery)
    ]);

    const userDoc = !usernameSnapshot.empty ? usernameSnapshot.docs[0] :
                   !emailSnapshot.empty ? emailSnapshot.docs[0] : null;

    if (!userDoc) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const userData = userDoc.data();

    // Check if account is locked
    if (userData.lockedUntil && userData.lockedUntil.toDate() > new Date()) {
      const remainingTime = Math.ceil((userData.lockedUntil.toDate() - new Date()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked. Try again in ${remainingTime} minutes.`
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      // Increment login attempts
      const newAttempts = (userData.loginAttempts || 0) + 1;
      const updateData = { loginAttempts: newAttempts };

      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        updateData.loginAttempts = 0;
      }

      await updateDoc(doc(db, 'users', userDoc.id), updateData);

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    await updateDoc(doc(db, 'users', userDoc.id), {
      loginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date()
    });

    // Generate JWT token
    const tokenPayload = {
      uid: userDoc.id,
      username: userData.username,
      email: userData.email,
      role: userData.role
    };

    const expiresIn = rememberMe ? '30d' : '24h';
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'fallback-secret-key', {
      expiresIn
    });

    // Set HTTP-only cookie for security
    res.setHeader('Set-Cookie', [
      `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60}; Path=/`,
      `user-role=${userData.role}; Secure; SameSite=Strict; Max-Age=${rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60}; Path=/`
    ]);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: userDoc.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        fullName: userData.fullName,
        phone: userData.phone,
        age: userData.age,
        gender: userData.gender
      },
      token: token // Also return token for client-side storage if needed
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export default compose(
  withErrorHandling,
  withMethods(['POST']),
  rateLimit('auth'), // Rate limiting for auth endpoints
  validate(loginSchema)
)(handler);