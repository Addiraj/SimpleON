import React, { useEffect, useState } from 'react';
import { useDisconnect } from 'wagmi';
import axios from 'axios';

export default function SuccessCard({ address, provider }) {
  const { disconnect } = useDisconnect();
  const [memberId, setMemberId] = useState('Loading...');

  // Connect to backend when address is available
  useEffect(() => {
    let isMounted = true;
    
    const connectToBackend = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/wallet/connect', {
          address,
          provider
        });
        
        if (response.data.success && isMounted) {
          setMemberId(response.data.data.user.memberId);
        }
      } catch (error) {
        console.error("Failed to connect to backend:", error);
        if (isMounted) setMemberId("Error");
      }
    };

    if (address) {
      connectToBackend();
    }
    
    return () => {
      isMounted = false;
    };
  }, [address]);

  const handleDisconnect = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/wallet/disconnect', { address });
    } catch (error) {
      console.error("Failed to disconnect from backend:", error);
    }
    disconnect();
  };

  // Format address to look like 0x123...abcd
  const formattedAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : '';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl">✅</span>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">Wallet Connected</h2>
      <p className="text-green-400 font-mono mb-4">{formattedAddress}</p>
      
      <div className="bg-gray-800 rounded-lg py-3 px-6 mb-8 w-full">
        <p className="text-gray-400 text-sm mb-1">Your Member ID</p>
        <p className="text-xl font-bold text-white">{memberId}</p>
      </div>

      <button 
        disabled
        className="w-full bg-gray-800 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed mb-4"
      >
        Dashboard (Coming Soon)
      </button>

      <button 
        onClick={handleDisconnect}
        className="text-gray-400 hover:text-white transition-colors text-sm"
      >
        Disconnect Wallet
      </button>
    </div>
  );
}
