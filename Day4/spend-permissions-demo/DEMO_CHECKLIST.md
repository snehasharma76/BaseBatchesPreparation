# ✅ Demo Checklist

Use this checklist when demonstrating spend permissions to others.

---

## 📋 Pre-Demo Setup

- [ ] Backend wallet has Base Sepolia ETH for gas
- [ ] User wallet has Base Sepolia ETH
- [ ] `.env` files are configured correctly
- [ ] Dependencies installed (`npm install` in both root and backend)
- [ ] Frontend runs without errors (`npm run dev`)

---

## 🎬 Demo Script

### Part 1: Explain the Concept (2 min)

**Say:**
> "Spend permissions allow users to grant a backend wallet permission to pull funds from their account, without requiring them to sign each transaction. This is perfect for subscriptions, recurring payments, and automated services."

**Show:**
- Architecture diagram in README.md
- Explain: User → Permission → Backend → Pull ETH

---

### Part 2: Create Permission (Frontend) (3 min)

**Do:**
1. Open http://localhost:5173
2. Click "Connect Wallet"
3. Show the UI - explain allowance and period
4. Set allowance: `0.01 ETH`
5. Click "Create Permission"
6. Sign in wallet

**Say:**
> "The user is signing a message that grants our backend wallet permission to spend up to 0.01 ETH per 30-day period. This is off-chain and costs no gas."

**Show:**
- Success message
- Permission details in UI
- Browser console with formatted output

---

### Part 3: Approve Permission (Backend) (2 min)

**Do:**
1. Copy permission from console
2. Open `backend/approvePermission.js`
3. Paste permission and signature
4. Run: `npm run approve`

**Say:**
> "Now our backend needs to register this permission on-chain. This is a one-time transaction that costs gas, paid by the backend."

**Show:**
- Terminal output showing transaction
- BaseScan link to transaction
- Confirmed block number

---

### Part 4: Spend from Permission (Backend) (2 min)

**Do:**
1. Open `backend/spendFromPermission.js`
2. Set amount: `0.001 ETH`
3. Run: `npm run spend`

**Say:**
> "Now the backend can pull ETH from the user's account. The user doesn't need to sign anything - the permission we created earlier authorizes this."

**Show:**
- Terminal output
- Transaction on BaseScan
- ETH moving from user to backend

---

### Part 5: Verify Results (1 min)

**Do:**
1. Run: `npm run balance`
2. Show backend wallet balance increased

**Say:**
> "The backend wallet now has the ETH. We can call this multiple times until the allowance is exhausted. Perfect for subscriptions!"

**Show:**
- Balance increase
- Can run `npm run spend` again

---

## 🎯 Key Points to Emphasize

1. **User Experience**
   - User signs once, backend can charge multiple times
   - No need to approve each transaction
   - User controls limits (amount & time)

2. **Backend Control**
   - Backend decides when to charge
   - Backend pays gas fees
   - Backend can charge up to allowance

3. **Security**
   - User can revoke anytime
   - Strict limits enforced on-chain
   - Validated by SpendPermissionManager

4. **Use Cases**
   - Monthly subscriptions
   - Gaming microtransactions
   - Automated DeFi strategies
   - Service payments

---

## 🤔 Common Questions & Answers

**Q: What if the user doesn't have enough ETH?**
A: The transaction will fail. The backend should handle this gracefully.

**Q: Can the backend spend more than the allowance?**
A: No, the SpendPermissionManager enforces the limit on-chain.

**Q: How does the user revoke permission?**
A: They can call `SpendPermissionManager.revoke()` from their wallet.

**Q: Does this work on mainnet?**
A: Yes! Same code, just change the network. SpendPermissionManager is deployed on Base mainnet.

**Q: What happens after 30 days?**
A: The allowance resets. The backend can spend another 0.01 ETH.

---

## 📊 Demo Flow Diagram

```
┌─────────────────┐
│  1. Frontend    │  User creates permission (signs message)
│  User Action    │  ✅ Off-chain, no gas
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. Backend     │  Backend approves permission
│  Approve        │  ⛽ On-chain, backend pays gas
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Backend     │  Backend pulls ETH from user
│  Spend          │  💸 On-chain, backend pays gas
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. Result      │  Backend wallet receives ETH
│  Success!       │  ✅ Can repeat until allowance exhausted
└─────────────────┘
```

---

## 🎥 Recording Tips

If recording the demo:

1. **Clean browser** - Clear console before starting
2. **Zoom in** - Make text readable
3. **Slow down** - Pause between steps
4. **Explain** - Narrate what you're doing
5. **Show results** - Always verify on BaseScan

---

## ✨ Demo Complete!

After the demo, share:
- GitHub repo link
- Documentation links
- Base docs: https://docs.base.org/base-account/improve-ux/spend-permissions
