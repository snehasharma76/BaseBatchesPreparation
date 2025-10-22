# 🎓 Base Spend Permissions - Part 3: Frontend Implementation

## 🎨 What the Frontend Does

The frontend is where **users** interact with your app. Its job is to:
1. Connect the user's wallet
2. Let the user set their allowance
3. Create and sign the permission
4. Display the permission for the backend

**Key point:** The user NEVER pays gas at this stage. It's just a signature!

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND FLOW                         │
└─────────────────────────────────────────────────────────┘

1. Initialize SDK
   ↓
2. User clicks "Connect Wallet"
   ↓
3. Wallet popup appears
   ↓
4. User approves connection
   ↓
5. App receives wallet address
   ↓
6. User enters allowance amount
   ↓
7. User clicks "Create Permission"
   ↓
8. App builds permission object
   ↓
9. App requests signature (EIP-712)
   ↓
10. User signs in wallet (NO GAS!)
    ↓
11. App receives signature
    ↓
12. Display permission + signature
    ↓
13. User copies to backend
```

---

## 📦 Dependencies

### What You Need

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "@base-org/account": "^0.1.0",
    "viem": "^2.0.0"
  }
}
```

**What each does:**
- **react**: UI framework
- **@base-org/account**: Base Account SDK for spend permissions
- **viem**: Ethereum library for blockchain interactions

---

## 🔧 Step-by-Step Code Walkthrough

### Part 1: Imports and Setup

```javascript
import { useState, useEffect } from 'react'
import { createBaseAccountSDK } from '@base-org/account'
import { baseSepolia } from 'viem/chains'
import { parseEther } from 'viem'
```

**What's happening:**
- `useState`, `useEffect`: React hooks for state and side effects
- `createBaseAccountSDK`: Creates the SDK for spend permissions
- `baseSepolia`: The blockchain network (Base Sepolia testnet)
- `parseEther`: Converts ETH to wei

**Beginner explanation:**
```javascript
// useState: Creates a variable that can change
const [count, setCount] = useState(0)  // count starts at 0

// useEffect: Runs code when component loads
useEffect(() => {
  console.log('Component loaded!')
}, [])  // [] means "run once"

// parseEther: Converts human-readable ETH to wei
parseEther('0.01')  // Returns "10000000000000000"
```

---

### Part 2: Constants

```javascript
const BACKEND_WALLET = import.meta.env.VITE_BACKEND_WALLET_ADDRESS
const TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
```

**What's happening:**
- `BACKEND_WALLET`: Loaded from `.env` file
- `TOKEN_ADDRESS`: Special address for native ETH

**Beginner explanation:**
```javascript
// .env file
VITE_BACKEND_WALLET_ADDRESS=0x1234567890123456789012345678901234567890

// In code
const BACKEND_WALLET = import.meta.env.VITE_BACKEND_WALLET_ADDRESS
// Result: "0x1234567890123456789012345678901234567890"
```

**Why use .env?**
- Keeps sensitive data out of code
- Easy to change without modifying code
- Different values for dev/prod

---

### Part 3: State Variables

```javascript
function App() {
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [sdk, setSdk] = useState(null)
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(false)
  const [permission, setPermission] = useState(null)
  const [allowance, setAllowance] = useState('0.01')
```

**What each variable does:**

| Variable | Type | Purpose | Example Value |
|----------|------|---------|---------------|
| `connected` | boolean | Is wallet connected? | `true` / `false` |
| `account` | string | User's wallet address | `"0x742d..."` |
| `sdk` | object | Base Account SDK | SDK instance |
| `provider` | object | Wallet provider | Provider instance |
| `loading` | boolean | Is action in progress? | `true` / `false` |
| `permission` | object | Created permission | Permission object |
| `allowance` | string | User's allowance input | `"0.01"` |

**Beginner explanation:**
```javascript
// State is like a variable that causes re-render when changed
const [count, setCount] = useState(0)

// Reading the value
console.log(count)  // 0

// Updating the value (triggers re-render)
setCount(5)  // count is now 5, component re-renders
```

---

### Part 4: Initialize SDK

```javascript
useEffect(() => {
  const initSDK = () => {
    try {
      const baseSDK = createBaseAccountSDK({
        appName: 'Spend Permissions Demo',
        appLogoUrl: 'https://base.org/logo.png',
        appChainIds: [baseSepolia.id],
      })
      
      setSdk(baseSDK)
      setProvider(baseSDK.getProvider())
      console.log('✅ Base Account SDK initialized')
    } catch (error) {
      console.error('Failed to initialize SDK:', error)
    }
  }
  initSDK()
}, [])
```

**What's happening:**
1. `useEffect` runs when component mounts
2. Creates Base Account SDK with config
3. Stores SDK and provider in state
4. Logs success message

**Configuration explained:**
```javascript
{
  appName: 'Spend Permissions Demo',  // Your app's name
  appLogoUrl: 'https://base.org/logo.png',  // Your app's logo
  appChainIds: [baseSepolia.id],  // Supported chains (84532 = Base Sepolia)
}
```

