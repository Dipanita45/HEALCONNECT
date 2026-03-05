import { Webhook } from 'svix'
import { db } from "../../../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Read the body from the request buffer
    const payload = await new Promise((resolve) => {
        let rawData = '';
        req.on('data', (chunk) => { rawData += chunk; });
        req.on('end', () => { resolve(rawData); });
    });

    const headerPayload = req.headers;
    const svix_id = headerPayload["svix-id"];
    const svix_timestamp = headerPayload["svix-timestamp"];
    const svix_signature = headerPayload["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: 'Error occurred -- no svix headers' })
    }

    const wh = new Webhook(WEBHOOK_SECRET)
    let evt;

    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return res.status(400).json({ Error: err.message })
    }

    const { id } = evt.data;
    const eventType = evt.type;

    // Handle user creation and updates
    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { email_addresses, first_name, last_name, public_metadata } = evt.data;
        const email = email_addresses ? email_addresses[0].email_address : '';
        const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'User';
        const role = public_metadata?.role || 'patient';

        // Write user info to our Firestore database so legacy components have access to it directly
        try {
            const userRef = doc(db, 'users', id);
            console.log(`Syncing Clerk user ${id} to Firestore with role ${role}`);

            await setDoc(userRef, {
                email,
                fullName,
                role,
                clerkId: id,
                updatedAt: new Date().toISOString(),
                // Only set created time if the document doesn't exist yet
            }, { merge: true });

            // If document was just created, we might want to set a flag
            const docSnap = await getDoc(userRef);
            if (docSnap.exists() && !docSnap.data().createdAt) {
                await setDoc(userRef, { createdAt: new Date().toISOString() }, { merge: true });
            }

        } catch (err) {
            console.error('Error syncing user to Firestore:', err);
            // We return 500 to Clerk so it can retry the webhook delivery
            return res.status(500).json({ error: 'Database sync failure' });
        }
    }

    return res.status(200).json({ success: true })
}
