# 🧪 Testing Guide - Spend Permissions Demo

This guide will walk you through testing the complete spend permissions flow.

---

## ✅ Prerequisites

- [ ] Node.js installed
- [ ] Coinbase Wallet or compatible wallet
- [ ] Base Sepolia testnet ETH (for user wallet)
- [ ] Base Sepolia testnet ETH (for backend wallet - for gas)

Get testnet ETH: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

---

## 📝 Step-by-Step Testing

### 1. Setup Backend Wallet

```bash
cd backend
npm install
cp .env.example .env
```

**Generate a new wallet:**
```bash
# In Node.js console or use online tool
node -e "const {generatePrivateKey} = require('viem/accounts'); console.log(generatePrivateKey())"
```

Or use an existing wallet's private key.

**Edit `backend/.env`:**
```env
PRIVATE_KEY=0xyour_private_key_here
RPC_URL=https://sepolia.base.org
SPEND_PERMISSION_MANAGER=0xf85210B21cC50302F477BA56686d2019dC9b67Ad
```

**Get your backend wallet address:**
```bash
npm run address
```

Output:
```
🔑 Backend Wallet Address: 0xYourBackendAddress...
```

**Fund your backend wallet** with Base Sepolia ETH (for gas fees).

---

### 2. Setup Frontend

```bash
cd ..  # Back to root
npm install
cp .env.example .env
```

**Edit `.env`:**
```env
VITE_BACKEND_WALLET_ADDRESS=0xYourBackendAddress
```

---

### 3. Create Spend Permission (Frontend)

```bash
npm run dev
```

1. Open http://localhost:5173
2. Click **"Connect Wallet"**
3. Connect your Coinbase Wallet (make sure you're on Base Sepolia)
4. Set allowance (e.g., `0.01` ETH)
5. Click **"Create Permission"**
6. Sign the message in your wallet
7. ✅ Permission created!

**Expected Result:**
- Green success box appears
- Browser console shows permission details
- Alert says "Permission created! Open browser console (F12)"

---

### 4. Copy Permission Data

Open browser console (F12) and you'll see:

```
========================================
✅ SPEND PERMISSION CREATED!
========================================

📋 COPY THIS TO BACKEND SCRIPTS:

// Permission object:
{
  "account": "0xUserAddress...",
  "spender": "0xBackendAddress...",
  "token": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "allowance": "10000000000000000",
  "period": 2592000,
  "start": 1234567890,
  "end": 281474976710655,
  "salt": "0x...",
  "extraData": "0x"
}

// Signature:
"0x1234567890abcdef..."

========================================
```

**Copy both the permission object and signature!**

---

### 5. Approve Permission (Backend)

```bash
cd backend
```

**Edit `approvePermission.js`:**

Replace the permission object (lines 17-26):
```javascript
const permission = {
  // PASTE YOUR PERMISSION HERE
}
```

Replace the signature (line 29):
```javascript
const signature = '0x...' // PASTE YOUR SIGNATURE HERE
```

**Run the script:**
```bash
npm run approve
```

**Expected Output:**
```
📝 Approving permission...

User: 0xUserAddress...
Spender: 0xBackendAddress...

✅ Transaction sent: 0xtxhash...
Waiting for confirmation...
✅ Confirmed in block: 12345678
```

**Verify on BaseScan:**
https://sepolia.basescan.org/tx/0xtxhash

---

### 6. Spend from Permission (Backend)

**Edit `spendFromPermission.js`:**

Paste the same permission object (lines 17-26).

Set the amount to spend (line 30):
```javascript
const amountToSpend = '0.001' // Change this
```

**Run the script:**
```bash
npm run spend
```

**Expected Output:**
```
💸 Spending from permission...

From: 0xUserAddress...
Amount: 0.001 ETH

✅ Transaction sent: 0xtxhash...
Waiting for confirmation...
✅ Confirmed in block: 12345679
✅ ETH transferred to backend wallet!
```

---

### 7. Verify Balance (Backend)

```bash
npm run balance
```

**Expected Output:**
```
💰 Checking backend wallet balance...

Address: 0xBackendAddress...
Balance: 0.001234 ETH
Balance (wei): 1234000000000000
```

The balance should have increased by the amount you spent!

---

## 🎯 Success Criteria

✅ **Frontend:**
- Wallet connects successfully
- Permission is created and signed
- Console shows permission details
- UI shows success message with next steps

✅ **Backend Approve:**
- Transaction is sent and confirmed
- No errors in console
- Transaction visible on BaseScan

✅ **Backend Spend:**
- ETH is transferred from user to backend wallet
- Transaction is confirmed
- Backend wallet balance increases

---

## 🐛 Troubleshooting

### "Failed to connect wallet"
- Make sure you're using Coinbase Wallet or compatible wallet
- Check that you're on Base Sepolia network

### "Transaction failed" on approve
- Make sure backend wallet has ETH for gas
- Check that permission object is pasted correctly
- Verify signature is correct

### "Transaction failed" on spend
- Make sure you ran `approvePermission.js` first
- Check that amount ≤ allowance
- Verify user wallet has enough ETH

### "Invalid spender"
- Make sure VITE_BACKEND_WALLET_ADDRESS matches your backend wallet
- Regenerate permission if you changed backend wallet

---

## 🔄 Testing Multiple Spends

You can call `spendFromPermission.js` multiple times until the allowance is exhausted:

```bash
# First spend
npm run spend  # 0.001 ETH

# Second spend
npm run spend  # 0.001 ETH

# Continue until allowance (0.01 ETH) is used up
```

---

## 📊 What to Check

1. **User wallet balance** - Should decrease by amount spent
2. **Backend wallet balance** - Should increase by amount spent
3. **BaseScan transactions** - Both approve and spend should be visible
4. **Console logs** - Should show no errors

---

## ✨ Expected Flow Summary

```
1. User creates permission (frontend) → Signs message
2. Backend approves permission → On-chain transaction
3. Backend spends from permission → ETH transferred
4. Backend wallet receives ETH → Balance increases
```

---

## 🎉 Success!

If all steps complete successfully, you've successfully demonstrated Base Spend Permissions!

The backend wallet can now pull ETH from the user's account up to the allowance limit, without requiring the user to sign each transaction. Perfect for subscriptions, recurring payments, and automated services!
