/**
 * Root provider component that wraps the app with necessary blockchain providers
 * Sets up Wagmi, React Query, and OnchainKit for Web3 functionality
 */

"use client";
import { ReactNode } from "react";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

// React Query client for managing async state
const queryClient = new QueryClient();

// Wagmi configuration for blockchain interactions
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Voting dApp",
      preference: "all",
    }),
    metaMask(),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              name: "Voting dApp",
              mode: "dark",
              theme: "default",
            },
            wallet: {
              display: "modal",
              preference: "all",
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
