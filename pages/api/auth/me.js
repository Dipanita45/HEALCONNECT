import { getAuth, clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, sessionClaims } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ isAuthenticated: false });
    }

    // Try to quickly hit clerk api to get the full profile, or just use metadata
    const userRole = sessionClaims?.metadata?.role || "patient";

    return res.status(200).json({
      isAuthenticated: true,
      user: {
        userId: userId,
        role: userRole,
      }
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return res.status(401).json({ isAuthenticated: false });
  }
}
