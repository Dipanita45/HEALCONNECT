import { db } from "../../../lib/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    const usersRef = collection(db, "users");
    const emailQuery = query(usersRef, where("email", "==", email));
    const emailSnapshot = await getDocs(emailQuery);

    if (emailSnapshot.empty) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userDoc = emailSnapshot.docs[0];
    const user = userDoc.data();
    const userId = userDoc.id;

    if (!user.password) {
      return res.status(401).json({ message: "Invalid credentials or account requires password reset" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = sign(
      { userId, email: user.email, role: user.role, username: user.username, fullName: user.fullName }, 
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

    return res.status(200).json({ 
      message: "Logged in successfully",
      user: { id: userId, email: user.email, role: user.role, fullName: user.fullName, username: user.username, phone: user.phone || '' }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
