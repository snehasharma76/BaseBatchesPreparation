/**
 * Get Backend Wallet Address
 * 
 * This script derives the wallet address from the private key stored in .env
 * and displays it so you can configure the frontend.
 * 
 * Usage:
 *   npm run address
 * 
 * The output address should be copied to the frontend .env file as
 * VITE_BACKEND_WALLET_ADDRESS so users can create permissions for this wallet.
 */

import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Derive account from private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY)

console.log('🔑 Backend Wallet Address:', account.address)
console.log('\nCopy this address to frontend/.env as VITE_BACKEND_WALLET_ADDRESS')
