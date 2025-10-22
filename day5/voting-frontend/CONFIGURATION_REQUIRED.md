# ⚠️ Configuration Required

## 🔴 Critical Setup Steps

Your voting dApp is almost ready, but you need to configure the contract address first!

### Issue 1: Connect Wallet Button Not Working
**Cause:** Missing contract configuration prevents OnchainKit from initializing properly.

### Issue 2: Proposals Keep Loading
**Cause:** The contract address is not set, so the app can't fetch proposals from the blockchain.

## ✅ Solution: Add Contract Address

### Step 1: Create `.env.local` file

In the project root (`voting-frontend/`), create a file named `.env.local`:

```bash
# From the voting-frontend directory
touch .env.local
```

### Step 2: Add Your Contract Address

Edit `.env.local` and add:

```env
# Required: Your deployed VotingContract address on Base Sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere

# Optional but recommended: OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=BjCZmQHJqsz0mOPT2DUApFln3MvUlwSS

# Optional: Project name
NEXT_PUBLIC_PROJECT_NAME=Voting dApp
```

### Step 3: Get Your Contract Address

If you haven't deployed the contract yet:

```bash
# Navigate to the contract directory
cd ../VotingContract

# Deploy to Base Sepolia
forge create --rpc-url https://sepolia.base.org \
  --private-key YOUR_PRIVATE_KEY \
  src/VotingContract.sol:VotingContract

# Copy the "Deployed to:" address
```

If you already deployed it, find it in:
- Your deployment logs
- Base Sepolia Explorer: https://sepolia.basescan.org
- Your deployment script output

### Step 4: Restart the Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 📋 Complete .env.local Example

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_ONCHAINKIT_API_KEY=BjCZmQHJqsz0mOPT2DUApFln3MvUlwSS
NEXT_PUBLIC_PROJECT_NAME=Voting dApp
```

## ✅ What Will Work After Configuration

Once you add the contract address:

1. ✅ **Connect Wallet Button** - Will work properly
2. ✅ **Proposals List** - Will load from blockchain
3. ✅ **Create Proposal** - Will interact with contract
4. ✅ **Vote** - Will submit votes to contract
5. ✅ **Admin Panel** - Will manage proposers
6. ✅ **Events Feed** - Will show real-time events

## 🔍 Verification Steps

After adding the contract address:

1. **Restart dev server**: `npm run dev`
2. **Open**: http://localhost:3000
3. **Check Proposals tab**: Should show "No Proposals Yet" instead of loading
4. **Click Connect Wallet**: Should open wallet selection modal
5. **Connect wallet**: Should show your address and balance

## 🐛 Troubleshooting

### Still showing "Contract Not Configured"?
- ✅ Check file is named `.env.local` (not `.env`)
- ✅ Check the variable name is exactly `NEXT_PUBLIC_CONTRACT_ADDRESS`
- ✅ Check the address starts with `0x`
- ✅ Restart the dev server after adding the variable

### Wallet button still not working?
- ✅ Clear browser cache (Ctrl+Shift+R)
- ✅ Check browser console for errors (F12)
- ✅ Verify you're on Base Sepolia network
- ✅ Try a different wallet (MetaMask vs Coinbase)

### Proposals showing error?
- ✅ Verify contract address is correct
- ✅ Check contract is deployed on Base Sepolia
- ✅ Verify you have Base Sepolia RPC access
- ✅ Check network connection

## 📝 Current .env Status

Your current `.env` file has:
```
✅ NEXT_PUBLIC_PROJECT_NAME
✅ NEXT_PUBLIC_ONCHAINKIT_API_KEY
❌ NEXT_PUBLIC_CONTRACT_ADDRESS (MISSING!)
```

## 🚀 Quick Start Command

```bash
# 1. Create .env.local
echo 'NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere' > .env.local
echo 'NEXT_PUBLIC_ONCHAINKIT_API_KEY=BjCZmQHJqsz0mOPT2DUApFln3MvUlwSS' >> .env.local
echo 'NEXT_PUBLIC_PROJECT_NAME=Voting dApp' >> .env.local

# 2. Replace with your actual contract address
nano .env.local

# 3. Restart server
npm run dev
```

## 📊 What You'll See

### Before Configuration:
- ❌ Wallet button doesn't work
- ❌ Proposals keep loading
- ❌ Can't interact with contract

### After Configuration:
- ✅ Wallet button opens modal
- ✅ Proposals load (or show "No Proposals Yet")
- ✅ Can create proposals
- ✅ Can vote on proposals
- ✅ All features work

---

**Next Step:** Add your contract address to `.env.local` and restart the server!
