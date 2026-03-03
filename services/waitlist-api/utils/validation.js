/**
 * Validation Utilities
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Trim whitespace
  email = email.trim();

  // Basic email regex (good enough for most cases)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
}

/**
 * Validate role input
 * @param {string} role - Role to validate
 * @returns {boolean} True if valid role
 */
function validateRole(role) {
  if (!role) return true; // Role is optional

  const validRoles = ['dosen', 'mahasiswa', 'peneliti', 'other'];
  return validRoles.includes(role.toLowerCase());
}

module.exports = {
  validateEmail,
  sanitizeInput,
  validateRole
};
