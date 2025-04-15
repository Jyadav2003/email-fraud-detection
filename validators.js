// src/utils/validators.js

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password is strong' };
};

/**
 * Check if a file is of allowed type
 * @param {File} file - File to check
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} True if allowed, false otherwise
 */
export const isAllowedFileType = (file, allowedTypes = [
  'message/rfc822',
  'text/plain',
  'application/octet-stream'
]) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Check if form input is empty
 * @param {string} value - Input value to check
 * @returns {boolean} True if empty, false otherwise
 */
export const isEmpty = (value) => {
  return value === undefined || value === null || value.trim() === '';
};

/**
 * Check if URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if URL is suspicious
 * @param {string} url - URL to check
 * @param {Array} suspiciousDomains - List of suspicious domains
 * @returns {boolean} True if suspicious, false otherwise
 */
export const isSuspiciousURL = (url, suspiciousDomains = [
  'securityupdate',
  'verification',
  'login-verify',
  'account-update',
  'secure-login',
  'customer-support',
  'billing-update'
]) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Check if it's an IP address
    if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
      return true;
    }
    
    // Check for suspicious domains
    return suspiciousDomains.some(suspicious => domain.includes(suspicious));
  } catch (e) {
    return false;
  }
};