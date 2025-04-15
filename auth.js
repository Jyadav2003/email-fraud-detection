// src/services/auth.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Log in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Promise object represents the login response
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/token`, {
      email,
      password
    });
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

/**
 * Register a new user
 * @param {string} username - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} Promise object represents the registration response
 */
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

/**
 * Log out current user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current authenticated user
 * @returns {Object|null} User object or null if not authenticated
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get user's authentication token
 * @returns {string|null} Authentication token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise} Promise object represents the update response
 */
export const updateProfile = async (userData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await axios.put(`${API_URL}/auth/profile`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Profile update failed');
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Promise object represents the password change response
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await axios.put(`${API_URL}/auth/password`, {
      current_password: currentPassword,
      new_password: newPassword
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Password change failed');
  }
};