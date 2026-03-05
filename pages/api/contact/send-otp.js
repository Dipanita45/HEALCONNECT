// pages/api/contact/send-otp.js
import nodemailer from 'nodemailer';
import { setOtp } from '../../../lib/otpStore';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in store
    setOtp(email, otp);

    // Configure Nodemailer
    // In a real app, use environment variables
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification Code for HealConnect Contact Form',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2563eb; text-align: center;">HealConnect Verification</h2>
        <p>Hello,</p>
        <p>You are receiving this email because you tried to contact us through the HealConnect contact form. Please use the following OTP code to verify your email address:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937; margin: 20px 0; border-radius: 8px;">
          ${otp}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">&copy; ${new Date().getFullYear()} HealConnect. All rights reserved.</p>
      </div>
    `,
    };

    try {
        // Check if SMTP is configured correctly (not "your_gmail_address@gmail.com")
        if (process.env.EMAIL_USER === 'your_gmail_address@gmail.com' || !process.env.EMAIL_PASS) {
            console.warn('SMTP credentials not configured. Returning success with simulated OTP (check console).');
            console.log(`SIMULATED OTP for ${email}: ${otp}`);
            return res.status(200).json({
                message: 'OTP sent successfully (Simulated)',
                simulated: true
            });
        }

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }
}
