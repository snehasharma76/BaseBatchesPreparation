# 🎓 Base Spend Permissions - Part 2: Permission Structure

## 📦 What's Inside a Permission?

A permission is a JavaScript object with specific fields. Let's break down each field:

```javascript
const permission = {
  account: "0x3E51E1f0562303ecF9af01A1b4fb62bc5811861d",
  spender: "0x0f7282924209a35dE7416d2fb6Bf5c98dC131fA6",
  token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  allowance: "1000000000000",
  period: 2592000,
  start: 1760523523,
  end: 281474976710655,
  salt: "0xaf9535e1ae342af4c1083302d2",
  extraData: "0x"
}
```

---

## 🔍 Field-by-Field Explanation

### 1. **`account`** (User's Wallet Address)

```javascript
account: "0x3E51E1f0562303ecF9af01A1b4fb62bc5811861d"
```

**What it is:** The user's wallet address (the person giving permission)

**Why it matters:** This is WHO is allowing their money to be spent

**Format:** 
- Ethereum address (42 characters)
- Starts with `0x`
- Contains hexadecimal characters (0-9, a-f)

**Beginner tip:** This is like writing your name on a permission slip

**Example:**
```javascript
// User's wallet address from connected wallet
account: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

---

### 2. **`spender`** (Backend Wallet Address)

```javascript
spender: "0x0f7282924209a35dE7416d2fb6Bf5c98dC131fA6"
```

**What it is:** The backend wallet address (the one who can spend)

**Why it matters:** This is WHO can take money from the user

**Security:** Only THIS specific address can use the permission!

**Beginner tip:** This is like saying "Netflix can charge my card"

**Example:**
```javascript
// Backend wallet address (from .env file)
spender: "0x1234567890123456789012345678901234567890"
```

**Important notes:**
- Must be a valid Ethereum address
- Usually your backend server's wallet
- Can't be changed after permission is created
- If you lose access to this wallet, you can't use the permission

---

### 3. **`token`** (What Currency)

```javascript
token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
```

**What it is:** The token address (what type of money)

**Special case:** This specific address means **native ETH**

**Why it matters:** Defines if you're spending ETH, USDC, or other tokens

**Beginner tip:** Different tokens have different addresses

**Common token addresses:**

| Token | Address | Description |
|-------|---------|-------------|
| Native ETH | `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` | The blockchain's native currency |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | Stablecoin (Base Mainnet) |
| DAI | `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb` | Stablecoin (Base Mainnet) |

**Example:**
```javascript
// For native ETH
token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

// For USDC
token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
```

---

### 4. **`allowance`** (Maximum Amount)

```javascript
allowance: "1000000000000"  // This is 0.000001 ETH in wei
```

**What it is:** Maximum amount that can be spent per period

**Format:** Written in **wei** (smallest unit of ETH)

**Understanding wei:**
- 1 ETH = 1,000,000,000,000,000,000 wei (18 zeros!)
- 1 wei = 0.000000000000000001 ETH

**Conversion table:**

| ETH | Wei |
|-----|-----|
| 1 ETH | 1000000000000000000 |
| 0.1 ETH | 100000000000000000 |
| 0.01 ETH | 10000000000000000 |
| 0.001 ETH | 1000000000000000 |
| 0.0001 ETH | 100000000000000 |

**Why it matters:** This is your spending limit - backend can't exceed this

**Beginner tip:** Like setting a $50 monthly limit on a subscription

**How to convert in code:**
```javascript
import { parseEther } from 'viem'

// Convert ETH to wei
const allowance = parseEther('0.01')  // Returns "10000000000000000"

// Convert wei to ETH
const eth = formatEther('10000000000000000')  // Returns "0.01"
```

**Example:**
```javascript
// Allow 0.01 ETH per period
allowance: parseEther('0.01').toString()  // "10000000000000000"

// Allow 1 ETH per period
allowance: parseEther('1').toString()  // "1000000000000000000"
```

---

### 5. **`period`** (Time Window)

```javascript
period: 2592000  // 30 days in seconds
```

**What it is:** How long the allowance lasts (in seconds)

**Why it matters:** Allowance resets after this period

**Common values:**

| Duration | Seconds | Use Case |
|----------|---------|----------|
| 1 hour | 3,600 | Hourly services |
| 1 day | 86,400 | Daily subscriptions |
| 1 week | 604,800 | Weekly payments |
| 30 days | 2,592,000 | Monthly subscriptions |
| 1 year | 31,536,000 | Annual memberships |

**Beginner tip:** Like saying "per month" or "per week"

**How it works:**
```
User approves: 0.01 ETH per 30 days

Day 1: Backend spends 0.005 ETH ✅ (0.005 used, 0.005 remaining)
Day 15: Backend spends 0.005 ETH ✅ (0.01 used, 0 remaining)
Day 20: Backend tries 0.001 ETH ❌ (Exceeds allowance)
Day 31: Period resets! Backend can spend 0.01 ETH again ✅
```

**Example:**
```javascript
// 30 days
period: 30 * 24 * 60 * 60  // 2592000

// 7 days
period: 7 * 24 * 60 * 60  // 604800

// 1 day
period: 24 * 60 * 60  // 86400
```

---

### 6. **`start`** (When It Begins)

```javascript
start: 1760523523  // Unix timestamp
```

**What it is:** When the permission becomes active (Unix timestamp)

**Format:** Seconds since January 1, 1970 (Unix epoch)

**Why it matters:** Permission won't work before this time

**Beginner tip:** Usually set to "right now"

**How to get current timestamp:**
```javascript
// JavaScript
const start = Math.floor(Date.now() / 1000)

