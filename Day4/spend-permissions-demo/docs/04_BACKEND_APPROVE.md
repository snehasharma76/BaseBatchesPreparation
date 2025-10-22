# 🎓 Base Spend Permissions - Part 4: Backend Approval

## 🔐 What "Approving" Means

After the user creates and signs a permission, it exists **off-chain** (just data, not on the blockchain).

To make it **active**, the backend must:
1. Take the permission + signature from frontend
2. Submit it to the `SpendPermissionManager` contract
3. Pay gas for this transaction
4. The contract verifies and stores the permission on-chain

**Analogy:** It's like taking a signed check to the bank to activate it.

---

## 🔄 The Approval Flow

```
┌─────────────────────────────────────────────────────────┐
│                    APPROVAL PROCESS                      │
└─────────────────────────────────────────────────────────┘

1. Frontend creates permission + signature
   ↓
2. User copies to backend script
   ↓
3. Backend loads permission + signature
   ↓
4. Backend calls SpendPermissionManager.approveWithSignature()
   ↓
5. Contract verifies:
   ✓ Signature is valid
   ✓ Signer matches account
   ✓ Permission not already approved
   ↓
6. Contract stores permission on-chain
   ↓
7. Backend pays gas fee
   ↓
8. Transaction confirmed
   ↓
9. Permission is now ACTIVE!
```

---

## 📦 Dependencies

### What You Need

```json
{
  "dependencies": {
    "viem": "^2.0.0",
    "dotenv": "^16.0.0"
  }
}
```

**What each does:**
- **viem**: Ethereum library for blockchain interactions
- **dotenv**: Loads environment variables from `.env` file

---

## 🔧 Step-by-Step Code Walkthrough

Let's go through `approvePermission.js` section by section:

### Part 1: Imports

```javascript
import { createWalletClient, http, publicActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import dotenv from 'dotenv'

dotenv.config()
```

**What's happening:**
- `createWalletClient`: Creates a wallet that can send transactions
- `http`: HTTP transport for connecting to blockchain
- `publicActions`: Methods for reading blockchain data
- `privateKeyToAccount`: Converts private key to account object
- `baseSepolia`: Base Sepolia testnet configuration
- `dotenv.config()`: Loads variables from `.env` file

**Beginner explanation:**
```javascript
// viem is like a toolbox for Ethereum
import { createWalletClient } from 'viem'  // Tool for sending transactions
import { privateKeyToAccount } from 'viem/accounts'  // Tool for creating accounts
import { baseSepolia } from 'viem/chains'  // Network configuration

// dotenv loads environment variables
import dotenv from 'dotenv'
dotenv.config()  // Reads .env file

// Now you can use process.env.VARIABLE_NAME
console.log(process.env.PRIVATE_KEY)
```

**Why we need these:**
- `viem`: To interact with the blockchain
- `dotenv`: To keep secrets (private key) out of code
- Network config: To know which blockchain to use

---

### Part 2: Create Backend Wallet

```javascript
const account = privateKeyToAccount(process.env.PRIVATE_KEY)
const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.RPC_URL)
}).extend(publicActions)

const SPEND_PERMISSION_MANAGER = process.env.SPEND_PERMISSION_MANAGER
```

**Step-by-step breakdown:**

#### Step 1: Create Account from Private Key

```javascript
const account = privateKeyToAccount(process.env.PRIVATE_KEY)
```

**What's happening:**
- Loads private key from `.env` file
- Converts it to an account object
- This account will send transactions

**Beginner explanation:**
```javascript
// .env file contains:
// PRIVATE_KEY=0xabcdef1234567890...

// privateKeyToAccount creates an account object
const account = privateKeyToAccount('0xabcdef1234567890...')

// Account object has:
account.address  // "0x1234567890123456789012345678901234567890"
account.sign()   // Method to sign transactions
```

**Security warning:** 🔒
- NEVER share your private key
- NEVER commit `.env` to git
- Add `.env` to `.gitignore`

