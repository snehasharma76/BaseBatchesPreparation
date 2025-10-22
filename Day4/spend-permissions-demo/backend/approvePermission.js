/**
 * Approve Spend Permission
 * 
 * This script registers a user's spend permission on-chain by calling
 * the SpendPermissionManager contract's approveWithSignature function.
 * 
 * Flow:
 * 1. User creates permission in frontend (signs with EIP-712)
 * 2. Copy permission object and signature from browser console
 * 3. Paste them into this script
 * 4. Run this script to approve the permission on-chain
 * 
 * Usage:
 *   npm run approve
 * 
 * Important:
 * - This is a one-time operation per permission
 * - Backend wallet pays gas fees
 * - After approval, the backend can spend from the permission
 * - The permission is validated by the SpendPermissionManager contract
 */

import { createWalletClient, http, publicActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Create wallet client with backend account
const account = privateKeyToAccount(process.env.PRIVATE_KEY)
const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.RPC_URL)
}).extend(publicActions) // Add public actions for reading blockchain state

// SpendPermissionManager contract address on Base Sepolia
const SPEND_PERMISSION_MANAGER = process.env.SPEND_PERMISSION_MANAGER

// ========================================
// PASTE YOUR PERMISSION HERE (from frontend console)
// ========================================
const permission = {
}

// ========================================
// PASTE YOUR SIGNATURE HERE (from frontend console)
// ========================================
const signature = ''

/**
 * ABI for the SpendPermissionManager contract
 * Only includes the approveWithSignature function needed for this script
 */
const abi = [{
  name: 'approveWithSignature',
  type: 'function',
  inputs: [
    {
      name: 'spendPermission',
      type: 'tuple',
      components: [
        { name: 'account', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'token', type: 'address' },
        { name: 'allowance', type: 'uint160' },
        { name: 'period', type: 'uint48' },
        { name: 'start', type: 'uint48' },
        { name: 'end', type: 'uint48' },
        { name: 'salt', type: 'uint256' },
        { name: 'extraData', type: 'bytes' }
      ]
    },
    { name: 'signature', type: 'bytes' }
  ]
}]

async function main() {
  console.log('📝 Approving permission...\n')
  console.log('User:', permission.account)
  console.log('Spender:', permission.spender)
  
  const hash = await client.writeContract({
    address: SPEND_PERMISSION_MANAGER,
    abi,
    functionName: 'approveWithSignature',
    args: [permission, signature]
  })
  
  console.log('\n✅ Transaction sent:', hash)
  console.log('Waiting for confirmation...')
  
  const receipt = await client.waitForTransactionReceipt({ hash })
  console.log('✅ Confirmed in block:', receipt.blockNumber.toString())
}

main().catch(console.error)
