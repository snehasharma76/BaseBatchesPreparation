/**
 * Spend from Permission
 * 
 * This script pulls ETH from a user's account using an approved spend permission.
 * The backend wallet can call this repeatedly until the allowance is exhausted.
 * 
 * Flow:
 * 1. User creates permission in frontend
 * 2. Backend approves permission on-chain (approvePermission.js)
 * 3. Backend can now spend from the permission (this script)
 * 
 * Usage:
 *   npm run spend
 * 
 * Important:
 * - Permission must be approved first (run approvePermission.js)
 * - Amount must be ≤ remaining allowance
 * - Backend wallet pays gas fees
 * - ETH is transferred from user to backend wallet
 * - Can be called multiple times until allowance is exhausted
 */

import { createWalletClient, http, publicActions, parseEther } from 'viem'
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
}).extend(publicActions)

// SpendPermissionManager contract address on Base Sepolia
const SPEND_PERMISSION_MANAGER = process.env.SPEND_PERMISSION_MANAGER

// ========================================
// PASTE YOUR PERMISSION HERE (same as approval)
// ========================================
const permission = {
  "account": "0x3E51E1f0562303ecF9af01A1b4fb62bc5811861d",
  "spender": "0x0f7282924209a35dE7416d2fb6Bf5c98dC131fA6",
  "token": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "allowance": "1000000000000",
  "period": 2592000,
  "start": 1760523523,
  "end": 281474976710655,
  "salt": "0xaf9535e1ae342af4c1083302d2",
  "extraData": "0x"
}
// ========================================
// AMOUNT TO SPEND (change this value)
// ========================================
const amountToSpend = '0.000001' // ETH (must be ≤ allowance)

/**
 * ABI for the SpendPermissionManager contract
 * Only includes the spend function needed for this script
 */
const abi = [{
  name: 'spend',
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
    { name: 'value', type: 'uint160' }
  ]
}]

/**
 * Main function to spend from the approved permission
 * 
 * This function:
 * 1. Converts the ETH amount to wei
 * 2. Calls the SpendPermissionManager contract's spend function
 * 3. Transfers ETH from user's account to backend wallet
 * 4. Waits for transaction confirmation
 * 
 * The contract validates:
 * - Permission is approved
 * - Amount is within allowance
 * - Period hasn't expired
 * - Caller is the authorized spender
 */
async function main() {
  console.log('💸 Spending from permission...\n')
  console.log('From:', permission.account)
  console.log('Amount:', amountToSpend, 'ETH')
  
  // Convert ETH to wei
  const amount = parseEther(amountToSpend)
  
  // Submit transaction to spend from permission
  const hash = await client.writeContract({
    address: SPEND_PERMISSION_MANAGER,
    abi,
    functionName: 'spend',
    args: [permission, amount]
  })
  
  console.log('\n✅ Transaction sent:', hash)
  console.log('Waiting for confirmation...')
  
  // Wait for transaction to be mined
  const receipt = await client.waitForTransactionReceipt({ hash })
  console.log('✅ Confirmed in block:', receipt.blockNumber.toString())
  console.log('✅ ETH transferred to backend wallet!')
}

main().catch(console.error)
