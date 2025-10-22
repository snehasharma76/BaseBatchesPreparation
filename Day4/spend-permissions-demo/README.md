# 💰 Base Spend Permissions Demo

A production-ready demonstration of Base Spend Permissions, showcasing how to implement subscription-like payments where a backend wallet can pull ETH from users with their permission.

## ✨ Overview

This demo implements a complete spend permissions flow using Base Account SDK and EIP-712 signatures. Users grant permission for a backend wallet to pull a specified amount of ETH over a time period, enabling use cases like subscriptions, automated payments, and recurring transactions.

## 🚀 Quick Links

- **[⚡ Quick Start (5 min)](./QUICKSTART.md)** - Get running fast!
- **[🧪 Testing Guide](./TESTING_GUIDE.md)** - Complete testing walkthrough
- **[📖 Full Documentation](#)** - You're reading it!

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Frontend  │ ──────> │ SpendPermission  │ <────── │   Backend   │
│   (User)    │  Signs  │    Manager       │  Spends │   Wallet    │
└─────────────┘         └──────────────────┘         └─────────────┘
      │                          │                           │
      │ 1. Create Permission     │                           │
      │    (EIP-712 signature)   │                           │
      │                          │ 2. Approve Permission     │
      │                          │    (on-chain, pays gas)   │
      │                          │                           │
      │                          │ 3. Spend from Permission  │
      │                          │    (pulls ETH from user)  │
      └──────────────────────────┴───────────────────────────┘
```

**Key Concept:** The backend wallet is the "spender" that can pull ETH from users who have granted permission, without requiring user interaction for each transaction.

---

## 📁 Project Structure

```
spend-permissions-demo/
├── src/                          # Frontend (React + Vite)
│   ├── App.jsx                  # Main app - creates permissions with EIP-712
│   ├── App.css                  # Application styles
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── backend/                      # Backend scripts (Node.js)
│   ├── getAddress.js            # Get backend wallet address
│   ├── approvePermission.js     # Approve permission on-chain
│   ├── spendFromPermission.js   # Pull ETH from user
│   ├── checkBalance.js          # Check backend wallet balance
│   └── package.json             # Backend dependencies
├── docs/                         # Additional documentation
├── .env.example                  # Environment variables template
├── package.json                  # Frontend dependencies
└── README.md                     # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **@base-org/account 2.4** - Base Account SDK
- **viem 2.38** - Ethereum library

### Backend
- **Node.js** - Runtime environment
- **viem 2.38** - Ethereum library for contract interactions
- **dotenv** - Environment variable management

### Smart Contracts
- **SpendPermissionManager** - Base's spend permission contract on Base Sepolia
- **EIP-712** - Typed structured data signing

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Coinbase Wallet** browser extension
- **Base Sepolia testnet ETH** ([Get from faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))
- A **private key** for the backend wallet (create a new wallet for testing)

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Setup Backend Wallet

Create a backend wallet environment file:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your private key:
```env
PRIVATE_KEY=0xyour_private_key_here
RPC_URL=https://sepolia.base.org
SPEND_PERMISSION_MANAGER=0xf85210B21cC50302F477BA56686d2019dC9b67Ad
```

⚠️ **Security Note**: Never commit your `.env` file or share your private key!

Get your backend wallet address:
```bash
npm run address
```

Copy the displayed address for the next step.

### 3. Setup Frontend

Return to root directory and create frontend environment file:
```bash
cd ..
cp .env.example .env
```

Edit `.env` and add the backend wallet address from step 2:
```env
VITE_BACKEND_WALLET_ADDRESS=0xyour_backend_wallet_address
```

### 4. Fund Backend Wallet

The backend wallet needs ETH to pay for gas fees:
- Send ~0.01 ETH to the backend wallet address
- Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

Verify balance:
```bash
cd backend
npm run balance
```

---

## 📖 Usage

### Step 1: Create Permission (Frontend)

Start the frontend development server:
```bash
npm run dev
```

1. Open http://localhost:5173 in your browser
2. Click **"Connect Wallet"** (Coinbase Wallet will prompt)
3. Enter allowance amount (e.g., 0.01 ETH per 30 days)
4. Click **"Create Permission"**
5. Sign the EIP-712 message in your wallet
6. **Open browser console (F12)** and copy:
   - Permission object
   - Signature

The permission is now created off-chain and ready to be approved.

### Step 2: Approve Permission (Backend)

Navigate to backend directory:
```bash
cd backend
```

Edit `approvePermission.js` and paste the values from browser console:
- Replace the `permission` object
- Replace the `signature` string

Run the approval script:
```bash
npm run approve
```

This registers the permission on-chain. You'll see:
```
✅ Transaction sent: 0x...
✅ Confirmed in block: 12345
```

### Step 3: Spend from Permission (Backend)

Edit `spendFromPermission.js`:
- Paste the same permission object (if not already there)
- Set `amountToSpend` (must be ≤ allowance)

Run the spend script:
```bash
npm run spend
```

✅ ETH is now transferred from user to backend wallet!

You can run this script multiple times until the allowance is exhausted.

### Step 4: Verify Balance (Backend)

Check that ETH was received:
```bash
npm run balance
```

---

## 🔑 How It Works

### 1. User Creates Permission (Off-chain)

The user signs an EIP-712 typed data message:

```javascript
const permission = {
  account: userAddress,              // User's wallet
  spender: backendWalletAddress,     // Backend wallet authorized to spend
  token: '0xEeee...EEeE',           // Native ETH
  allowance: parseEther('0.01'),     // Max 0.01 ETH per period
  period: 2592000,                   // 30 days in seconds
  start: currentTimestamp,           // When permission starts
  end: maxUint48,                    // When permission expires
  salt: randomBytes32,               // Unique identifier
  extraData: '0x'                    // Additional data (optional)
}

// User signs with EIP-712
const signature = await signTypedData(permission)
```

**Benefits:**
- ✅ Off-chain, no gas fees for user
- ✅ Human-readable signing prompt
- ✅ Secure, domain-specific signature

### 2. Backend Approves Permission (On-chain)

Backend submits the permission and signature to the SpendPermissionManager contract:

```javascript
await SpendPermissionManager.approveWithSignature(permission, signature)
```

**What happens:**
- Contract validates the signature
- Permission is registered on-chain
- Backend pays gas fees (~$0.01-0.05)
- One-time operation per permission

### 3. Backend Spends from Permission (On-chain)

Backend can now pull ETH from the user's account:

```javascript
await SpendPermissionManager.spend(permission, amount)
```

**What happens:**
- Contract validates permission is approved
- Checks amount ≤ remaining allowance
- Transfers ETH from user to backend wallet
- Backend pays gas fees
- Can be called multiple times until allowance exhausted

### Permission Lifecycle

```
Create (User) → Approve (Backend) → Spend (Backend) → Spend → Spend → Exhausted
   ↓                ↓                    ↓               ↓       ↓         ↓
 Off-chain      On-chain            On-chain        On-chain On-chain  Renew?
 No gas         Gas paid           Gas paid        Gas paid Gas paid
```

---

## 💡 Use Cases

### Real-World Applications

- **💳 Subscriptions**: 
  - Monthly SaaS payments
  - Streaming services
  - Membership fees
  
- **🎮 Gaming**:
  - In-game purchases
  - Season passes
  - Microtransactions
  
- **🛍️ E-commerce**:
  - Recurring orders
  - Installment payments
  - Pay-as-you-go services
  
- **💰 DeFi**:
  - Automated yield farming
  - Dollar-cost averaging
  - Recurring investments

---

## 🔒 Security Features

### User Protection
- ✅ **Allowance Limits**: User sets maximum amount per period
- ✅ **Time Bounds**: Permission expires after specified period
- ✅ **Revocable**: User can revoke permission anytime (future feature)
- ✅ **EIP-712 Signatures**: Human-readable, secure signing
- ✅ **Domain Separation**: Signatures are chain and contract specific

### Backend Protection
- ✅ **On-chain Validation**: All permissions validated by smart contract
- ✅ **Signature Verification**: Contract verifies user authorization
- ✅ **Replay Protection**: Salt prevents signature reuse
- ✅ **Amount Validation**: Contract enforces allowance limits

### Best Practices
- 🔐 Never share private keys
- 🔐 Use separate wallets for testing
- 🔐 Keep `.env` files out of version control
- 🔐 Start with small allowances for testing
- 🔐 Monitor backend wallet balance

---

## 🐛 Troubleshooting

### Permission Creation Fails

**Problem**: User can't create permission

**Solutions**:
- Ensure Coinbase Wallet is installed and connected
- Check that `VITE_BACKEND_WALLET_ADDRESS` is set correctly
- Verify you're on Base Sepolia network
- Try refreshing the page

### Approval Transaction Fails

**Problem**: `npm run approve` fails

**Solutions**:
- Ensure backend wallet has ETH for gas fees
- Verify permission object and signature are pasted correctly
- Check that `SPEND_PERMISSION_MANAGER` address is correct
- Ensure RPC URL is working (try https://sepolia.base.org)

### Spend Transaction Fails

**Problem**: `npm run spend` fails

**Solutions**:
- Ensure permission is approved first (run `npm run approve`)
- Check that `amountToSpend` ≤ allowance
- Verify user has sufficient ETH balance
- Ensure backend wallet has ETH for gas fees
- Check that permission hasn't expired

### User Has No ETH

**Problem**: User's wallet is empty

**Solutions**:
- Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- Wait a few minutes for faucet transaction to confirm
- Verify you're checking the correct address

---

## 📝 Important Notes

### Gas Fees
- **User**: Pays NO gas after initial permission creation (off-chain signature)
- **Backend**: Pays gas for approve (~$0.01-0.05) and spend (~$0.01-0.05) transactions

### Permission Reuse
- Permission can be used multiple times until allowance is exhausted
- Each spend transaction deducts from the remaining allowance
- Period resets every 30 days (configurable)

### Network Support
- **Current**: Base Sepolia (testnet)
- **Production**: Same code works on Base mainnet
- **Contract Address**: `0xf85210B21cC50302F477BA56686d2019dC9b67Ad` (Base Sepolia)

---

## 🔌 API Reference

### Frontend Methods

```javascript
// Initialize SDK
const sdk = createBaseAccountSDK({
  appName: 'Your App',
  appChainIds: [baseSepolia.id]
})

// Connect wallet
await provider.request({ method: 'wallet_connect' })
await provider.request({ method: 'eth_requestAccounts' })

// Sign permission (EIP-712)
await provider.request({
  method: 'eth_signTypedData_v4',
  params: [account, typedData]
})
```

### Backend Methods

```javascript
// Approve permission
await client.writeContract({
  address: SPEND_PERMISSION_MANAGER,
  functionName: 'approveWithSignature',
  args: [permission, signature]
})

// Spend from permission
await client.writeContract({
  address: SPEND_PERMISSION_MANAGER,
  functionName: 'spend',
  args: [permission, amount]
})
```

---

## 📚 Resources

### Official Documentation
- [Base Spend Permissions Docs](https://docs.base.org/base-account/improve-ux/spend-permissions)
- [Base Account SDK](https://github.com/coinbase/base-account-sdk)
- [Base Sepolia Explorer](https://sepolia.basescan.org)

### Standards & Specifications
- [EIP-712: Typed Structured Data](https://eips.ethereum.org/EIPS/eip-712)
- [ERC-4337: Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337)
- [Viem Documentation](https://viem.sh)

### Community & Support
- [Base Discord](https://discord.gg/buildonbase)
- [Base GitHub](https://github.com/base-org)
- [Coinbase Wallet](https://www.coinbase.com/wallet)

---

## 🎯 Production Considerations

### Before Going to Production

1. **Database Integration**
   - Store user permissions in database
   - Track allowance usage and history
   - Implement permission expiry monitoring

2. **API Layer**
   - Create REST/GraphQL API for permission management
   - Add authentication and authorization
   - Implement rate limiting

3. **Automation**
   - Set up cron jobs for recurring payments
   - Implement automatic permission renewal
   - Add notification system for low allowances

4. **Security Enhancements**
   - Use hardware wallets or KMS for backend keys
   - Implement multi-signature for high-value operations
   - Add monitoring and alerting
   - Regular security audits

5. **User Experience**
   - Add permission revocation feature
   - Show spending history to users
   - Implement email/push notifications
   - Add analytics dashboard

6. **Testing**
   - Comprehensive unit tests
   - Integration tests for full flow
   - Load testing for backend
   - Security penetration testing

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend wallet funded with ETH
- [ ] Database migrations run
- [ ] API endpoints secured
- [ ] Monitoring and logging set up
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Rate limiting implemented
- [ ] Documentation updated
- [ ] Security audit completed
- [ ] Backup and recovery plan in place

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

If you have questions or need help:
- Open an issue on GitHub
- Join the Base Discord community
- Check the documentation links above

---

Built with ❤️ using Base Account SDK and EIP-712