#### Step 2: Create Wallet Client

```javascript
const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.RPC_URL)
}).extend(publicActions)
```

**What's happening:**
- Creates a wallet client with configuration
- Extends with public actions (for reading data)

**Configuration explained:**
```javascript
{
  account,  // Who is sending transactions
  chain: baseSepolia,  // Which network (Base Sepolia)
  transport: http(process.env.RPC_URL)  // How to connect
}
```

**Beginner explanation:**
```javascript
// Think of it like setting up a phone
const client = createWalletClient({
  account,  // Your identity (phone number)
  chain: baseSepolia,  // Network (carrier: AT&T, Verizon, etc.)
  transport: http('https://sepolia.base.org')  // Connection (WiFi, 5G, etc.)
})

// Now you can make calls (send transactions)
await client.sendTransaction(...)
```

**What is RPC_URL?**
- RPC = Remote Procedure Call
- It's the URL to connect to the blockchain
- Example: `https://sepolia.base.org`
- Like a phone number to call the blockchain

#### Step 3: Load Contract Address

```javascript
const SPEND_PERMISSION_MANAGER = process.env.SPEND_PERMISSION_MANAGER
```

**What's happening:**
- Loads the SpendPermissionManager contract address
- This is where we'll send the approval transaction

**Value:**
```javascript
// .env file
SPEND_PERMISSION_MANAGER=0xf85210B21cC50302F477BA56686d2019dC9b67Ad

// This address is the same on all supported chains!
```

---

### Part 3: Permission and Signature

```javascript
// ========================================
// PASTE YOUR PERMISSION HERE (from frontend console)
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
// PASTE YOUR SIGNATURE HERE (from frontend console)
// ========================================
const signature = '0x0000000000000000...'
```

**What's happening:**
- These are placeholders for data from frontend
- You copy-paste from browser console
- Permission = what user approved
- Signature = proof user approved it

**How to get these:**
1. Run frontend (`npm run dev`)
2. Create permission in browser
3. Open console (F12)
4. Copy permission object
5. Copy signature
6. Paste both here

**Beginner explanation:**
```javascript
// After user creates permission in frontend, console shows:

// Permission object:
{
  "account": "0x742d...",  // User's address
  "spender": "0x1234...",  // Your backend address
  "allowance": "10000000000000000",  // 0.01 ETH in wei
  // ... other fields
}

// Signature:
"0xabcdef1234567890..."  // Long hex string

// You copy both and paste into this script
```

---

### Part 4: Contract ABI

```javascript
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
```

**What is ABI?**
- **ABI** = Application Binary Interface
- It's like a contract's instruction manual
- Tells you what functions exist and how to call them

**Beginner explanation:**
```javascript
// Think of ABI like a restaurant menu

// Menu item:
{
  name: 'approveWithSignature',  // Dish name
  type: 'function',  // It's a function (not an event)
  inputs: [...]  // Ingredients needed
}

// To order, you need to provide the right ingredients
```

**Breaking down the ABI:**

```javascript
{
  name: 'approveWithSignature',  // Function name
  type: 'function',  // It's a function
  inputs: [  // What parameters it takes
    {
      name: 'spendPermission',  // First parameter
      type: 'tuple',  // It's an object (tuple)
      components: [  // Fields in the object
        { name: 'account', type: 'address' },  // User's address
        { name: 'spender', type: 'address' },  // Backend's address
        // ... 7 more fields
      ]
    },
    {
      name: 'signature',  // Second parameter
      type: 'bytes'  // Raw bytes (hex string)
    }
  ]
}
```

**Why we need ABI:**
- Smart contracts are compiled to bytecode
- Bytecode is unreadable to humans
- ABI is the "translation guide"
- Without it, we can't call the function

**Data types explained:**

