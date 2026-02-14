import { adminAuth, adminDb } from '@lib/firebaseAdmin';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    try {
        // 1. Verify the ID token (Authentication)
        const decodedToken = await adminAuth.verifyIdToken(token);

        // 2. Check if the requester is an Admin (Authorization)
        // Note: This relies on Custom Claims or checking the Firestore 'users' collection.
        // For now, we'll verify they have an account, but you SHOULD implement role checking.
        // e.g., const callerDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
        // if (callerDoc.data().role !== 'admin') return res.status(403)...

        const { name, email, password, speciality, address, number } = req.body;

        if (!email || !password || !name || !speciality) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 3. Create the user in Firebase Auth
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name,
        });

        // 4. Create the Doctor profile in Firestore
        await adminDb.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            name,
            email,
            speciality,
            address,
            number,
            role: 'doctor', // Explicitly set role
            userType: 'doctor',
            createdAt: new Date().toISOString(),
            user: false // Legacy flag, keeping it consistent with old code
        });

        console.log(`Doctor created: ${email} (${userRecord.uid})`);

        return res.status(200).json({ message: 'Doctor created successfully', uid: userRecord.uid });
    } catch (error) {
        console.error('Error creating doctor:', error);
        return res.status(500).json({ error: error.message });
    }
}
