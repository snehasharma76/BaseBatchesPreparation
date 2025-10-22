# ⚡ Quick Start - 5 Minutes

Get the spend permissions demo running in 5 minutes!

---

## 1️⃣ Install Dependencies (1 min)

```bash
# Root directory
npm install

# Backend
cd backend
npm install
cd ..
```

---

## 2️⃣ Setup Backend Wallet (1 min)

```bash
cd backend
cp .env.example .env
```

**Edit `backend/.env`** and add your private key:
```env
PRIVATE_KEY=0xyour_private_key_here
```

Get your backend address:
```bash
npm run address
```

Copy the address shown! ✅

---

## 3️⃣ Setup Frontend (30 sec)

```bash
cd ..
cp .env.example .env
```

**Edit `.env`** and paste your backend address:
```env
VITE_BACKEND_WALLET_ADDRESS=0xYourBackendAddress
```

---

## 4️⃣ Run Frontend (30 sec)

```bash
npm run dev
```

Open http://localhost:5173

1. Connect wallet
2. Create permission
3. Check console (F12)
4. Copy permission & signature

---

## 5️⃣ Run Backend Scripts (2 min)

**Approve permission:**
```bash
cd backend
# Edit approvePermission.js - paste permission & signature
npm run approve
```

**Spend from permission:**
```bash
# Edit spendFromPermission.js - paste permission & set amount
npm run spend
```

**Check balance:**
```bash
npm run balance
```

---

## ✅ Done!

You've successfully:
- ✅ Created a spend permission
- ✅ Approved it on-chain
- ✅ Pulled ETH from user to backend wallet

---

## 📚 Next Steps

- Read [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing
- Read [README.md](./README.md) for full documentation
- Check [backend/](./backend/) for all available scripts

---

## 🆘 Need Help?

**Common Issues:**

- **"No backend address"** → Run `cd backend && npm run address`
- **"Transaction failed"** → Make sure backend wallet has ETH for gas
- **"Invalid permission"** → Make sure you pasted correctly from console

**Get testnet ETH:**
https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
