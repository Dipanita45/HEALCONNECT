import { getAuth, createClerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    console.log("[Onboarding API] Received request:", req.method);
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userId } = getAuth(req);
    console.log("[Onboarding API] Authenticated UserId:", userId);
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { role, adminCode } = req.body;
    console.log("[Onboarding API] Requested Role:", role);

    if (!role || !['patient', 'doctor', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role selected.' });
    }

    // Very basic admin code check (Ideally this should be an env var)
    if (role === 'admin' && adminCode !== 'HEALADMIN2024') {
        return res.status(403).json({ message: 'Invalid admin authorization code.' });
    }

    try {
        console.log("[Onboarding API] Initializing clerk client...");
        const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

        console.log("[Onboarding API] About to update metadata for user...");
        // Save to Clerk's public metadata so it's included in standard tokens
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: role,
                onboardingComplete: true
            }
        });

        console.log("[Onboarding API] Metadata updated successfully.");
        return res.status(200).json({ success: true, message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating user metadata in Clerk:', error);
        return res.status(500).json({ message: 'Failed to update profile data.' });
    }
}