// Example: 1760523523 = October 15, 2025, 5:42:03 PM UTC
```

**Use cases:**

1. **Immediate activation** (most common):
```javascript
start: Math.floor(Date.now() / 1000)  // Right now
```

2. **Future activation**:
```javascript
// Start in 7 days
const sevenDaysFromNow = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
start: sevenDaysFromNow
```

3. **Specific date**:
```javascript
// Start on January 1, 2026
const specificDate = new Date('2026-01-01').getTime() / 1000
start: Math.floor(specificDate)
```

---

### 7. **`end`** (When It Expires)

```javascript
end: 281474976710655  // Maximum possible value
```

**What it is:** When the permission expires (Unix timestamp)

**Special case:** This huge number means "never expire"

**Why it matters:** Permission automatically stops working after this

**Beginner tip:** You can set this to a specific date if you want

**Understanding the max value:**
- `281474976710655` is the maximum value for a `uint48` (48-bit unsigned integer)
- Represents a date far in the future (year 8921455!)
- Effectively means "never expire"

**Use cases:**

1. **Never expire** (most common):
```javascript
end: 281474976710655  // Maximum uint48 value
```

2. **Expire after 1 year**:
```javascript
const oneYearFromNow = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)
end: oneYearFromNow
```

3. **Expire on specific date**:
```javascript
const expiryDate = new Date('2026-12-31').getTime() / 1000
end: Math.floor(expiryDate)
```

**Example:**
```javascript
// Permission valid for 1 year
const now = Math.floor(Date.now() / 1000)
const oneYear = 365 * 24 * 60 * 60

start: now,
end: now + oneYear
```

---

### 8. **`salt`** (Unique Identifier)

```javascript
salt: "0xaf9535e1ae342af4c1083302d2"
```

**What it is:** A random number to make this permission unique

**Why it matters:** Prevents duplicate permissions

**Format:** Hexadecimal string (starts with `0x`)

**Beginner tip:** Like a serial number - makes each permission one-of-a-kind

**How to generate:**
```javascript
// Method 1: Simple random
const salt = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`

// Method 2: Using crypto (more secure)
const salt = `0x${crypto.randomUUID().replace(/-/g, '')}`

// Method 3: Timestamp + random
const salt = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`
```

**Why we need salt:**
```
Without salt:
User creates permission for 0.01 ETH/month
User creates another permission for 0.01 ETH/month
❌ Both have same hash! Contract rejects duplicate

With salt:
User creates permission with salt: 0xabc123
User creates another with salt: 0xdef456
✅ Different hashes! Both accepted
```

**Example:**
```javascript
// Generate unique salt
salt: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`

// Result: "0xaf9535e1ae342af4c1083302d2"
```

---

### 9. **`extraData`** (Additional Info)

```javascript
extraData: "0x"
```

**What it is:** Optional extra data (advanced feature)

**Common value:** `"0x"` (empty, no extra data)

**Why it matters:** Can be used for custom logic in the future

**Beginner tip:** Usually just leave this as `"0x"`

**Advanced use cases:**
- Metadata about the permission
- Custom validation logic
- Integration with other contracts
- Tracking information

**Example:**
```javascript
// Empty (most common)
extraData: "0x"

// With custom data (advanced)
extraData: "0x1234567890abcdef"  // Encoded custom data
```

---

## 🎯 Permission Summary

Think of a permission as a **contract** that says:

> "I, **[account]**, allow **[spender]** to take up to **[allowance]** of **[token]** 
> every **[period]** seconds, starting at **[start]** and ending at **[end]**."

### Complete Example

```javascript
const permission = {
  // WHO is giving permission
  account: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  
  // WHO can spend
  spender: "0x1234567890123456789012345678901234567890",
  
  // WHAT currency (native ETH)
  token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  
  // HOW MUCH per period (0.01 ETH in wei)
  allowance: "10000000000000000",
  
  // HOW OFTEN (30 days in seconds)
  period: 2592000,
  
  // WHEN it starts (now)
  start: 1760523523,
  
  // WHEN it expires (never)
  end: 281474976710655,
  
  // UNIQUE identifier
  salt: "0xaf9535e1ae342af4c1083302d2",
  
  // EXTRA data (none)
  extraData: "0x"
}
```

**In plain English:**
> "I (0x742d...) allow the backend (0x1234...) to spend up to 0.01 ETH 
> every 30 days, starting now and never expiring."

---

## 🧪 Practice Exercise

Try creating your own permission! Fill in the blanks:

```javascript
const myPermission = {
  account: "YOUR_WALLET_ADDRESS",
  spender: "BACKEND_WALLET_ADDRESS",
  token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",  // ETH
  allowance: parseEther("0.05").toString(),  // 0.05 ETH
  period: 7 * 24 * 60 * 60,  // 7 days
  start: Math.floor(Date.now() / 1000),  // Now
  end: 281474976710655,  // Never expire
  salt: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  extraData: "0x"
}
```

**What does this permission do?**
- Allows backend to spend up to 0.05 ETH
- Every 7 days
- Starting now
- Never expires

---

## 🚀 Next Steps

Now that you understand the permission structure, continue to:
- **[Part 3: Frontend Implementation](./03_FRONTEND.md)** - Learn how to create permissions in the UI
- **[Part 4: Backend Approval](./04_BACKEND_APPROVE.md)** - Learn how to activate permissions
- **[Part 5: Backend Spending](./05_BACKEND_SPEND.md)** - Learn how to charge users

---

**Questions?** Check the [Common Questions](./06_FAQ.md) section!
