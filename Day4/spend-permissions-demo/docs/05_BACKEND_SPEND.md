# 🎓 Base Spend Permissions - Part 5: Backend Spending

## 💸 What "Spending" Means

After a permission is approved, the backend can **pull ETH** from the user's wallet.

This is the main feature of spend permissions:
- Backend decides when to charge
- Backend specifies how much to charge
- Contract enforces allowance limits
- User doesn't need to approve each time

**Analogy:** Like a gym charging your credit card monthly - you authorized it once, they charge automatically.

---

## 🔄 The Spending Flow

```
┌─────────────────────────────────────────────────────────┐
│                    SPENDING PROCESS                      │
└─────────────────────────────────────────────────────────┘

1. Permission is approved (from Part 4)
   ↓
2. Backend decides to charge user
   ↓
3. Backend calls SpendPermissionManager.spend()
   ↓
4. Contract checks:
   ✓ Permission exists and is approved
   ✓ Amount ≤ remaining allowance
   ✓ Current time within valid period
   ✓ Caller is the approved spender
   ↓
5. Contract transfers ETH from user to backend
   ↓
6. Contract updates spent amount
   ↓
7. Backend pays gas fee
   ↓
8. Transaction confirmed
   ↓
9. Backend receives ETH!
```

---

## 🔧 Step-by-Step Code Walkthrough

Let's go through `spendFromPermission.js` section by section:

### Part 1: Imports

```javascript
import { createWalletClient, http, publicActions, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import dotenv from 'dotenv'

dotenv.config()
```

**What's happening:**
- Same imports as approval script
- Plus `parseEther` to convert ETH to wei

**New import explained:**
```javascript
import { parseEther } from 'viem'

// Convert ETH to wei
parseEther('0.01')  // Returns 10000000000000000n
parseEther('1')     // Returns 1000000000000000000n
```

**Beginner explanation:**
```javascript
// parseEther converts human-readable ETH to wei
const amount = parseEther('0.01')
console.log(amount)  // 10000000000000000n

// The 'n' at the end means it's a BigInt (large number)
```

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

**What's happening:**
- Identical to approval script
- Creates backend wallet client
- Loads contract address