| Solidity Type | JavaScript Type | Example |
|---------------|-----------------|---------|
| `address` | string | `"0x1234..."` |
| `uint160` | string | `"10000000000000000"` |
| `uint48` | number | `2592000` |
| `uint256` | string | `"0xabc123"` |
| `bytes` | string | `"0xabcdef"` |
| `tuple` | object | `{ field1: ..., field2: ... }` |

---

### Part 5: Main Function

```javascript
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
```

**Step-by-step breakdown:**

#### Step 1: Log Information

```javascript
console.log('📝 Approving permission...\n')
console.log('User:', permission.account)
console.log('Spender:', permission.spender)
```

**What's happening:**
- Shows what's about to happen
- Displays user and spender addresses
- Helps with debugging

**Output:**
```
📝 Approving permission...

User: 0x3E51E1f0562303ecF9af01A1b4fb62bc5811861d
Spender: 0x0f7282924209a35dE7416d2fb6Bf5c98dC131fA6
```

#### Step 2: Send Transaction

```javascript
const hash = await client.writeContract({
  address: SPEND_PERMISSION_MANAGER,
  abi,
  functionName: 'approveWithSignature',
  args: [permission, signature]
})
```

**What's happening:**
- Sends transaction to SpendPermissionManager contract
- Calls `approveWithSignature` function
- Passes permission and signature as arguments
- Returns transaction hash

**Parameters explained:**
```javascript
{
  address: SPEND_PERMISSION_MANAGER,  // Contract address
  abi,  // How to format the call
  functionName: 'approveWithSignature',  // Which function
  args: [permission, signature]  // Function arguments
}
```

**Beginner explanation:**
```javascript
// writeContract is like making a phone call

await client.writeContract({
  address: '0xf852...',  // Phone number (contract address)
  abi,  // Language/protocol (how to communicate)
  functionName: 'approveWithSignature',  // What to say
  args: [permission, signature]  // The message
})

// Returns a transaction hash (like a confirmation number)
```

**What happens on-chain:**
1. Transaction is broadcast to network
2. Miners/validators pick it up
3. Contract's `approveWithSignature` function runs
4. Contract verifies signature
5. Contract stores permission
6. Transaction is included in a block

**Transaction hash:**
```javascript
// Example hash
"0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"

// You can view it on BaseScan:
// https://sepolia.basescan.org/tx/0xabcdef...
```

#### Step 3: Wait for Confirmation

```javascript
console.log('\n✅ Transaction sent:', hash)
console.log('Waiting for confirmation...')

const receipt = await client.waitForTransactionReceipt({ hash })
console.log('✅ Confirmed in block:', receipt.blockNumber.toString())
```

**What's happening:**
- Logs transaction hash
- Waits for transaction to be mined
- Gets receipt (proof of transaction)
- Logs block number

**Beginner explanation:**
```javascript
// Sending a transaction is like mailing a letter

// Step 1: Send the letter
const hash = await client.writeContract(...)
console.log('Letter sent! Tracking number:', hash)

// Step 2: Wait for delivery
const receipt = await client.waitForTransactionReceipt({ hash })
console.log('Letter delivered! Confirmed at:', receipt.blockNumber)
```

**Transaction receipt:**
```javascript
{
  blockNumber: 12345678n,  // Which block it's in
  status: 'success',  // Did it succeed?
  transactionHash: '0xabc...',  // Transaction hash
  gasUsed: 150000n,  // How much gas was used
  // ... more fields
}
```

**Output:**
```
✅ Transaction sent: 0xabcdef1234567890...
Waiting for confirmation...
✅ Confirmed in block: 12345678
```

#### Step 4: Error Handling

```javascript
main().catch(console.error)
```

**What's happening:**
- Runs the main function
- Catches any errors
- Logs errors to console

**Beginner explanation:**
```javascript
// Without error handling
main()  // If error occurs, script crashes

// With error handling
main().catch(console.error)  // If error occurs, log it and exit gracefully
```

**Common errors:**

