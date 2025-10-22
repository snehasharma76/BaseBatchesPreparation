/**
 * Check Backend Wallet Balance
 * 
 * This script checks the ETH balance of the backend wallet on Base Sepolia.
 * Useful for verifying that:
 * - The wallet has received ETH from spend permissions
 * - The wallet has enough ETH to pay for gas fees
 * 
 * Usage:
 *   npm run balance
 * 
 * The backend wallet needs ETH to pay gas fees when:
 * - Approving permissions (approveWithSignature)
 * - Spending from permissions (spend)
 */

import { createPublicClient, http, formatEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Derive account from private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY)

// Create public client for read-only operations
const client = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.RPC_URL)
})

/**
 * Main function to check and display wallet balance
 */
async function main() {
  console.log('💰 Checking backend wallet balance...\n')
  console.log('Address:', account.address)
  
  // Fetch balance from blockchain
  const balance = await client.getBalance({ address: account.address })
  
  console.log('Balance:', formatEther(balance), 'ETH')
  console.log('Balance (wei):', balance.toString())
}

main().catch(console.error)
