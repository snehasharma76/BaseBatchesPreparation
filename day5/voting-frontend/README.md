# Voting dApp Frontend

A modern, responsive Web3 frontend for the VotingContract built with Next.js, OnchainKit, and TailwindCSS. This decentralized application provides an intuitive interface for creating proposals, voting, and managing governance on Base Sepolia.

## 📋 Overview

This frontend application connects to the VotingContract smart contract and provides:
- **Wallet Integration**: Connect with Coinbase Wallet or MetaMask
- **Proposal Management**: View, create, and vote on proposals
- **Admin Panel**: Manage proposer permissions (owner only)
- **Real-time Events**: Live feed of contract events
- **Responsive Design**: Beautiful UI that works on all devices

## 🏗️ Architecture

### Project Structure

```
voting-frontend/
├── app/
│   ├── page.tsx              # Main page with tabbed interface
│   ├── layout.tsx            # Root layout with metadata
│   ├── rootProvider.tsx      # Web3 providers setup
│   └── globals.css           # Global styles
├── components/
│   ├── proposals/
│   │   ├── ProposalCard.tsx      # Individual proposal display
│   │   ├── ProposalList.tsx      # List of all proposals
│   │   └── CreateProposalForm.tsx # Form to create proposals
│   ├── admin/
│   │   └── AdminPanel.tsx        # Admin controls
│   ├── wallet/
│   │   └── WalletButton.tsx      # Wallet connection UI
│   └── events/
│       └── EventsFeed.tsx        # Real-time event display
├── hooks/
│   ├── useVotingContract.ts  # Contract interaction hooks
│   └── useContractEvents.ts  # Event watching hooks
└── utils/
    └── contractConfig.ts     # Contract address and ABI
```

## 🚀 Features

### Core Features
- **🔐 Wallet Connection**: Multi-wallet support (Coinbase Wallet, MetaMask)
- **📝 Proposal Creation**: Approved proposers can create proposals with custom durations
- **🗳️ Voting System**: One vote per address with real-time vote counting
- **⏱️ Countdown Timers**: Live countdown for active proposals
- **🎯 Admin Controls**: Owner can approve/remove proposers
- **⚡ Real-time Updates**: Live event feed with automatic UI updates
- **📱 Responsive Design**: Mobile-first design with modern UI

### UI/UX Features
- **Glass-morphism Design**: Modern, sleek interface
- **Gradient Effects**: Eye-catching color gradients
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Visual confirmation of actions
- **Dark Mode**: Beautiful dark theme

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A wallet (Coinbase Wallet or MetaMask)
- Base Sepolia testnet ETH

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd voting-frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Create environment file
cp env.example .env.local

# Edit .env.local with your values
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required: Your deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress

# Optional: OnchainKit API key for enhanced features
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here

# Optional: Project name
NEXT_PUBLIC_PROJECT_NAME="Voting dApp"
```

## 🚀 Getting Started

### Development

```bash
# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Open http://localhost:3000 in your browser
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Lint

```bash
# Run ESLint
npm run lint
```

## 📱 Usage Guide

### 1. Connect Your Wallet

1. Click the "Connect Wallet" button in the header
2. Select your preferred wallet (Coinbase Wallet or MetaMask)
3. Approve the connection in your wallet
4. Your address and balance will be displayed

### 2. View Proposals

- Navigate to the "Proposals" tab (default view)
- See all active and closed proposals
- View vote counts and percentages
- Check time remaining for active proposals

### 3. Vote on Proposals

1. Connect your wallet
2. Find an active proposal
3. Click "Vote Yes" or "Vote No"
4. Confirm the transaction in your wallet
5. Wait for confirmation

### 4. Create Proposals (Approved Proposers Only)

1. Navigate to the "Create" tab
2. Enter proposal description
3. Set voting duration (in days)
4. Click "Create Proposal"
5. Confirm transaction

### 5. Admin Functions (Owner Only)

1. Navigate to the "Admin" tab
2. Enter an Ethereum address
3. Click "Approve Proposer" or "Remove Proposer"
4. Confirm transaction

### 6. View Events

- Navigate to the "Events" tab
- See real-time contract activity
- Events include: proposals created, votes cast, proposals closed, etc.

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework

### Web3 Stack
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript Ethereum library
- **OnchainKit**: Coinbase's Web3 toolkit
- **React Query**: Async state management

### Wallet Support
- Coinbase Wallet
- MetaMask
- Any WalletConnect-compatible wallet

## 🎨 Styling

The application uses a custom design system with:
- **Color Palette**: Indigo, purple, and gradient accents
- **Typography**: Inter for body text, Source Code Pro for code
- **Components**: Glass-morphism cards with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first breakpoints

## 🔧 Configuration

### Wagmi Configuration

The app is configured for Base Sepolia testnet. To change networks, edit `app/rootProvider.tsx`:

```typescript
import { baseSepolia, mainnet } from 'wagmi/chains';

const wagmiConfig = createConfig({
  chains: [baseSepolia], // Change this
  // ... rest of config
});
```

### Contract Configuration

Update the contract address and ABI in `utils/contractConfig.ts` after deploying a new contract.

## 📊 Component Documentation

### Custom Hooks

#### `useVotingContract.ts`
- `useProposalCount()` - Get total proposal count
- `useProposal(id)` - Get proposal details
- `useHasVoted(id, address)` - Check if address voted
- `useIsApprovedProposer(address)` - Check proposer status
- `useOwner()` - Get contract owner
- `useVote()` - Cast a vote
- `useCreateProposal()` - Create proposal
- `useCloseProposal()` - Close proposal
- `useApproveProposer()` - Approve proposer
- `useRemoveProposer()` - Remove proposer

#### `useContractEvents.ts`
- `useContractEvents()` - Watch all contract events in real-time

### Components

All components are fully documented with JSDoc comments. See the source files for detailed information.

## 🔐 Security

- **Environment Variables**: Never commit `.env.local` to version control
- **Private Keys**: Never expose private keys in the frontend
- **RPC URLs**: Use secure RPC endpoints
- **Contract Validation**: Always verify contract addresses

## 🐛 Troubleshooting

### Common Issues

**Wallet won't connect**
- Ensure you're on the correct network (Base Sepolia)
- Try refreshing the page
- Clear browser cache

**Contract not configured error**
- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is set in `.env.local`
- Ensure the contract is deployed on Base Sepolia

**Transaction fails**
- Check you have enough ETH for gas
- Verify you meet the requirements (e.g., approved proposer)
- Check the proposal is still active

**Events not showing**
- Events only show new activity after page load
- Refresh the page to see historical events

## 📄 License

MIT

## 🔗 Related Projects

- Smart Contract: See `../VotingContract` for the Solidity contract
- Built with [OnchainKit](https://onchainkit.xyz/)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Base Documentation](https://docs.base.org/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.
