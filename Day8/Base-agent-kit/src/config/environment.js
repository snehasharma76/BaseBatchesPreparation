/**
 * Environment Configuration
 * 
 * Loads and validates environment variables for the application.
 * Configures XMTP, Coinbase CDP, and Google Gemini settings.
 * 
 * @module config/environment
 */

import dotenv from "dotenv"
import {fileURLToPath} from 'url'
import {dirname,join} from 'path'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)



dotenv.config({
    path: join(__dirname,"../../.env")
})


// Set CDP environment variables for AgentKit
if (process.env.CDP_API_KEY_NAME) {
    process.env.CDP_API_KEY_ID = process.env.CDP_API_KEY_NAME;
  }
  if (process.env.CDP_API_KEY_PRIVATE_KEY) {
    process.env.CDP_API_KEY_SECRET = process.env.CDP_API_KEY_PRIVATE_KEY;
  }
  


/**
 * Validate that all required environment variables are present.
 * Throws an error if any required variables are missing.
 * 
 * @throws {Error} If required environment variables are missing
 */
function validateEnvironment() {
    const required = [
      'XMTP_WALLET_KEY',
      'XMTP_DB_ENCRYPTION_KEY',
      'CDP_API_KEY_NAME',
      'CDP_API_KEY_PRIVATE_KEY',
      'GEMINI_API_KEY'
    ];
  
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please copy .env.example to .env and fill in the values.\n' +
        'Run "npm run gen:keys" to generate XMTP keys.'
      );
    }
  }

/**
 * Application configuration object.
 * Contains all configuration settings loaded from environment variables.
 * 
 * @constant
 * @type {Object}
 * @property {Object} xmtp - XMTP messaging configuration
 * @property {Object} cdp - Coinbase Developer Platform configuration
 * @property {Object} gemini - Google Gemini AI configuration
 */
export const config = {
    // XMTP Configuration
    xmtp: {
      walletKey: process.env.XMTP_WALLET_KEY,
      dbEncryptionKey: process.env.XMTP_DB_ENCRYPTION_KEY,
      env: process.env.XMTP_ENV || 'dev'
    },
    
    // Coinbase CDP Configuration
    cdp: {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY,
      networkId: process.env.NETWORK_ID || 'base-sepolia',
      rpcUrl: process.env.RPC_URL
    },
    
    // Google Gemini Configuration
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-2.5-flash'
    }
  };


  validateEnvironment()


  export default config