# Voting dApp Setup Guide

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- MetaMask or Coinbase Wallet browser extension
- Base Sepolia testnet ETH (for testing)

## Step-by-Step Setup

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Add the following variables:

```env
# Required: Your deployed contract address on Base Sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere

# Optional but recommended: OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here

# Optional: Project name
NEXT_PUBLIC_PROJECT_NAME=Voting dApp
```

### 2. Get OnchainKit API Key (Optional)

1. Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Sign in or create an account
3. Create a new project
4. Navigate to API Keys section
5. Generate a new API key
6. Copy and paste into `.env.local`

**Note**: The app will work without an API key, but having one provides better performance and higher rate limits.

### 3. Deploy Your Smart Contract

If you haven't deployed the VotingContract yet:

1. Navigate to the contract directory:
```bash
cd ../VotingContract
```

2. Deploy to Base Sepolia:
```bash
forge create --rpc-url https://sepolia.base.org \
  --private-key YOUR_PRIVATE_KEY \
  src/VotingContract.sol:VotingContract
```

3. Copy the deployed contract address
4. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`

### 4. Get Base Sepolia Testnet ETH

1. Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Connect your wallet
3. Request testnet ETH
4. Wait for the transaction to confirm

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Wallet Setup

### MetaMask

1. Install [MetaMask extension](https://metamask.io/)
2. Add Base Sepolia network:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.basescan.org

### Coinbase Wallet

1. Install [Coinbase Wallet extension](https://www.coinbase.com/wallet)
2. Base Sepolia should be available by default
3. Switch to Base Sepolia network

## Testing the Application

### As a Regular User

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Choose MetaMask or Coinbase Wallet
   - Approve the connection

2. **View Proposals**
   - Navigate to "Proposals" tab
   - See all active and closed proposals
   - View vote counts and time remaining

3. **Vote on Proposals**
   - Click "Vote Yes" or "Vote No" on an active proposal
   - Confirm the transaction in your wallet
   - Wait for confirmation
   - See your vote reflected immediately

### As a Proposer

1. **Get Approved** (requires contract owner)
   - Share your wallet address with the contract owner
   - Owner must approve you via Admin panel

2. **Create Proposal**
   - Navigate to "Create" tab
   - Enter proposal description
   - Set voting duration (in days)
   - Click "Create Proposal"
   - Confirm transaction

3. **Monitor Proposals**
   - Watch real-time vote updates
   - Close proposals after voting period ends

### As Contract Owner

1. **Access Admin Panel**
   - Navigate to "Admin" tab
   - Only visible if you're the contract owner

2. **Manage Proposers**
   - Enter wallet address
   - Click "Approve Proposer" to grant permissions
   - Click "Remove Proposer" to revoke permissions

3. **Monitor Events**
   - Navigate to "Events" tab
   - See all contract activity in real-time

## Troubleshooting

### "Connect Your Wallet" Message Persists

- Ensure you're connected to Base Sepolia network
- Try disconnecting and reconnecting your wallet
- Clear browser cache and reload

### "Not Authorized" for Creating Proposals

- You need to be an approved proposer
- Contact the contract owner to approve your address
- Contract owner is automatically approved

### Transactions Failing

- Ensure you have enough Base Sepolia ETH for gas
- Check that you're on the correct network (Base Sepolia)
- Verify the contract address in `.env.local` is correct

### Events Not Showing

- Events only appear after they occur
- Try creating a proposal or voting to generate events
- Refresh the page if events seem delayed

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy

### Manual Build

```bash
npm run build
npm start
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Yes | Deployed VotingContract address on Base Sepolia |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | No | Coinbase Developer Platform API key |
| `NEXT_PUBLIC_PROJECT_NAME` | No | Display name for your dApp |

## Network Information

- **Network**: Base Sepolia Testnet
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Currency**: ETH (testnet)

## Support

For issues or questions:
- Check the [README.md](./README.md) for detailed documentation
- Review the [OnchainKit docs](https://docs.base.org/builderkits/onchainkit/)
- Inspect browser console for error messages

## Next Steps

1. Test all features thoroughly on testnet
2. Consider adding additional features:
   - Proposal categories
   - Voting power based on token holdings
   - Delegation system
   - Proposal comments/discussion
3. Audit smart contract before mainnet deployment
4. Deploy to Base mainnet when ready

---

Happy building! 🚀
