// lib/profileUtils.js

/**
 * Calculate user profile completion percentage
 * @param {Object} user - User object from context
 * @returns {Object} - { percentage, missingRequired, missingOptional }
 */
export const calculateProfileCompletion = (user) => {
    if (!user) {
        return {
            percentage: 0,
            missingRequired: ['name', 'email', 'number', 'age', 'bloodGroup'],
            missingOptional: ['weight', 'height', 'diabetesStatus', 'surgicalHistory', 'cardiacHistory']
        };
    }

    const requiredFields = ['name', 'email', 'number', 'age', 'bloodGroup'];
    const optionalFields = ['weight', 'height', 'diabetesStatus', 'surgicalHistory', 'cardiacHistory'];

    // Check which required fields are filled
    const requiredFilled = requiredFields.filter(field => {
        const value = user[field];
        return value !== null && value !== undefined && value !== '';
    });

    // Check which optional fields are filled
    const optionalFilled = optionalFields.filter(field => {
        const value = user[field];
        return value !== null && value !== undefined && value !== '';
    });

    // Calculate percentages with weights
    const requiredPercentage = (requiredFilled.length / requiredFields.length) * 60;
    const optionalPercentage = (optionalFilled.length / optionalFields.length) * 40;

    const totalPercentage = Math.round(requiredPercentage + optionalPercentage);

    // Get missing fields
    const missingRequired = requiredFields.filter(f => !requiredFilled.includes(f));
    const missingOptional = optionalFields.filter(f => !optionalFilled.includes(f));

    return {
        percentage: totalPercentage,
        missingRequired,
        missingOptional,
        totalFields: requiredFields.length + optionalFields.length,
        filledFields: requiredFilled.length + optionalFilled.length
    };
};

/**
 * Get color based on completion percentage
 * @param {number} percentage - Completion percentage
 * @returns {string} - Color class or hex
 */
export const getCompletionColor = (percentage) => {
    if (percentage >= 71) return '#10b981'; // Green
    if (percentage >= 41) return '#f59e0b'; // Yellow/Orange
    return '#ef4444'; // Red
};

/**
 * Get human-readable field name
 * @param {string} fieldName - Technical field name
 * @returns {string} - Human-readable name
 */
export const getFieldLabel = (fieldName) => {
    const labels = {
        name: 'Name',
        email: 'Email',
        number: 'Phone Number',
        age: 'Age',
        bloodGroup: 'Blood Group',
        weight: 'Weight',
        height: 'Height',
        diabetesStatus: 'Diabetes Status',
        surgicalHistory: 'Surgical History',
        cardiacHistory: 'Cardiac History'
    };

    return labels[fieldName] || fieldName;
};
