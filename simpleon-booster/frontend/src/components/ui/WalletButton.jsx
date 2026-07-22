import React from 'react';
import { useAppKit } from '@reown/appkit/react';

export default function WalletButton() {
  const { open } = useAppKit();

  return (
    <button 
      onClick={() => open()}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
    >
      Connect Wallet
    </button>
  );
}
