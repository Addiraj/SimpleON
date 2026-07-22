import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, bsc, polygon } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

// 1. Get projectId from env (fallback for local dev if missing, but it requires a real ID to work)
const projectId = import.meta.env.VITE_PROJECT_ID || 'YOUR_PROJECT_ID_HERE';

if (projectId === 'YOUR_PROJECT_ID_HERE') {
    console.warn('⚠️ Please add your WalletConnect Project ID to the .env file (VITE_PROJECT_ID)');
}

// 2. Setup networks
const networks = [mainnet, arbitrum, bsc, polygon];

// 3. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

// 4. Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'SimpleON Booster',
    description: 'Connect to SimpleON Booster',
    url: 'https://simpleon.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  features: {
    analytics: true
  }
});

export default function WalletProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
