import { db } from "../../../lib/firebase";
import { doc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, email, password, role, fullName, phone, age, gender, adminCode } = req.body;

    // Validate email & username existence
    const usersRef = collection(db, "users");
    
    const emailQuery = query(usersRef, where("email", "==", email));
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const usernameQuery = query(usersRef, where("username", "==", username));
    const usernameSnapshot = await getDocs(usernameQuery);
    if (!usernameSnapshot.empty) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const userId = Date.now().toString(); // Optional: use uuid library if needed
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: role || 'patient',
      fullName,
      phone,
      age: age || '',
      gender: gender || 'other',
      adminCode: role === "admin" ? adminCode : null,
      createdAt: new Date().toISOString()
    };

    // Save to Firestore
    await setDoc(doc(db, "users", userId), newUser);

    // Generate JWT
    const token = sign(
      { userId, email, role: newUser.role, username, fullName }, 
      process.env.JWT_SECRET || "default_development_secret_change_me", 
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "strict",
        path: "/",
      })
    );

    return res.status(201).json({ 
      message: "User registered successfully",
      user: { id: userId, email, role: newUser.role, fullName, username }
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
