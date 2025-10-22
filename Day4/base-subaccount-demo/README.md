# 🚀 Base Sepolia Fund Me Demo

A production-ready demonstration of Base Account SDK with subaccounts, showcasing how to interact with smart contracts using ERC-4337 account abstraction on Base Sepolia testnet.

## ✨ Features

- **🔐 Base Account SDK Integration**: Official Coinbase Base Account SDK implementation
- **⚡ Auto-Create Subaccounts**: Automatically creates or retrieves domain-specific subaccounts
- **👥 Dual Account Display**: Shows both Universal Account (EOA) and Subaccount (Smart Wallet)
- **💸 Subaccount Transactions**: All transactions sent from the subaccount using `wallet_sendCalls`
- **🎨 Beautiful UI**: Modern gradient design with glassmorphism effects
- **📦 Batch Transaction Support**: Uses EIP-5792 for batch transaction capabilities

## 🛠️ Tech Stack

- **Vite 7** - Lightning-fast build tool and dev server
- **React 19** - Modern UI framework with latest features
- **Tailwind CSS 3** - Utility-first CSS framework
- **@base-org/account 2.4** - Official Base Account SDK
- **viem 2.38** - Type-safe Ethereum library
- **Solidity 0.8** - Smart contract language

## 📄 Smart Contract

The `FundMe.sol` contract is located in `/contracts` and accepts exactly **0.00009 ETH** per transaction:

```solidity
contract FundMe {
    uint256 public constant REQUIRED_AMOUNT = 0.00009 ether;
    
    function fundMe() public payable {
        require(msg.value == REQUIRED_AMOUNT, "Must send exactly 0.00009 ETH");
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Key Features:**
- ✅ Strict amount validation
- ✅ Balance tracking
- ✅ Protection against direct transfers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Coinbase Wallet browser extension
- Base Sepolia testnet ETH ([Get from faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Deploy the FundMe contract** to Base Sepolia:
   
   Using Remix:
   - Open [Remix IDE](https://remix.ethereum.org)
   - Create `FundMe.sol` from `/contracts` folder
   - Compile with Solidity 0.8.0+
   - Deploy to Base Sepolia (Chain ID: 84532)
   - Copy the deployed contract address

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your contract address:
   ```env
   VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   VITE_FUND_AMOUNT=0.00009
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**: Navigate to `http://localhost:5173`

## 📖 How It Works

### Step 1: Connect Wallet
Click **"Connect Wallet"** to:
- Connect using Base Account SDK with Coinbase Wallet
- Retrieve your Universal Account (main EOA wallet)
- Automatically check for existing subaccount for this domain
- **Auto-create a subaccount** if one doesn't exist

### Step 2: View Account Information
The app displays:
- **Universal Account**: Your main wallet address (EOA)
- **Subaccount**: Your smart wallet address (ERC-4337)

### Step 3: Fund Your Subaccount
⚠️ **Important**: The subaccount needs ETH to pay for transactions!
- Send Base Sepolia ETH to the subaccount address shown in the UI
- Minimum: 0.00009 ETH + gas fees (~0.001 ETH recommended)
- Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

### Step 4: Send Transaction
Click **"Fund Me"** to:
- Encode the contract function call using the ABI
- Send exactly 0.00009 ETH to the contract **from your subaccount**
- Use `wallet_sendCalls` (EIP-5792) for batch transaction support
- Transaction is processed through ERC-4337 account abstraction

## 🔑 Key Concepts

### Universal Account vs Subaccount

| Feature | Universal Account | Subaccount |
|---------|------------------|------------|
| Type | EOA (Externally Owned Account) | Smart Contract Wallet |
| Creation | User's main wallet | Created by app per domain |
| Gas Payment | User pays | Can be sponsored by app |
| Batch Transactions | No | Yes (via `wallet_sendCalls`) |
| Account Abstraction | No | Yes (ERC-4337) |

### Why Use Subaccounts?

- **🔒 Security**: Domain-specific wallets isolate risk
- **⚡ Better UX**: Enable gasless transactions and batching
- **🎯 Flexibility**: Each app gets its own wallet
- **🚀 Future-proof**: Built on ERC-4337 standard

## 🐛 Troubleshooting

### Gas Estimation Failed Error

**Error**: `"failed to estimate gas for user operation: useroperation reverted: execution reverted"`

**Solutions**:
1. **Fund the subaccount**: The subaccount needs ETH to pay for gas
   - Send at least 0.001 ETH to the subaccount address shown in the UI
   - Get testnet ETH from the faucet
2. **Check contract address**: Verify `VITE_CONTRACT_ADDRESS` in `.env` is correct
3. **Verify deployment**: Confirm contract exists on [BaseScan](https://sepolia.basescan.org)

### Wallet Not Connecting

**Solutions**:
- Install [Coinbase Wallet](https://www.coinbase.com/wallet) browser extension
- Ensure you're on Base Sepolia network
- Refresh the page and try again

### Transaction Failing

**Solutions**:
- Ensure subaccount has sufficient balance (0.00009 ETH + gas)
- Verify the contract accepts exactly 0.00009 ETH
- Check transaction on [BaseScan](https://sepolia.basescan.org) for details

## 🏗️ Project Structure

```
base-subaccount-demo/
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── contracts/
│   └── FundMe.sol        # Smart contract
├── public/               # Static assets
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🔌 API Reference

### Base Account SDK Methods

```javascript
// Initialize SDK
const sdk = createBaseAccountSDK({
  appName: 'Your App Name',
  appLogoUrl: 'https://your-logo.png',
  appChainIds: [baseSepolia.id]
})

// Get provider
const provider = sdk.getProvider()

// Connect wallet (EIP-1102)
await provider.request({ method: 'eth_requestAccounts' })

// Get existing subaccounts
await provider.request({
  method: 'wallet_getSubAccounts',
  params: [{ account, domain }]
})

// Create new subaccount
await provider.request({
  method: 'wallet_addSubAccount',
  params: [{ account: { type: 'create' } }]
})

// Send batch transactions (EIP-5792)
await provider.request({
  method: 'wallet_sendCalls',
  params: [{
    version: '2.0',
    from: subAccount.address,
    chainId: '0x14a34', // Base Sepolia
    calls: [{ to, value, data }]
  }]
})
```

## 📚 Resources

- [Base Account SDK Documentation](https://docs.base.org/base-account)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [ERC-4337 Specification](https://eips.ethereum.org/EIPS/eip-4337)
- [EIP-5792 Wallet Capabilities](https://eips.ethereum.org/EIPS/eip-5792)

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Base Account SDK
