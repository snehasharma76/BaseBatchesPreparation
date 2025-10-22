# 🎓 Base Spend Permissions - Common Questions (FAQ)

## 📚 Table of Contents

1. [General Concepts](#general-concepts)
2. [Frontend Questions](#frontend-questions)
3. [Backend Questions](#backend-questions)
4. [Security Questions](#security-questions)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Topics](#advanced-topics)

---

## General Concepts

### Q: What exactly is a spend permission?

**A:** A spend permission is like a pre-authorization that lets a backend wallet pull funds from a user's wallet automatically, up to a specified limit and time period.

**Real-world analogy:** It's like giving your gym your credit card details - you authorize once, they charge you monthly without asking each time.

---

### Q: Why use spend permissions instead of regular transactions?

**A:** Benefits:
- **Better UX**: Users don't need to approve every transaction
- **No user gas fees**: Backend pays all gas fees
- **Recurring payments**: Perfect for subscriptions
- **Automated**: Backend can charge automatically
- **Controlled**: Users set limits and can revoke anytime

---

### Q: Who pays gas fees?

**A:** 
- **User**: Pays NO gas fees (only signs a message)
- **Backend**: Pays gas for approval and all spending transactions

**Cost breakdown:**
```
User creates permission: FREE (just a signature)
Backend approves: ~$0.30 (backend pays)
Backend spends: ~$0.10-0.20 per transaction (backend pays)
```

---

### Q: Can the backend steal all my money?

**A:** No! The contract enforces strict limits:
- ✅ Backend can only spend up to the allowance
- ✅ Allowance resets per period (e.g., monthly)
- ✅ User can revoke permission anytime
- ✅ Only the specific backend wallet can use it
- ✅ All enforced by smart contract (can't be bypassed)

**Example:**
```javascript
// User approves: 0.01 ETH per 30 days
// Backend can NEVER take more than 0.01 ETH in any 30-day period
// Even if user has 100 ETH in wallet!
```

---

### Q: What's the difference between on-chain and off-chain?

**A:**

| Action | On-Chain | Off-Chain |
|--------|----------|-----------|
| **Location** | On blockchain | In browser/server |
| **Gas fee** | Yes | No |
| **Permanent** | Yes | No |
| **Example** | Approve, Spend | Create permission, Sign |

**Beginner explanation:**
- **Off-chain**: Like writing a check (free, not recorded)
- **On-chain**: Like depositing the check (costs money, recorded forever)

---

### Q: How long does a permission last?

**A:** It depends on the `end` timestamp:
- **Never expire**: `end: 281474976710655` (max value)
- **1 year**: `end: now + (365 * 24 * 60 * 60)`
- **Specific date**: `end: new Date('2026-12-31').getTime() / 1000`

**Note:** Users can also revoke permissions manually anytime.

---

### Q: Can I use this on mainnet?

**A:** Yes! The same code works on:
- ✅ Base Mainnet
- ✅ Base Sepolia (testnet)
- ✅ Ethereum Mainnet
- ✅ Optimism
- ✅ And more!

Just change the network in your config:
```javascript
// For Base Mainnet
import { base } from 'viem/chains'

const client = createWalletClient({
  chain: base,  // Instead of baseSepolia
  // ...
})
```

---

## Frontend Questions

### Q: Why do I need the Base Account SDK?

**A:** The Base Account SDK provides:
- Easy wallet connection
- EIP-712 signing (readable signatures)
- Network configuration
- Best practices built-in

**Without SDK:**
```javascript
// Complex manual setup
const provider = window.ethereum
await provider.request({ method: 'eth_requestAccounts' })
// ... lots more code
```

**With SDK:**
```javascript
// Simple and clean
const sdk = createBaseAccountSDK({ ... })
const provider = sdk.getProvider()
```

---

### Q: What wallets are supported?

**A:** Any wallet that supports EIP-712 signing:
- ✅ Coinbase Wallet
- ✅ MetaMask
- ✅ Rainbow
- ✅ WalletConnect
- ✅ And more!

---

### Q: Why does the signature look so long?

**A:** The signature contains:
- Cryptographic proof (65 bytes)
- Wallet-specific data (varies)
- Encoded in hexadecimal

**Example signature:**
```
0x1234567890abcdef... (130+ characters)
```

This is normal and expected!

---

### Q: Can I create multiple permissions for the same user?

**A:** Yes! Each permission needs a unique `salt`:
```javascript
// Permission 1
salt: "0xabc123..."

// Permission 2 (different salt)
salt: "0xdef456..."
```

**Use cases:**
- Different allowances
- Different time periods
- Different purposes (subscription vs one-time)

---

### Q: What if the user rejects the signature?

**A:** The `handleCreatePermission` function will catch the error:
```javascript
try {
  const signature = await provider.request({ ... })
} catch (error) {
  console.error('User rejected signature')
  alert('Failed to create permission')
}
```

Just show an error message and let them try again.

---

## Backend Questions

### Q: Where do I get a private key for the backend?

**A:** 
1. **For testing**: Create a new wallet in MetaMask and export private key
2. **For production**: Use a secure key management service (AWS KMS, HashiCorp Vault, etc.)

**⚠️ Security warning:**
- NEVER commit private keys to git
- NEVER share private keys
- Use `.env` file (add to `.gitignore`)
- Use different keys for dev/prod

---

### Q: How do I get testnet ETH for gas?

**A:** Use a faucet:
1. Go to https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Enter your backend wallet address
3. Request testnet ETH
4. Wait a few minutes

**Check balance:**
```bash
cd backend
npm run balance
```

---

### Q: Can I approve multiple permissions at once?

**A:** Not in a single transaction, but you can batch them:
```javascript
async function approveMultiple(permissions, signatures) {
  for (let i = 0; i < permissions.length; i++) {
    await approvePermission(permissions[i], signatures[i])
  }
}
```

**Note:** Each approval is a separate transaction (separate gas fees).

---

### Q: How do I track which users have active permissions?

**A:** You need a database:
```javascript
// Example schema
{
  userId: "user123",
  permissionHash: "0xabc...",
  permission: { ... },
  signature: "0xdef...",
  approvedAt: "2025-01-15T10:30:00Z",
  status: "active"
}
```

**Recommended:**
- Store in PostgreSQL, MongoDB, or similar
- Index by userId and permissionHash
- Track status (active, revoked, expired)

---

### Q: How do I know how much allowance is remaining?

**A:** Query the contract:
```javascript
// Get spent amount for current period
const spent = await contract.read.getSpentAmount([permissionHash, currentPeriod])

// Calculate remaining
const remaining = permission.allowance - spent
```

**Note:** You'll need to add this function to your backend.

---

### Q: Can I spend from multiple users in one transaction?

**A:** No, each spend is a separate transaction. But you can batch them:
```javascript
async function chargeMultipleUsers(users) {
  const results = []
  
  for (const user of users) {
    try {
      const hash = await spend(user.permission, user.amount)
      results.push({ userId: user.id, success: true, hash })
    } catch (error) {
      results.push({ userId: user.id, success: false, error })
    }
  }
  
  return results
}
```

---

### Q: What happens if a spend transaction fails?

**A:** Common reasons and solutions:

| Error | Reason | Solution |
|-------|--------|----------|
| "Permission not approved" | Not approved yet | Run approval first |
| "Exceeds allowance" | Amount too high | Reduce amount or wait for new period |
| "Not authorized spender" | Wrong wallet | Use correct backend wallet |
| "Insufficient funds" | User has no ETH | User needs to add funds |

---

## Security Questions

### Q: Is it safe to store private keys in .env?

**A:** 
- **For development**: Yes, if `.env` is in `.gitignore`
- **For production**: No! Use proper key management:
  - AWS KMS
  - HashiCorp Vault
  - Azure Key Vault
  - Google Cloud KMS

**Production example:**
```javascript
// Instead of
const privateKey = process.env.PRIVATE_KEY

// Use
const privateKey = await kms.decrypt(encryptedKey)
```

---

### Q: Can someone replay my signature on another network?

**A:** No! The signature includes:
- `chainId`: Network identifier
- `verifyingContract`: Contract address

If either differs, the signature is invalid.

**Example:**
```javascript
// Signature for Base Sepolia (chainId: 84532)
// ❌ Won't work on Base Mainnet (chainId: 8453)
```

---

### Q: What if my backend wallet gets compromised?

**A:** 
1. **Immediate actions:**
   - Stop all services using that wallet
   - Transfer any remaining funds to a new wallet
   - Notify affected users

2. **User impact:**
   - Attacker can spend from active permissions
   - Limited to allowance amounts
   - Users should revoke permissions

3. **Prevention:**
   - Use hardware wallets for production
   - Implement rate limiting
   - Monitor for unusual activity
   - Use multi-sig wallets

---

### Q: Can users revoke permissions?

**A:** Yes! Users can call the contract's revoke function:
```javascript
// User revokes permission
await contract.revoke(permissionHash)
```

**After revocation:**
- Backend can no longer spend
- Permission is permanently disabled
- User would need to create new permission

---

### Q: Should I verify signatures on the backend?

**A:** The contract verifies signatures during approval, but you can add extra validation:
```javascript
import { verifyTypedData } from 'viem'

// Verify signature matches permission
const isValid = await verifyTypedData({
  address: permission.account,
  domain,
  types,
  primaryType: 'SpendPermission',
  message: permission,
  signature
})

if (!isValid) {
  throw new Error('Invalid signature')
}
```

---

## Troubleshooting

### Q: "SDK not initialized" error

**A:** The SDK failed to initialize. Solutions:
1. Refresh the page
2. Check console for errors
3. Verify network connection
4. Try a different browser

---

### Q: "Transaction failed" with no details

**A:** Check:
1. Backend wallet has ETH for gas
2. Permission is approved
3. Amount doesn't exceed allowance
4. Network is correct (testnet vs mainnet)

**Debug steps:**
```bash
# Check backend balance
npm run balance

# View transaction on BaseScan
# Copy transaction hash and search on:
# https://sepolia.basescan.org
```

---

### Q: Permission object doesn't match

**A:** Common mistakes:
- Extra/missing fields
- Different field order (doesn't matter, but check values)
- Whitespace in strings
- Wrong data types

**Solution:**
```javascript
// Copy EXACT object from console
// Don't manually type it
// Use JSON.stringify to compare:
console.log(JSON.stringify(permission1) === JSON.stringify(permission2))
```

---

### Q: "Nonce too low" error

**A:** Your backend wallet's nonce is out of sync. Solutions:
1. Wait a few seconds and retry
2. Restart your script
3. Manually set nonce:
```javascript
const nonce = await client.getTransactionCount({ address: account.address })
await client.writeContract({
  // ... other params
  nonce
})
```

---

### Q: Gas estimation failed

**A:** The transaction will likely fail. Check:
1. Permission is approved
2. Amount is valid
3. User has sufficient balance
4. Contract address is correct

**Debug:**
```javascript
// Try with manual gas limit
await client.writeContract({
  // ... other params
  gas: 200000n  // Manual gas limit
})
```

---

## Advanced Topics

### Q: Can I use ERC-20 tokens instead of ETH?

**A:** Yes! Just change the `token` address:
```javascript
// For USDC on Base Mainnet
token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"

// For DAI on Base Mainnet
token: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"
```

**Note:** User must have approved the SpendPermissionManager to spend their tokens first.

---

### Q: How do I implement recurring payments?

**A:** Use a cron job or scheduled task:
```javascript
// Using node-cron
import cron from 'node-cron'

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  await chargeAllSubscriptions()
})

async function chargeAllSubscriptions() {
  const activeSubscriptions = await db.getActiveSubscriptions()
  
  for (const sub of activeSubscriptions) {
    try {
      await spend(sub.permission, sub.amount)
      await db.markCharged(sub.id)
    } catch (error) {
      await db.markFailed(sub.id, error)
    }
  }
}
```

---

### Q: Can I batch multiple spends in one transaction?

**A:** Not directly, but you can use a custom contract:
```solidity
// Custom contract
function batchSpend(
  SpendPermission[] calldata permissions,
  uint160[] calldata amounts
) external {
  for (uint i = 0; i < permissions.length; i++) {
    spendPermissionManager.spend(permissions[i], amounts[i])
  }
}
```

**Benefits:**
- Single transaction
- Lower gas costs
- Atomic (all succeed or all fail)

---

### Q: How do I handle failed payments?

**A:** Implement retry logic:
```javascript
async function chargeWithRetry(permission, amount, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const hash = await spend(permission, amount)
      return { success: true, hash }
    } catch (error) {
      if (i === maxRetries - 1) {
        // Final retry failed
        return { success: false, error }
      }
      // Wait before retry (exponential backoff)
      await sleep(1000 * Math.pow(2, i))
    }
  }
}
```

---

### Q: Can I create a permission that never expires?

**A:** Yes! Use the maximum uint48 value:
```javascript
end: 281474976710655  // Year 8921455!
```

**Or calculate it:**
```javascript
end: (2n ** 48n) - 1n  // Maximum uint48
```

---

### Q: How do I monitor permission usage?

**A:** Listen to contract events:
```javascript
// Watch for Spent events
const unwatch = client.watchContractEvent({
  address: SPEND_PERMISSION_MANAGER,
  abi,
  eventName: 'Spent',
  onLogs: (logs) => {
    logs.forEach(log => {
      console.log('Spent:', {
        user: log.args.account,
        amount: log.args.value,
        hash: log.transactionHash
      })
    })
  }
})
```

---

### Q: Can I update a permission after it's approved?

**A:** No, permissions are immutable. To change:
1. Revoke old permission
2. Create new permission with new parameters
3. Approve new permission

**Example:**
```javascript
// Old: 0.01 ETH per 30 days
// Want: 0.02 ETH per 30 days

// Step 1: Revoke old
await contract.revoke(oldPermissionHash)

// Step 2: Create new permission (frontend)
const newPermission = { ...oldPermission, allowance: parseEther('0.02') }

// Step 3: Approve new (backend)
await approvePermission(newPermission, newSignature)
```

---

### Q: How do I test without spending real money?

**A:** Use testnets:
1. **Base Sepolia** (recommended)
   - Get free testnet ETH from faucet
   - Same functionality as mainnet
   - No real money involved

2. **Local network** (advanced)
   - Run local blockchain (Hardhat, Anvil)
   - Deploy contracts locally
   - Full control for testing

---

### Q: Can I see a complete production example?

**A:** Here's a simplified production architecture:
```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                      │
└─────────────────────────────────────────────────────────┘

Frontend (React)
  ↓
API Gateway (Express/FastAPI)
  ↓
Backend Service (Node.js/Python)
  ├── Database (PostgreSQL)
  │   └── Store permissions, users, transactions
  ├── Queue (Redis/RabbitMQ)
  │   └── Process charges asynchronously
  ├── Cron Jobs
  │   └── Recurring payments
  └── Monitoring (Datadog/Sentry)
      └── Track errors, usage, costs
```

---

## 🚀 Still Have Questions?

- **Check the docs**: [Base Spend Permissions Docs](https://docs.base.org/base-account/improve-ux/spend-permissions)
- **Read the code**: Review the example scripts in this repo
- **Join the community**: Base Discord, GitHub Discussions
- **Experiment**: Try it on testnet - it's free!

---

**Ready to build?** Go back to:
- **[Part 1: Overview](./01_OVERVIEW.md)** - Start from the beginning
- **[Part 2: Permission Structure](./02_PERMISSION_STRUCTURE.md)** - Understand permissions
- **[Part 3: Frontend](./03_FRONTEND.md)** - Build the UI
- **[Part 4: Backend Approval](./04_BACKEND_APPROVE.md)** - Activate permissions
- **[Part 5: Backend Spending](./05_BACKEND_SPEND.md)** - Charge users
