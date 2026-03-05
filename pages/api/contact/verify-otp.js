// pages/api/contact/verify-otp.js
import { getOtp, clearOtp } from '../../../lib/otpStore';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedOtp = getOtp(email);

    if (!storedOtp) {
        return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
    }

    if (storedOtp === otp) {
        // Optionally clear it after successful verification
        // clearOtp(email); 
        return res.status(200).json({ message: 'Email verified successfully' });
    } else {
        return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }
}