**Beginner explanation:**
```javascript
// This runs ONCE when the page loads
useEffect(() => {
  console.log('Page loaded!')
  // Setup code here
}, [])  // Empty array = run once

// This runs EVERY time 'count' changes
useEffect(() => {
  console.log('Count changed:', count)
}, [count])  // Runs when count changes
```

**Why we need this:**
- SDK must be initialized before use
- Provider is needed to communicate with wallet
- Only needs to happen once

---

### Part 5: Connect Wallet

```javascript
const handleConnect = async () => {
  if (!provider || !sdk) {
    alert('SDK not initialized. Please refresh the page.')
    return
  }
  
  setLoading(true)
  try {
    // Connect to Base Account
    await provider.request({ method: 'wallet_connect' })
    
    // Get the connected account
    const accounts = await provider.request({ method: 'eth_requestAccounts' })
    
    setAccount(accounts[0])
    setConnected(true)
    console.log('✅ Connected to Base Account:', accounts[0])
  } catch (error) {
    console.error('Connection error:', error)
    alert('Failed to connect to Base Account. Please try again.')
  } finally {
    setLoading(false)
  }
}
```

**Step-by-step breakdown:**

**Step 1: Validation**
```javascript
if (!provider || !sdk) {
  alert('SDK not initialized. Please refresh the page.')
  return
}
```
- Checks if SDK is ready
- Shows error if not initialized
- Prevents errors from proceeding

**Step 2: Show loading state**
```javascript
setLoading(true)
```
- Disables button
- Shows "Connecting..." text
- Prevents double-clicks

**Step 3: Request connection**
```javascript
await provider.request({ method: 'wallet_connect' })
```
- Opens wallet popup
- User approves connection
- `await` waits for user response

**Step 4: Get account address**
```javascript
const accounts = await provider.request({ method: 'eth_requestAccounts' })
```
- Requests user's wallet addresses
- Returns array of addresses
- Usually just one address

**Step 5: Update state**
```javascript
setAccount(accounts[0])  // Store address
setConnected(true)  // Mark as connected
```
- Saves user's address
- Updates UI to show connected state

**Step 6: Error handling**
```javascript
catch (error) {
  console.error('Connection error:', error)
  alert('Failed to connect to Base Account. Please try again.')
}
```
- Catches any errors
- Shows user-friendly message
- Logs error for debugging

**Step 7: Cleanup**
```javascript
finally {
  setLoading(false)
}
```
- Always runs (success or error)
- Hides loading state
- Re-enables button

**Beginner explanation:**
```javascript
// async/await: Wait for asynchronous operations
async function fetchData() {
  const response = await fetch('https://api.example.com/data')
  const data = await response.json()
  return data
}

// try/catch: Handle errors gracefully
try {
  const result = await riskyOperation()
  console.log('Success:', result)
} catch (error) {
  console.log('Error:', error)
} finally {
  console.log('Always runs')
}
```

---

### Part 6: Create Permission (The Main Event!)

This is the most important function. Let's break it down carefully:

```javascript
const handleCreatePermission = async () => {
  // Step 1: Validation
  if (!BACKEND_WALLET || BACKEND_WALLET === '0x0000000000000000000000000000000000000000') {
    alert('Please set VITE_BACKEND_WALLET_ADDRESS in .env file')
    return
  }

  setLoading(true)
  try {
    // Step 2: Build permission object
    const permission = {
      account,
      spender: BACKEND_WALLET,
      token: TOKEN_ADDRESS,
      allowance: parseEther(allowance).toString(),
      period: 2592000,
      start: Math.floor(Date.now() / 1000),
      end: 281474976710655,
      salt: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      extraData: '0x'
    }
```

**Step 1: Validation**
- Ensures backend wallet is configured
- Prevents creating invalid permissions

**Step 2: Build Permission**

Let's look at each field:

```javascript
account,  // User's connected wallet address
```
- Uses the address from `handleConnect`
- Example: `"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"`

```javascript
spender: BACKEND_WALLET,  // Backend wallet from .env
```
- Who can spend the money
- Example: `"0x1234567890123456789012345678901234567890"`

```javascript
token: TOKEN_ADDRESS,  // Native ETH
```
- What currency to spend
- `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` = ETH

```javascript
allowance: parseEther(allowance).toString(),  // Convert to wei
```
- User's input converted to wei
- Example: `"0.01"` → `"10000000000000000"`

```javascript
period: 2592000,  // 30 days in seconds
```
- How often allowance resets
- 30 days = 2,592,000 seconds

```javascript
start: Math.floor(Date.now() / 1000),  // Current timestamp
```
- When permission becomes active
- `Date.now()` returns milliseconds, divide by 1000 for seconds

```javascript
end: 281474976710655,  // Maximum uint48
```
- When permission expires
- This value means "never expire"

```javascript
salt: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
```
- Random unique identifier
- Makes each permission unique

```javascript
extraData: '0x'  // No extra data
```
- Optional field for advanced use
- Usually just `'0x'`

---

#### EIP-712 Signing

```javascript
    // Step 3: Define EIP-712 structure
    const domain = {
      name: 'Spend Permission Manager',
      version: '1',
      chainId: baseSepolia.id,
      verifyingContract: '0xf85210B21cC50302F477BA56686d2019dC9b67Ad'
    }

    const types = {
      SpendPermission: [
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
    }
```

