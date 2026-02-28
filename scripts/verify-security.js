// scripts/verify-security.js
// Usage: node scripts/verify-security.js

import { createMocks } from 'node-mocks-http';
import { withAuth, validate, rateLimit, compose } from '../lib/api/middleware.js';
import Joi from 'joi';

// Mock setup
process.env.FIREBASE_PROJECT_ID = 'test-project'; 

const mockHandler = async (req, res) => {
    res.status(200).json({ success: true, message: 'Success' });
};

async function testAuth() {
    console.log('Testing Auth Middleware...');
    const { req, res } = createMocks({
        method: 'GET',
        headers: {
            // No authorization header
        },
    });

    await withAuth(mockHandler)(req, res);

    if (res._getStatusCode() === 401) {
        console.log('✅ Auth Check Passed (Missing Header -> 401)');
    } else {
        console.error(`❌ Auth Check Failed. Got ${res._getStatusCode()}`);
    }
}

async function testValidation() {
    console.log('Testing Validation Middleware...');

    const schema = Joi.object({
        name: Joi.string().required(),
    });

    // Negative Case (Already Existing)
    const { req, res } = createMocks({
        method: 'POST',
        body: {
            age: 20
        },
    });

    await validate(schema)(mockHandler)(req, res);

    if (res._getStatusCode() === 400) {
        console.log('✅ Validation Check Passed (Invalid Input -> 400)');
    } else {
        console.error(`❌ Validation Check Failed. Got ${res._getStatusCode()}`);
    }
}

/* 
=========================
    Positive Path Test
========================= 
*/

async function testValidationSuccess() {
    console.log('Testing Validation Success Case...');

    const schema = Joi.object({
        name: Joi.string().required(),
    });

    const { req, res } = createMocks({
        method: 'POST',
        body: {
            name: 'Sai'
        },
    });

    await validate(schema)(mockHandler)(req, res);

    if (res._getStatusCode() === 200) {
        console.log('✅ Validation Success Passed (Valid Input -> 200)');
    } else {
        console.error(`❌ Validation Success Failed. Got ${res._getStatusCode()}`);
    }
}

async function run() {
    try {
        await testAuth();
        await testValidation();
        await testValidationSuccess();   //  Added here
        console.log('Verification Complete.');
    } catch (error) {
        console.error('Verification Script Error:', error);
    }
}

run();
