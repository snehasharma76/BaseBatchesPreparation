# Quick Start Guide

Get your Voting dApp running in 5 minutes!

## 1️⃣ Install Dependencies

```bash
cd voting-frontend
npm install
```

## 2️⃣ Configure Environment

Create `.env.local` file:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your contract address:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
NEXT_PUBLIC_ONCHAINKIT_API_KEY=optional_but_recommended
```

## 3️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4️⃣ Connect Wallet

1. Click "Connect Wallet" button
2. Choose **Coinbase Wallet** or **MetaMask**
3. Make sure you're on **Base Sepolia** network

## 5️⃣ Get Test ETH

Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

## ✅ You're Ready!

- **View Proposals**: Browse all proposals on the main tab
- **Vote**: Click Yes/No on active proposals
- **Create**: Submit new proposals (if approved)
- **Admin**: Manage proposers (if you're the owner)
- **Events**: Watch real-time blockchain activity

## 🆘 Need Help?

- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
- Read [README.md](./README.md) for full documentation
- Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for features

## 🚀 Deploy to Production

```bash
npm run build
vercel --prod
```

---

Happy voting! 🗳️