**What is EIP-712?**
- Standard for signing structured data
- Makes signatures readable in wallets
- Prevents signature replay attacks

**Domain explained:**
```javascript
{
  name: 'Spend Permission Manager',  // Contract name
  version: '1',  // Contract version
  chainId: baseSepolia.id,  // Network ID (84532)
  verifyingContract: '0xf85...'  // Contract address
}
```

**Types explained:**
- Defines the structure of the permission
- Each field has a name and Solidity type
- Must match the contract's structure exactly

**Why this matters:**
- Prevents using signature on wrong contract
- Prevents using signature on wrong network
- Makes signature human-readable in wallet

**What user sees in wallet:**
```
Sign Typed Data
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Spend Permission Manager (v1)
Network: Base Sepolia

account: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
spender: 0x1234567890123456789012345678901234567890
token: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
allowance: 10000000000000000
period: 2592000
start: 1760523523
end: 281474976710655
salt: 0xaf9535e1ae342af4c1083302d2
extraData: 0x

[Cancel] [Sign]
```

---

#### Request Signature

```javascript
    // Step 4: Request signature
    const signature = await provider.request({
      method: 'eth_signTypedData_v4',
      params: [account, JSON.stringify({ domain, types, primaryType: 'SpendPermission', message: permission })]
    })
```

**What's happening:**
1. Calls wallet's signing method
2. Passes account, domain, types, and permission
3. Wallet shows readable message to user
4. User signs (NO GAS FEE!)
5. Returns signature

**Parameters explained:**
```javascript
{
  method: 'eth_signTypedData_v4',  // EIP-712 signing method
  params: [
    account,  // Who is signing
    JSON.stringify({
      domain,  // Contract info
      types,  // Data structure
      primaryType: 'SpendPermission',  // Main type
      message: permission  // The actual data
    })
  ]
}
```

**Signature format:**
```javascript
// Example signature (hex string)
"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12"
```

---

#### Display Results

```javascript
    // Step 5: Store permission
    const newPermission = {
      permission,
      signature
    }
    setPermission(newPermission)
    
    // Step 6: Log for backend
    console.log('========================================')
    console.log('✅ SPEND PERMISSION CREATED!')
    console.log('========================================')
    console.log('\n📋 COPY THIS TO BACKEND SCRIPTS:\n')
    console.log('// Permission object:')
    console.log(JSON.stringify(newPermission.permission, null, 2))
    console.log('\n// Signature:')
    console.log(`"${newPermission.signature}"`)
    console.log('\n========================================')
    
    alert('✅ Permission created! Open browser console (F12) to copy the details.')
  } catch (error) {
    console.error('Error:', error)
    alert('Failed to create permission')
  } finally {
    setLoading(false)
  }
}
```

**What's happening:**
1. Combines permission and signature
2. Saves to state (updates UI)
3. Logs to console for easy copying
4. Shows alert to user

**Console output:**
```
========================================
✅ SPEND PERMISSION CREATED!
========================================

📋 COPY THIS TO BACKEND SCRIPTS:

// Permission object:
{
  "account": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "spender": "0x1234567890123456789012345678901234567890",
  "token": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "allowance": "10000000000000000",
  "period": 2592000,
  "start": 1760523523,
  "end": 281474976710655,
  "salt": "0xaf9535e1ae342af4c1083302d2",
  "extraData": "0x"
}

// Signature:
"0x1234567890abcdef..."

========================================
```

---

## 🎯 Frontend Summary

### What the Frontend Does

1. ✅ **Initialize SDK** - Set up Base Account SDK
2. ✅ **Connect Wallet** - Get user's wallet address
3. ✅ **Build Permission** - Create permission object
4. ✅ **Request Signature** - Ask user to sign (off-chain, no gas!)
5. ✅ **Display Results** - Show permission and signature

### User Experience Flow

```
1. User opens app
   ↓
2. Clicks "Connect Wallet"
   ↓
3. Wallet popup appears
   ↓
4. User approves connection
   ↓
5. App shows connected state
   ↓
6. User enters allowance (e.g., 0.01 ETH)
   ↓
7. User clicks "Create Permission"
   ↓
8. Wallet shows signature request
   ↓
9. User signs (NO GAS!)
   ↓
10. App shows success message
    ↓
11. User opens console (F12)
    ↓
12. User copies permission and signature
    ↓
13. User pastes into backend scripts
```

### Key Points

- ✅ User NEVER pays gas in frontend
- ✅ Signing is off-chain (just a message)
- ✅ Permission is not active yet (needs backend approval)
- ✅ User can create multiple permissions
- ✅ Each permission has unique salt

---

## 🚀 Next Steps

Now that you understand the frontend, continue to:
- **[Part 4: Backend Approval](./04_BACKEND_APPROVE.md)** - Learn how to activate permissions on-chain
- **[Part 5: Backend Spending](./05_BACKEND_SPEND.md)** - Learn how to charge users

---

**Questions?** Check the [Common Questions](./06_FAQ.md) section!
