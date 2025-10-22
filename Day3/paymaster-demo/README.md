# 🚀 Paymaster Demo - Gasless Transactions on Base

A React-based demonstration application showcasing **gasless transactions** using Coinbase's Paymaster service on the Base Sepolia testnet. This project enables users to claim rewards without paying gas fees, leveraging Base Account SDK and EIP-5792 wallet capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This application demonstrates how to implement gasless transactions using Coinbase's Paymaster service. Users can connect their Base Account wallet and claim rewards from a smart contract without needing to hold ETH for gas fees. The Paymaster service sponsors the transaction costs, providing a seamless user experience.

## ✨ Features

- **🔐 Base Account Integration**: Seamless wallet connection using Base Account SDK
- **⚡ Gasless Transactions**: Users can execute transactions without paying gas fees
- **🔄 Real-time Status Updates**: Live transaction status monitoring
- **🌐 Network Switching**: Automatic Base Sepolia network detection and switching
- **📱 Responsive UI**: Modern, mobile-friendly interface
- **🎨 Clean Design**: Professional UI with Coinbase branding

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Blockchain Library**: Viem 2.38.2
- **Wallet SDK**: @base-org/account 2.4.0
- **Styling**: CSS3 with CSS Variables
- **Linting**: ESLint 9.36.0

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Base Account Wallet**: Compatible wallet supporting EIP-5792
- **Base Sepolia Testnet ETH**: For testing (not required for gasless transactions)

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd paymaster-demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration (see [Configuration](#configuration) section).

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:5173`

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Smart contract address for the rewards contract on Base Sepolia
VITE_REWARDS_CONTRACT_ADDRESS=0xYourContractAddress

# RPC URL for Base Sepolia network
VITE_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Coinbase Paymaster service URL
VITE_PAYMASTER_SERVICE_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/YOUR_PAYMASTER_KEY
```

### Getting API Keys:

1. **Alchemy RPC URL**: 
   - Sign up at [Alchemy](https://www.alchemy.com/)
   - Create a new app for Base Sepolia
   - Copy the HTTPS URL

2. **Coinbase Paymaster**:
   - Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
   - Create a new project
   - Enable Paymaster service for Base Sepolia
   - Copy the Paymaster URL

## 📖 Usage

### Connecting Your Wallet

1. Click **"Connect with Base Account"** button
2. Approve the connection in your Base Account wallet
3. The app will automatically switch to Base Sepolia network if needed

### Claiming Rewards

1. Once connected, click **"⚡ Claim Reward (Gasless)"**
2. Approve the transaction in your wallet
3. Wait for confirmation (no gas fees required!)
4. View transaction details and status

### Disconnecting

Click the **"Disconnect"** button to disconnect your wallet and reset the application state.

## 📁 Project Structure

```
paymaster-demo/
├── public/                      # Static assets
│   └── vite.svg
├── src/
│   ├── components/              # React components
│   │   └── ClaimReward.jsx     # Main reward claiming component
│   ├── utils/                   # Utility functions
│   │   ├── paymentService.js   # Transaction and payment logic
│   │   ├── walletProvider.js   # Wallet capability checks
│   │   └── walletServices.js   # Wallet connection and management
│   ├── App.css                  # Global styles
│   ├── App.jsx                  # Root application component
│   └── main.jsx                 # Application entry point
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies
├── README.md                    # Project documentation
└── vite.config.js               # Vite configuration
```

## 🔑 Key Concepts

### Paymaster Service

The Paymaster service sponsors gas fees for transactions, allowing users to interact with smart contracts without holding native tokens. This is achieved through EIP-5792's `wallet_sendCalls` method with paymaster capabilities.

### Base Account SDK

Base Account SDK provides a seamless wallet connection experience, handling authentication, network switching, and transaction signing.

### EIP-5792 Wallet Capabilities

The application uses EIP-5792 standard methods:
- `wallet_sendCalls`: Send batch transactions with paymaster support
- `wallet_getCallsStatus`: Monitor transaction status
- `wallet_getCapabilities`: Check wallet capabilities

## 🔧 Development

### Available Scripts

- **`npm run dev`**: Start development server
- **`npm run build`**: Build for production
- **`npm run preview`**: Preview production build
- **`npm run lint`**: Run ESLint

### Code Style

This project uses ESLint for code quality. Run linting before committing:

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 🐛 Troubleshooting

### Wallet Connection Issues

- Ensure you have a Base Account compatible wallet installed
- Check that you're on a supported browser (Chrome, Firefox, Brave)
- Clear browser cache and try again

### Transaction Failures

- Verify your Paymaster service URL is correct
- Check that the rewards contract address is valid
- Ensure the Paymaster service has sufficient funds

### Network Issues

- Confirm you're connected to Base Sepolia testnet
- Check your RPC URL is working
- Try switching networks manually in your wallet

### Common Errors

**"Paymaster service not configured properly"**
- Verify `VITE_PAYMASTER_SERVICE_URL` in `.env`
- Check Paymaster service is active in Coinbase Developer Portal

**"Failed to connect wallet"**
- Ensure Base Account SDK is properly initialized
- Check browser console for detailed error messages

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Resources

- [Base Documentation](https://docs.base.org/)
- [Base Account SDK](https://github.com/base-org/account)
- [Viem Documentation](https://viem.sh/)
- [EIP-5792 Specification](https://eips.ethereum.org/EIPS/eip-5792)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [troubleshooting](#troubleshooting) section

---

**Built with ❤️ using Base and Coinbase Paymaster**