**Error 1: Insufficient gas**
```
Error: insufficient funds for gas
```
**Solution:** Add ETH to backend wallet

**Error 2: Invalid signature**
```
Error: invalid signature
```
**Solution:** Make sure signature matches permission

**Error 3: Already approved**
```
Error: permission already approved
```
**Solution:** This permission is already active

**Error 4: Wrong network**
```
Error: chain mismatch
```
**Solution:** Check RPC_URL in .env

---

## 🔍 What Happens On-Chain

### Inside the Contract

When you call `approveWithSignature`, the contract:

1. **Verifies signature**
```solidity
// Pseudo-code
address signer = recoverSigner(permission, signature)
require(signer == permission.account, "Invalid signature")
```

2. **Checks permission not already approved**
```solidity
bytes32 permissionHash = hash(permission)
require(!isApproved[permissionHash], "Already approved")
```

3. **Stores permission**
```solidity
isApproved[permissionHash] = true
permissions[permissionHash] = permission
```

4. **Emits event**
```solidity
emit PermissionApproved(permission.account, permission.spender, permissionHash)
```

### Gas Costs

**Typical gas usage:**
- Approving permission: ~150,000 gas
- At 1 gwei gas price: ~0.00015 ETH
- At $2000/ETH: ~$0.30

**Who pays?**
- Backend wallet pays the gas
- User pays nothing

---

## 🎯 Backend Approval Summary

### What the Backend Does

1. ✅ **Load environment** - Get private key and RPC URL
2. ✅ **Create wallet** - Set up backend wallet client
3. ✅ **Load permission** - Get permission and signature from frontend
4. ✅ **Send transaction** - Call `approveWithSignature` on contract
5. ✅ **Pay gas** - Backend pays for transaction
6. ✅ **Wait for confirmation** - Ensure transaction is mined
7. ✅ **Permission active** - Now backend can spend from it

### Flow Diagram

```
Backend Script Runs
        ↓
Load .env variables
        ↓
Create wallet client
        ↓
Load permission + signature
        ↓
Call approveWithSignature()
        ↓
Transaction broadcast
        ↓
Wait for mining
        ↓
Transaction confirmed
        ↓
Permission stored on-chain
        ↓
Permission is now ACTIVE!
```

### Key Points

- ✅ Backend pays gas (not user)
- ✅ This is an on-chain transaction
- ✅ Permission is stored permanently
- ✅ Only needs to be done once per permission
- ✅ After approval, backend can spend multiple times

---

## 🧪 Testing the Approval

### How to Test

1. **Run the script**
```bash
cd backend
npm run approve
```

2. **Expected output**
```
📝 Approving permission...

User: 0x3E51E1f0562303ecF9af01A1b4fb62bc5811861d
Spender: 0x0f7282924209a35dE7416d2fb6Bf5c98dC131fA6

✅ Transaction sent: 0xabcdef1234567890...
Waiting for confirmation...
✅ Confirmed in block: 12345678
```

3. **Verify on BaseScan**
- Go to https://sepolia.basescan.org
- Search for transaction hash
- Check status is "Success"
- See contract interaction

### Troubleshooting

**Problem: "Insufficient funds"**
```
Error: insufficient funds for gas
```
**Solution:**
- Backend wallet needs ETH for gas
- Get testnet ETH from faucet
- Check balance: `npm run balance`

**Problem: "Invalid signature"**
```
Error: invalid signature
```
**Solution:**
- Make sure you copied signature correctly
- Check permission object matches exactly
- Verify user signed on correct network

**Problem: "Already approved"**
```
Error: permission already approved
```
**Solution:**
- This permission is already active
- You can proceed to spending
- Or create new permission with different salt

---

## 🚀 Next Steps

Now that the permission is approved, you can spend from it!

Continue to:
- **[Part 5: Backend Spending](./05_BACKEND_SPEND.md)** - Learn how to charge users

---

**Questions?** Check the [Common Questions](./06_FAQ.md) section!
