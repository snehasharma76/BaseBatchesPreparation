# 🤖 Trip Expense Agent

> An AI-powered expense tracking agent that combines XMTP messaging, Coinbase AgentKit blockchain capabilities, and Google Gemini AI for natural language processing.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Network](https://img.shields.io/badge/network-Base%20Sepolia-blue)](https://base.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Trip Expense Agent is an intelligent assistant that helps you track trip expenses and manage payments on the Base Sepolia testnet. Built with cutting-edge technologies, it provides a conversational interface through XMTP messaging, allowing users to naturally interact with blockchain operations and expense tracking.

### Key Technologies

- **XMTP Protocol**: Decentralized messaging for secure communication
- **Coinbase AgentKit**: Blockchain operations and wallet management
- **Google Gemini AI**: Natural language understanding and processing
- **LangChain**: AI agent orchestration and tool integration
- **Base Sepolia**: Layer 2 testnet for fast, low-cost transactions

## ✨ Features

### 💰 Expense Management
- **Add Expenses**: Track spending with natural language ("I spent 2 ETH on flight")
- **List Expenses**: View all tracked expenses with totals
- **Split Bills**: Automatically calculate per-person amounts
- **Clear Expenses**: Reset expense tracking for new trips

### 🔗 Blockchain Integration
- **Wallet Operations**: Check balance and manage funds
- **ETH Transfers**: Send payments on Base Sepolia
- **Transaction Tracking**: View transaction hashes and explorer links
- **Fund Requests**: Generate payment request messages

### 🤖 AI-Powered Interactions
- **Natural Language**: Chat naturally without learning commands
- **Context Awareness**: Understands conversation context
- **Smart Tool Selection**: Automatically uses appropriate tools
- **Error Handling**: Graceful error recovery and user feedback

## 🏗️ Architecture

```
┌─────────────────┐
│  XMTP Messages  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│    Trip Expense Agent           │
│  ┌──────────────────────────┐   │
│  │   Message Handler        │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   AI Agent (Gemini)      │   │
│  │   + LangChain Tools      │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │  Expense Manager         │   │
│  │  + AgentKit Tools        │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
         │              │
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│ Local JSON   │  │ Base Sepolia │
│   Storage    │  │  Blockchain  │
└──────────────┘  └──────────────┘
```

### Core Components

#### **TripExpenseAgent** (`index.js`)
Main orchestrator that coordinates all services and handles the application lifecycle.

#### **AIAgent** (`src/services/ai-agent.js`)
Integrates Google Gemini LLM with LangChain for natural language processing and tool execution.

#### **ExpenseManager** (`src/services/expense-manager.js`)
Manages expense tracking with local JSON persistence, supporting multiple conversations.

#### **XMTPService** (`src/services/xmtp-service.js`)
Handles XMTP messaging protocol for secure, decentralized communication.

#### **WalletService** (`src/services/wallet-service.js`)
Manages blockchain wallet operations using Coinbase SDK.

#### **Expense Tools** (`tools/expense-tools.js`)
LangChain tools that expose expense management capabilities to the AI agent.

## 📦 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Coinbase Developer Platform Account**: [Sign up here](https://portal.cdp.coinbase.com/)
- **Google Gemini API Key**: [Get it here](https://makersuite.google.com/app/apikey)
- **Base Sepolia Testnet**: Faucet access for test ETH

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trip-expense-agent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate XMTP Keys

```bash
npm run gen:keys
```

This will generate:
- `XMTP_WALLET_KEY`: Private key for XMTP agent
- `XMTP_DB_ENCRYPTION_KEY`: Encryption key for local database
- Agent wallet address

### 4. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# XMTP Configuration (from gen:keys output)
XMTP_WALLET_KEY=0x...
XMTP_DB_ENCRYPTION_KEY=...
XMTP_ENV=dev

# Coinbase CDP Configuration
CDP_API_KEY_NAME=organizations/...
CDP_API_KEY_PRIVATE_KEY=-----BEGIN EC PRIVATE KEY-----\n...\n-----END EC PRIVATE KEY-----
CDP_WALLET_SECRET=...

# Network Configuration
NETWORK_ID=base-sepolia
RPC_URL=https://sepolia.base.org

# Google Gemini API
GEMINI_API_KEY=...
```

## ⚙️ Configuration

### Getting Coinbase CDP Credentials

1. Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Create a new project
3. Generate API credentials
4. Copy the API Key Name and Private Key
5. Generate a wallet secret (or use `npm run gen:wallet`)

### Getting Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### Network Configuration

The agent is configured for **Base Sepolia** testnet by default. To use a different network:

1. Update `NETWORK_ID` in `.env`
2. Update `RPC_URL` if needed
3. Ensure your wallet has funds on the target network

## 🎯 Usage

### Starting the Agent

```bash
npm start
```

You should see output like:

```
2️⃣  Initializing XMTP messaging...
✅ XMTP Agent initialized
📬 Agent address: 0x...
🔗 Chat with agent: https://...

✅ AI Agent initialized successfully!
============================================================
💬 Chat naturally - AI understands your requests!
💡 Try: "add 0.01 ETH for lunch" or "what's my balance?"
============================================================

Agent is ready and listening for messages!
```

### Chatting with the Agent

Use the provided XMTP test URL to start a conversation. Here are example interactions:

#### Adding Expenses

```
You: I spent 2 ETH on flight tickets
Agent: ✅ Expense added: flight tickets - 2 ETH (paid by: user)

You: My friend Alice paid 1.5 ETH for the hotel
Agent: ✅ Expense added: hotel - 1.5 ETH (paid by: Alice)
```

#### Viewing Expenses

```
You: Show me all expenses
Agent: 📊 Expenses (Total: 3.500000 ETH)

1. flight tickets: 2 ETH (paid by: user)
2. hotel: 1.5 ETH (paid by: Alice)
```

#### Splitting Bills

```
You: Split the expenses among 4 people
Agent: 💰 Split Result:
Total: 3.500000 ETH
People: 4
Per Person: 0.875000 ETH
```

#### Checking Balance

```
You: What's my balance?
Agent: Your wallet balance is 5.234 ETH on base-sepolia
```

#### Sending Payments

```
You: Send 0.5 ETH to 0x1234...5678
Agent: ✅ Transaction successful!
Hash: 0xabc...def
View on explorer: https://sepolia.basescan.org/tx/0xabc...def
```

#### Clearing Expenses

```
You: Clear all expenses
Agent: ✅ All expenses cleared.
```

## 📁 Project Structure

```
trip-expense-agent/
├── index.js                    # Main entry point
├── package.json                # Dependencies and scripts
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
│
├── src/
│   ├── config/
│   │   └── environment.js     # Environment configuration
│   │
│   └── services/
│       ├── ai-agent.js        # AI agent with Gemini + LangChain
│       ├── expense-manager.js # Expense tracking logic
│       ├── wallet-service.js  # Blockchain wallet operations
│       └── xmtp-service.js    # XMTP messaging service
│
├── tools/
│   └── expense-tools.js       # LangChain expense tools
│
├── scripts/
│   └── generate-keys.js       # XMTP key generation
│
└── data/
    └── expense.json           # Local expense storage (gitignored)
```

## 📚 API Documentation

### TripExpenseAgent

#### `constructor()`
Initializes all service instances.

#### `async initialize()`
Sets up AI agent and XMTP service.

**Returns**: `Promise<boolean>`

#### `async start()`
Starts the agent and begins listening for messages.

**Returns**: `Promise<void>`

#### `async handleMessage(ctx)`
Processes incoming XMTP messages.

**Parameters**:
- `ctx` (Object): XMTP message context

**Returns**: `Promise<void>`

### ExpenseManager

#### `addExpenses(conversationId, amount, description, paidBy)`
Adds a new expense.

**Parameters**:
- `conversationId` (string): Conversation identifier
- `amount` (number): Amount in ETH
- `description` (string): Expense description
- `paidBy` (string): Who paid (default: 'user')

**Returns**: `Object` - Created expense

#### `getExpenses(conversationId)`
Retrieves all expenses for a conversation.

**Returns**: `Array<Object>` - Expense list

#### `split(conversationId, numPeople)`
Calculates split amounts.

**Parameters**:
- `conversationId` (string): Conversation identifier
- `numPeople` (number): Number of people

**Returns**: `Object` - Split calculation

### WalletService

#### `async getBalance()`
Gets wallet ETH balance.

**Returns**: `Promise<Object>` - Balance info

#### `async sendETH(toAddress, amount)`
Sends ETH to an address.

**Parameters**:
- `toAddress` (string): Recipient address
- `amount` (number): Amount in ETH

**Returns**: `Promise<Object>` - Transaction result

## 🛠️ Development

### Available Scripts

```bash
# Start the agent
npm start

# Generate XMTP keys
npm run gen:keys

# Generate wallet secret
npm run gen:wallet

# Run tests
npm test
```

### Adding New Features

1. **New Expense Tool**: Add to `tools/expense-tools.js`
2. **New Service**: Create in `src/services/`
3. **Update AI Prompt**: Modify `getSystemPrompt()` in `ai-agent.js`

### Code Style

- Use ES6+ modules
- Follow JSDoc documentation standards
- Use async/await for asynchronous operations
- Handle errors gracefully with try-catch

## 🐛 Troubleshooting

### Common Issues

#### "Missing required environment variables"
**Solution**: Ensure all variables in `.env.example` are set in your `.env` file.

#### "Failed to initialize XMTP"
**Solution**: 
- Verify `XMTP_WALLET_KEY` is valid (starts with `0x`)
- Check `XMTP_DB_ENCRYPTION_KEY` is 64 hex characters
- Run `npm run gen:keys` to generate new keys

#### "Wallet not initialized"
**Solution**:
- Verify CDP credentials are correct
- Check `CDP_WALLET_SECRET` is set
- Ensure network connectivity

#### "Transaction failed: insufficient funds"
**Solution**: Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

#### Agent not responding to messages
**Solution**:
- Check console for errors
- Verify XMTP connection is established
- Ensure Gemini API key is valid

### Debug Mode

Enable detailed logging:

```javascript
// In index.js
console.log('Debug:', JSON.stringify(context, null, 2));
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Write clear commit messages
- Add JSDoc documentation for new functions
- Update README for new features
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **XMTP**: For decentralized messaging protocol
- **Coinbase**: For AgentKit and CDP platform
- **Google**: For Gemini AI API
- **LangChain**: For AI agent orchestration
- **Base**: For L2 blockchain infrastructure

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [Troubleshooting](#troubleshooting) section

## 🗺️ Roadmap

- [ ] Multi-currency support
- [ ] Database backend (PostgreSQL/MongoDB)
- [ ] Web dashboard for expense visualization
- [ ] Group expense management
- [ ] Receipt image processing
- [ ] Mainnet deployment support
- [ ] Mobile app integration

---

**Built with ❤️ for the Web3 community**

*Happy expense tracking! 🚀*
