import axios from 'axios';

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY;
const BASE_URL = 'https://api.neynar.com/v2';

// Create axios instance with base configuration
const neynarClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'api_key': NEYNAR_API_KEY,
    'Content-Type': 'application/json'
  }
});

/**
 * Search for casts containing a specific term
 * @param {string} term - The term to search for
 * @param {number} limit - Number of casts to retrieve
 * @returns {Promise} - Promise resolving to casts data
 */
export const searchCasts = async (term, limit = 20) => {
  try {
    const response = await neynarClient.get('/farcaster/cast/search', {
      params: {
        q: term,
        limit
      }
    });
    return response.data.result;
  } catch (error) {
    console.error(`Error searching casts for "${term}":`, error);
    throw error;
  }
};

/**
 * Get user profile information
 * @param {string} fid - Farcaster ID of the user
 * @returns {Promise} - Promise resolving to user profile data
 */
export const getUserProfile = async (fid) => {
  try {
    const response = await neynarClient.get(`/farcaster/user`, {
      params: { fid }
    });
    return response.data.result.user;
  } catch (error) {
    console.error(`Error fetching user profile for FID ${fid}:`, error);
    throw error;
  }
};

export default {
  searchCasts,
  getUserProfile
};
