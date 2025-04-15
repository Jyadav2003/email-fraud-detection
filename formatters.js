// src/utils/formatters.js

/**
 * Format a date string into a readable format
 * @param {string} dateString - The date string to format
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format a number to percentage
 * @param {number} num - Number to convert to percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (num, decimals = 0) => {
  if (num === undefined || num === null) return '';
  return `${(num * 100).toFixed(decimals)}%`;
};

/**
 * Truncate text to a specified length and add ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format email address to protect privacy
 * @param {string} email - Email address to format
 * @returns {string} Formatted email
 */
export const formatEmail = (email) => {
  if (!email) return '';
  
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const username = parts[0];
  const domain = parts[1];
  
  // Only show first 2 characters of username
  let maskedUsername;
  if (username.length <= 2) {
    maskedUsername = username;
  } else {
    maskedUsername = username.substring(0, 2) + '*'.repeat(Math.min(username.length - 2, 5));
  }
  
  return `${maskedUsername}@${domain}`;
};

/**
 * Format risk level based on probability
 * @param {number} probability - Risk probability (0-1)
 * @returns {string} Risk level text
 */
export const formatRiskLevel = (probability) => {
  if (probability === undefined || probability === null) return 'Unknown';
  if (probability < 0.3) return 'Low Risk';
  if (probability < 0.7) return 'Medium Risk';
  return 'High Risk';
};

/**
 * Get color for risk level
 * @param {number} probability - Risk probability (0-1)
 * @returns {string} Color code
 */
export const getRiskColor = (probability) => {
  if (probability === undefined || probability === null) return '#9e9e9e';
  if (probability < 0.3) return '#4caf50';
  if (probability < 0.7) return '#ff9800';
  return '#f44336';
};