**Review:**
- `account`: Backend wallet (who's spending)
- `client`: Tool for sending transactions
- `SPEND_PERMISSION_MANAGER`: Contract address

---

### Part 3: Permission Object

```javascript
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
```

**Important:** This must be the EXACT same permission you approved!

**Why?**
- Contract identifies permissions by their hash
- Hash is calculated from all fields
- If any field differs, it's a different permission
- Different permission = not approved = transaction fails

**Beginner explanation:**
```javascript
// Permission is like a unique ID card

// Original permission (approved)
const permission1 = {
  account: "0xABC...",
  allowance: "10000000000000000",
  // ... other fields
}

// If you change ANY field, it's a different permission
const permission2 = {
  account: "0xABC...",
  allowance: "20000000000000000",  // Changed!
  // ... other fields
}

// permission1 ≠ permission2
// Only permission1 is approved!
```

---

### Part 4: Amount to Spend

```javascript
// ========================================
// AMOUNT TO SPEND (change this value)
// ========================================
const amountToSpend = '0.000001' // ETH (must be ≤ allowance)
```

**What's happening:**
- This is how much ETH to pull from user
- Must be ≤ remaining allowance
- Written in human-readable ETH (not wei)

**Examples:**
```javascript
// Small amount
const amountToSpend = '0.000001'  // 0.000001 ETH

// Medium amount
const amountToSpend = '0.01'  // 0.01 ETH

// Large amount
const amountToSpend = '1'  // 1 ETH
```

**Important rules:**
1. Amount must be ≤ allowance
2. Amount must be ≤ remaining allowance for this period
3. Amount must be > 0

**Beginner explanation:**
```javascript
// Permission allows 0.01 ETH per 30 days

// ✅ Valid amounts
amountToSpend = '0.005'   // Half the allowance
amountToSpend = '0.01'    // Full allowance
amountToSpend = '0.001'   // Small amount

// ❌ Invalid amounts
amountToSpend = '0.02'    // Exceeds allowance!
amountToSpend = '0'       // Must be > 0
amountToSpend = '-0.01'   // Can't be negative
```

**Tracking spent amounts:**
```javascript
// Scenario: Allowance is 0.01 ETH per 30 days

// Day 1: Spend 0.005 ETH
// Remaining: 0.005 ETH

// Day 15: Spend 0.003 ETH
// Remaining: 0.002 ETH

// Day 20: Try to spend 0.005 ETH
// ❌ Fails! Only 0.002 ETH remaining

// Day 31: New period starts
// Remaining: 0.01 ETH (reset!)
```

---

### Part 5: Contract ABI

```javascript
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
```

**What's different from approval ABI:**
- Function name: `spend` (not `approveWithSignature`)
- Second parameter: `value` (not `signature`)

**Breaking down the ABI:**
```javascript
{
  name: 'spend',  // Function name
  type: 'function',
  inputs: [
    {
      name: 'spendPermission',  // First parameter: permission object
      type: 'tuple',  // It's an object
      components: [...]  // Same structure as approval
    },
    {
      name: 'value',  // Second parameter: amount to spend
      type: 'uint160'  // Unsigned integer (wei)
    }
  ]
}
```

**Beginner explanation:**
```javascript
// The spend function takes 2 parameters:

// 1. Permission object (identifies which permission)
const permission = {
  account: "0xABC...",
  spender: "0x123...",
  // ... other fields
}

// 2. Amount to spend (how much to pull)
const value = parseEther('0.01')  // 10000000000000000

// Call the function
await contract.spend(permission, value)
```

---

### Part 6: Main Function

```javascript
async function main() {
  console.log('💸 Spending from permission...\n')
  console.log('From:', permission.account)
  console.log('Amount:', amountToSpend, 'ETH')
  
  const amount = parseEther(amountToSpend)
  
  const hash = await client.writeContract({
    address: SPEND_PERMISSION_MANAGER,
    abi,
    functionName: 'spend',
    args: [permission, amount]
  })
  
  console.log('\n✅ Transaction sent:', hash)
  console.log('Waiting for confirmation...')
  
  const receipt = await client.waitForTransactionReceipt({ hash })
  console.log('✅ Confirmed in block:', receipt.blockNumber.toString())
  console.log('✅ ETH transferred to backend wallet!')
}

main().catch(console.error)
```

**Step-by-step breakdown:**

#### Step 1: Log Information

```javascript
console.log('💸 Spending from permission...\n')
console.log('From:', permission.account)
console.log('Amount:', amountToSpend, 'ETH')
```

**Output:**
```
💸 Spending from permission...

From: 0x3E51E1f0562303ecF9af01A1b4fb62bc5811861d
Amount: 0.000001 ETH
```

#### Step 2: Convert Amount to Wei

```javascript
const amount = parseEther(amountToSpend)
```

**What's happening:**
- Converts ETH string to wei BigInt
- Contract expects wei, not ETH

**Example:**
```javascript
const amountToSpend = '0.01'
const amount = parseEther(amountToSpend)
console.log(amount)  // 10000000000000000n
```

**Beginner explanation:**
```javascript
// Humans think in ETH
amountToSpend = '0.01'  // 0.01 ETH

// Contracts think in wei
amount = parseEther('0.01')  // 10000000000000000 wei

// Always convert before sending to contract!
```

#### Step 3: Send Transaction

```javascript
const hash = await client.writeContract({
  address: SPEND_PERMISSION_MANAGER,
  abi,
  functionName: 'spend',
  args: [permission, amount]
})
```

**What's happening:**
- Calls `spend` function on contract
- Passes permission and amount
- Returns transaction hash

**Parameters:**
```javascript
{
  address: SPEND_PERMISSION_MANAGER,  // Contract address
  abi,  // Function definition
  functionName: 'spend',  // Which function to call
  args: [permission, amount]  // Function arguments
}
```

**What happens on-chain:**
1. Contract receives transaction
2. Verifies permission is approved
3. Checks amount ≤ remaining allowance
4. Checks caller is approved spender
5. Transfers ETH from user to backend
6. Updates spent amount
7. Emits event

**Beginner explanation:**
```javascript
// Think of it like using a debit card

await contract.spend(permission, amount)
// 1. Show the card (permission)
// 2. Specify amount (amount)
// 3. Card reader checks balance (contract checks allowance)
// 4. Transfer money (ETH moves from user to backend)
```

#### Step 4: Wait for Confirmation

```javascript
console.log('\n✅ Transaction sent:', hash)
console.log('Waiting for confirmation...')

const receipt = await client.waitForTransactionReceipt({ hash })
console.log('✅ Confirmed in block:', receipt.blockNumber.toString())
console.log('✅ ETH transferred to backend wallet!')
```

**Output:**
```
✅ Transaction sent: 0xabcdef1234567890...
Waiting for confirmation...
✅ Confirmed in block: 12345678
✅ ETH transferred to backend wallet!
```

**What's happening:**
- Waits for transaction to be mined
- Gets receipt (proof of transaction)
- Confirms ETH was transferred

---

## 🔍 What Happens On-Chain

### Inside the Contract

When you call `spend`, the contract:

1. **Calculate permission hash**
```solidity
bytes32 permissionHash = hash(permission)
```

2. **Check permission is approved**
```solidity
require(isApproved[permissionHash], "Permission not approved")
```

3. **Check caller is spender**
```solidity
require(msg.sender == permission.spender, "Not authorized spender")
```

4. **Check amount within allowance**
```solidity
uint160 spent = getSpentAmount(permissionHash, currentPeriod)
require(spent + value <= permission.allowance, "Exceeds allowance")
```

5. **Check time validity**
```solidity
require(block.timestamp >= permission.start, "Not started yet")
require(block.timestamp <= permission.end, "Expired")
```

6. **Transfer ETH**
```solidity
// Transfer from user to spender
user.transfer(spender, value)
```

7. **Update spent amount**
```solidity
spentAmounts[permissionHash][currentPeriod] += value
```

8. **Emit event**
```solidity
emit Spent(permission.account, permission.spender, value, permissionHash)
```

### Period Tracking

**How periods work:**
```javascript
// Permission: 0.01 ETH per 30 days, starting Jan 1

// Period 1: Jan 1 - Jan 31
// Can spend up to 0.01 ETH

// Period 2: Jan 31 - Mar 2
// Can spend up to 0.01 ETH (resets!)

// Period 3: Mar 2 - Apr 1
// Can spend up to 0.01 ETH (resets!)
```

**Contract calculates current period:**
```solidity
uint48 currentPeriod = (block.timestamp - permission.start) / permission.period
```

**Example:**
```javascript
// Permission starts: Jan 1, 2025 (timestamp: 1735689600)
// Period: 30 days (2592000 seconds)
// Current time: Jan 15, 2025 (timestamp: 1736899200)

// Calculate period
currentPeriod = (1736899200 - 1735689600) / 2592000
currentPeriod = 1209600 / 2592000
currentPeriod = 0  // Still in first period

// Current time: Feb 5, 2025 (timestamp: 1738713600)
currentPeriod = (1738713600 - 1735689600) / 2592000
currentPeriod = 3024000 / 2592000
currentPeriod = 1  // Second period (allowance reset!)
```

---

## 💰 Gas Costs and Economics

### Gas Usage

**Typical gas for spending:**
- First spend: ~100,000 gas
- Subsequent spends: ~50,000 gas

**Cost calculation:**
```javascript
// At 1 gwei gas price
100,000 gas × 1 gwei = 0.0001 ETH

// At $2000/ETH
0.0001 ETH × $2000 = $0.20
```

### Who Pays What?

| Action | Who Pays Gas? | Who Receives ETH? |
|--------|---------------|-------------------|
| Create permission | Nobody (off-chain) | N/A |
| Approve permission | Backend | N/A |
| Spend from permission | Backend | Backend |

**Economics:**
```javascript
// Scenario: Backend charges user 0.01 ETH

// Backend costs:
Gas for approval: 0.00015 ETH
Gas for spending: 0.0001 ETH
Total cost: 0.00025 ETH

// Backend receives:
From user: 0.01 ETH

// Backend profit:
0.01 - 0.00025 = 0.00975 ETH
```

---

## 🔁 Spending Multiple Times

### Reusing the Same Permission

You can call `spend` multiple times with the same permission!

**Example:**
```javascript
// Permission: 0.01 ETH per 30 days

// Week 1: Spend 0.002 ETH
await contract.spend(permission, parseEther('0.002'))
// Remaining: 0.008 ETH

// Week 2: Spend 0.003 ETH
await contract.spend(permission, parseEther('0.003'))
// Remaining: 0.005 ETH

// Week 3: Spend 0.005 ETH
await contract.spend(permission, parseEther('0.005'))
// Remaining: 0 ETH

// Week 4: Try to spend 0.001 ETH
await contract.spend(permission, parseEther('0.001'))
// ❌ Fails! Allowance exhausted

// Week 5 (new period): Spend 0.01 ETH
await contract.spend(permission, parseEther('0.01'))
// ✅ Success! Allowance reset
```

### Automating Recurring Payments

**Use case: Monthly subscription**

```javascript
// Run this script monthly
async function chargeMonthlySubscription() {
  const subscriptionFee = '0.01'  // 0.01 ETH per month
  
  try {
    const hash = await client.writeContract({
      address: SPEND_PERMISSION_MANAGER,
      abi,
      functionName: 'spend',
      args: [permission, parseEther(subscriptionFee)]
    })
    
    console.log('✅ Monthly charge successful:', hash)
  } catch (error) {
    console.error('❌ Monthly charge failed:', error)
    // Handle error (e.g., notify user, pause subscription)
  }
}

// Schedule with cron job
// 0 0 1 * * - Run at midnight on 1st of each month
```

---

## 🎯 Backend Spending Summary

### What the Backend Does

1. ✅ **Load permission** - Same permission that was approved
2. ✅ **Set amount** - How much to charge user
3. ✅ **Convert to wei** - Use parseEther
4. ✅ **Call spend()** - Send transaction to contract
5. ✅ **Pay gas** - Backend pays transaction fee
6. ✅ **Receive ETH** - User's ETH transferred to backend
7. ✅ **Repeat** - Can spend multiple times until allowance exhausted

### Flow Diagram

```
Backend decides to charge user
        ↓
Load approved permission
        ↓
Set amount to spend
        ↓
Convert ETH to wei
        ↓
Call spend() on contract
        ↓
Contract verifies:
  ✓ Permission approved?
  ✓ Amount ≤ allowance?
  ✓ Within time period?
  ✓ Caller is spender?
        ↓
Contract transfers ETH
        ↓
Transaction confirmed
        ↓
Backend receives ETH!
```

### Key Points

- ✅ Can spend multiple times from same permission
- ✅ Must stay within allowance limits
- ✅ Allowance resets each period
- ✅ Backend pays gas each time
- ✅ User doesn't need to approve each spend
- ✅ User can revoke permission anytime

---

## 🧪 Testing the Spending

### How to Test

1. **Make sure permission is approved first!**
```bash
cd backend
npm run approve  # If not done already
```

2. **Run the spend script**
```bash
npm run spend
```

3. **Expected output**
```
💸 Spending from permission...

From: 0x3E51E1f0562303ecF9af01A1b4fb62bc5811861d
Amount: 0.000001 ETH

✅ Transaction sent: 0xabcdef1234567890...
Waiting for confirmation...
✅ Confirmed in block: 12345678
✅ ETH transferred to backend wallet!
```

4. **Check backend balance**
```bash
npm run balance
```

5. **Verify on BaseScan**
- Go to https://sepolia.basescan.org
- Search for transaction hash
- See ETH transfer from user to backend

### Troubleshooting

**Problem: "Permission not approved"**
```
Error: permission not approved
```
**Solution:**
- Run `npm run approve` first
- Make sure permission object is exactly the same

**Problem: "Exceeds allowance"**
```
Error: exceeds allowance
```
**Solution:**
- Reduce amount to spend
- Check remaining allowance for current period
- Wait for new period to start

**Problem: "Not authorized spender"**
```
Error: not authorized spender
```
**Solution:**
- Make sure you're using the correct backend wallet
- Check spender address in permission matches your wallet

**Problem: "Permission expired"**
```
Error: permission expired
```
**Solution:**
- Check permission.end timestamp
- Create new permission with later end date

---

## 🚀 Next Steps

Congratulations! You now understand the complete spend permissions flow!

Continue to:
- **[Part 6: Security & Best Practices](./06_SECURITY.md)** - Learn how to build safely
- **[Common Questions](./07_FAQ.md)** - Get answers to common questions

---

**Questions?** Check the [Common Questions](./07_FAQ.md) section!
