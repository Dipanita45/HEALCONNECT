import { verify } from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET || "default_development_secret_change_me");
    return res.status(200).json({
      isAuthenticated: true,
      user: decoded
    });
  } catch (error) {
    return res.status(401).json({ isAuthenticated: false });
  }
}
