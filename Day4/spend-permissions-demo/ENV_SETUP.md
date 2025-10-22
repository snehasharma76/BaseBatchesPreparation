# Environment Setup

## Create `.env` file

In the root directory, create a `.env` file:

```bash
cp .env.example .env
```

Then edit `.env` and add your backend wallet address:

```env
VITE_BACKEND_WALLET_ADDRESS=0x0f7282924209a35dE7416d2fb6Bf5c98dC131fA6
```

## Important Notes

- The `.env` file is gitignored (not tracked by git)
- You must create it manually
- Get the backend wallet address by running: `cd backend && npm run address`
- The address must start with `0x`

## Verify Setup

After creating `.env`, restart the dev server:

```bash
npm run dev
```

The backend wallet address should appear in the UI when you connect your wallet.
