# Application Flow

## Connection Flow

1. **User clicks "Connect Wallet"**
   - SDK initializes Base Account provider
   - Requests account access via `eth_requestAccounts`
   - Gets Universal Account address

2. **Auto-check for Subaccount**
   - Calls `wallet_getSubAccounts` with universal account
   - Checks if subaccount exists for this domain

3. **Auto-create Subaccount (if needed)**
   - If no subaccount exists, automatically creates one
   - Calls `wallet_addSubAccount` with `type: 'create'`
   - Stores subaccount address

4. **Display Both Accounts**
   - Shows Universal Account (main wallet)
   - Shows Subaccount (smart wallet) with "Funding Account" badge

## Funding Flow

1. **User clicks "Fund Me"**
   - Validates subaccount exists
   - Prepares transaction data

2. **Send from Subaccount**
   - Uses `wallet_sendCalls` method
   - Sends from subaccount address (NOT universal account)
   - Calls `fundMe()` function with exactly 0.0009 ETH

3. **Transaction Confirmation**
   - Returns calls ID
   - Displays success message

## Key Points

- ✅ **Subaccount is created automatically** on wallet connection
- ✅ **All funding happens from the subaccount**, not the universal account
- ✅ **Smart wallet benefits**: Account abstraction, batch transactions, gas sponsorship capability
- ✅ **Domain-scoped**: Each app gets its own subaccount per user
