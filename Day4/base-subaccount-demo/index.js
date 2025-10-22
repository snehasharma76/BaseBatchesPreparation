import { requestSpendPermission } from "@base-org/account/spend-permission";
import { createBaseAccountSDK } from "@base-org/account";
import { baseSepolia } from "viem/chains";

const sdk = createBaseAccountSDK({
  appName: 'Base Account SDK Demo',
  appLogoUrl: 'https://base.org/logo.png',
  appChainIds: [baseSepolia.id],
});

const permission = await requestSpendPermission({
  account: "0x...",
  spender: "0x...",
  token: "0x...",
  chainId: 8453, // or any other supported chain
  allowance: 1_000_000n,
  periodInDays: 30,
  provider: sdk.getProvider(),
});

console.log("Spend Permission:", permission);