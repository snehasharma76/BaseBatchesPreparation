# VotingContract

A decentralized voting system built with Solidity and Foundry. This smart contract enables transparent, on-chain governance with role-based proposal creation and unrestricted voting.

## 📋 Overview

The VotingContract implements a simple yet powerful voting mechanism where:
- **Contract Owner** manages proposer permissions
- **Approved Proposers** can create proposals with custom durations
- **Anyone** can vote on active proposals (one vote per address)
- **Proposals** are automatically evaluated when closed (approved if yes votes > no votes)

## 🏗️ Architecture

### Contract Structure

```
VotingContract
├── Proposal Struct
│   ├── description (string)
│   ├── yesVotes (uint256)
│   ├── noVotes (uint256)
│   ├── active (bool)
│   ├── endTime (uint256)
│   └── approved (bool)
├── State Variables
│   ├── proposals[] (array)
│   ├── hasVoted (mapping)
│   ├── isApprovedProposer (mapping)
│   └── owner (address)
└── Functions
    ├── Admin Functions
    │   ├── approveProposer()
    │   └── removeProposer()
    ├── Proposer Functions
    │   └── createProposal()
    ├── Public Functions
    │   ├── vote()
    │   └── closeProposal()
    └── View Functions
        ├── getProposal()
        └── getProposalCount()
```

## 🚀 Features

- **Role-Based Access Control**: Owner manages proposer permissions
- **Time-Bound Voting**: Proposals have configurable voting periods
- **One Vote Per Address**: Prevents double voting
- **Transparent Results**: All votes and results are on-chain
- **Event Emission**: All actions emit events for easy tracking
- **Gas Optimized**: Efficient storage patterns and minimal operations

## 📦 Installation

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd VotingContract

# Install dependencies
forge install

# Build the contract
forge build
```

## 🧪 Testing

The contract includes comprehensive test coverage across multiple test files:

```bash
# Run all tests
forge test

# Run tests with verbosity
forge test -vvv

# Run specific test file
forge test --match-path test/Voting.t.sol

# Generate gas report
forge test --gas-report

# Generate coverage report
forge coverage
```

### Test Files

- `Deployment.t.sol` - Tests contract deployment and initialization
- `ProposalCreation.t.sol` - Tests proposal creation functionality
- `Voting.t.sol` - Tests voting mechanisms
- `ProposalClosing.t.sol` - Tests proposal closing logic
- `ProposerManagement.t.sol` - Tests proposer approval/removal
- `ViewFunctions.t.sol` - Tests view functions

## 📝 Usage

### Deploying the Contract

```bash
# Deploy to local network (Anvil)
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Deploy to testnet (e.g., Base Sepolia)
forge script script/Deploy.s.sol \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### Interacting with the Contract

```bash
# Approve a proposer (owner only)
cast send $CONTRACT_ADDRESS \
  "approveProposer(address)" $PROPOSER_ADDRESS \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Create a proposal (approved proposer only)
# Duration is in seconds (e.g., 604800 = 7 days)
cast send $CONTRACT_ADDRESS \
  "createProposal(string,uint256)" "Proposal description" 604800 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Vote on a proposal (true = yes, false = no)
cast send $CONTRACT_ADDRESS \
  "vote(uint256,bool)" 0 true \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Close a proposal (after endTime)
cast send $CONTRACT_ADDRESS \
  "closeProposal(uint256)" 0 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Get proposal details
cast call $CONTRACT_ADDRESS \
  "getProposal(uint256)" 0 \
  --rpc-url $RPC_URL

# Get total proposal count
cast call $CONTRACT_ADDRESS \
  "getProposalCount()" \
  --rpc-url $RPC_URL
```

## 🔐 Security Considerations

- **Access Control**: Only owner can manage proposers
- **Vote Integrity**: One vote per address per proposal
- **Time Constraints**: Voting only allowed during active period
- **State Validation**: All state changes are validated
- **Reentrancy**: No external calls, no reentrancy risk

## 📊 Events

The contract emits the following events:

```solidity
event ProposalCreated(uint256 proposalId, string description, uint256 endTime);
event VoteCast(uint256 proposalId, address voter);
event ProposalClosed(uint256 proposalId, bool approved);
event ProposerApproved(address proposer);
event ProposerRemoved(address proposer);
```

## 🛠️ Development

### Format Code

```bash
forge fmt
```

### Generate Gas Snapshots

```bash
forge snapshot
```

### Run Local Node

```bash
anvil
```

## 📄 License

MIT

## 🔗 Related Projects

- Frontend: See `../voting-frontend` for the Next.js dApp interface
- Built with [Foundry](https://book.getfoundry.sh/)

## 📚 Additional Resources

- [Foundry Documentation](https://book.getfoundry.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
