/**
 * Normalizes a phone number to E.164 format.
 * Currently defaults to Indian country code (+91) if 10 digits are provided.
 *
 * @param {string} phone - The raw phone number string.
 * @returns {string} The normalized phone number (e.g., +91XXXXXXXXXX).
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return phone;

  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // If the number is 10 digits, assume it's an Indian number and prepend 91
  if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }

  // Ensure it starts with +
  return `+${cleaned}`;
}
