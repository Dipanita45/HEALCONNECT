// lib/otpStore.js

// Using a global variable to persist across API route invocations in development
// In production, this should ideally be replaced with Redis or a database.
const globalOtpStore = global.otpStore || {};

if (process.env.NODE_ENV !== 'production') {
    global.otpStore = globalOtpStore;
}

export const setOtp = (email, otp) => {
    globalOtpStore[email] = {
        otp: otp,
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
    };
};

export const getOtp = (email) => {
    const record = globalOtpStore[email];
    if (!record) return null;

    if (Date.now() > record.expires) {
        delete globalOtpStore[email];
        return null;
    }

    return record.otp;
};

export const clearOtp = (email) => {
    delete globalOtpStore[email];
};
