import React from 'react';
import { useAccount } from 'wagmi';
import WalletButton from './WalletButton';
import SuccessCard from './SuccessCard';

export default function WalletModal() {
  const { isConnected, address, connector } = useAccount();

  if (isConnected) {
    return <SuccessCard address={address} provider={connector?.name} />;
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
      <p className="text-gray-400 mb-8">Connect your wallet to continue using SimpleON.</p>
      
      <WalletButton />
    </div>
  );
}
