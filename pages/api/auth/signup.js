import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { db } from '../../../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { withErrorHandling, withMethods, validate, rateLimit, compose } from '../../../lib/api/middleware';

// Enhanced password validation schema
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must not exceed 128 characters'
  });

// Signup validation schema
const signupSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address'
    }),
  password: passwordSchema.required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  }),
  role: Joi.string().valid('patient', 'doctor', 'admin').default('patient'),
  fullName: Joi.string().min(2).max(100).trim().required(),
  phone: Joi.string().pattern(/^[0-9+\s-]{10,15}$/).required().messages({
    'string.pattern.base': 'Please enter a valid phone number'
  }),
  age: Joi.number().integer().min(1).max(120).required(),
  gender: Joi.string().valid('male', 'female', 'other').default('male'),
  adminCode: Joi.string().when('role', {
    is: 'admin',
    then: Joi.string().valid('HEALCONNECT2024').required(),
    otherwise: Joi.forbidden()
  })
});

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return await signupUser(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

async function signupUser(req, res) {
  const { username, email, password, role, fullName, phone, age, gender, adminCode } = req.body;

  try {
    // Check if username or email already exists
    const usersRef = collection(db, 'users');
    const usernameQuery = query(usersRef, where('username', '==', username));
    const emailQuery = query(usersRef, where('email', '==', email));

    const [usernameSnapshot, emailSnapshot] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(emailQuery)
    ]);

    if (!usernameSnapshot.empty) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    if (!emailSnapshot.empty) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password with bcrypt
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user document
    const userData = {
      username,
      email,
      password: hashedPassword,
      role,
      fullName,
      phone,
      age,
      gender,
      adminCode: role === 'admin' ? adminCode : undefined,
      createdAt: new Date(),
      isActive: true,
      lastLogin: null,
      loginAttempts: 0,
      lockedUntil: null
    };

    const docRef = await addDoc(usersRef, userData);

    // Return success without sensitive data
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: docRef.id,
        username,
        email,
        role,
        fullName,
        phone,
        age,
        gender
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export default compose(
  withErrorHandling,
  withMethods(['POST']),
  rateLimit('signup'), // Strict rate limiting for signup
  validate(signupSchema)
)(handler);