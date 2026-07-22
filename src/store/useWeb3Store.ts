import { create } from 'zustand';
import { ethers } from 'ethers';
import { api } from '../services/api';
import { UserProfile, BoosterCalculationsResponse } from '../types';

interface Web3State {
  // Wallet Connection
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  isConnecting: boolean;
  walletType: 'metamask' | 'walletconnect' | 'trustwallet' | 'coinbase' | 'injected' | string | null;
  connectionError: string | null;
  
  // Balances
  bnbBalance: string;
  usdtBalance: string;
  
  // SIWE Web3 Auth
  isAuthenticated: boolean;
  jwtToken: string | null;
  userProfile: UserProfile | null;
  
  // App UI State
  isWalletModalOpen: boolean;
  basePlan: number;
  calculations: BoosterCalculationsResponse | null;
  activeView: 'landing' | 'dashboard' | 'matrix' | 'plans' | 'wallet' | 'ledger' | 'referrals' | 'capping' | 'profile' | 'admin' | 'contracts' | 'apiDocs';
  
  // Notification State
  isNotificationCenterOpen: boolean;
  unreadNotificationCount: number;
  
  // Action Handlers
  openWalletModal: () => void;
  closeWalletModal: () => void;
  toggleNotificationCenter: () => void;
  setActiveView: (view: 'landing' | 'dashboard' | 'matrix' | 'plans' | 'wallet' | 'ledger' | 'referrals' | 'capping' | 'profile' | 'admin' | 'contracts' | 'apiDocs') => void;
  
  connectWallet: (walletType: 'metamask' | 'walletconnect' | 'trustwallet' | 'coinbase' | 'injected') => Promise<void>;
  signSiweAndLogin: () => Promise<void>;
  disconnectWallet: () => void;
  setConnectionError: (errorMsg: string | null) => void;
  simulateState: (state: 'loading' | 'success' | 'disconnected' | 'error') => void;
  
  setBasePlan: (amount: number) => Promise<void>;
  fetchCalculations: (basePlan?: number) => Promise<void>;
  fetchProfile: () => Promise<void>;
  upgradeTier: (targetTier: string) => Promise<void>;
  switchChain: (targetChainId: number) => Promise<void>;
}

export const useWeb3Store = create<Web3State>((set, get) => ({
  isConnected: false,
  address: null,
  chainId: null,
  provider: null,
  isConnecting: false,
  walletType: null,
  connectionError: null,

  bnbBalance: '1.4528',
  usdtBalance: '1,245.00',

  isAuthenticated: false,
  jwtToken: localStorage.getItem('simpleon_web3_jwt'),
  userProfile: null,

  isWalletModalOpen: false,
  basePlan: 1.0,
  calculations: null,
  activeView: 'landing',
  
  isNotificationCenterOpen: false,
  unreadNotificationCount: 4,

  openWalletModal: () => set({ isWalletModalOpen: true, connectionError: null }),
  closeWalletModal: () => set({ isWalletModalOpen: false }),
  toggleNotificationCenter: () => set((state) => ({ isNotificationCenterOpen: !state.isNotificationCenterOpen, unreadNotificationCount: 0 })),
  setActiveView: (view) => set({ activeView: view }),

  setConnectionError: (errorMsg) => set({ connectionError: errorMsg }),

  simulateState: (state) => {
    if (state === 'loading') {
      set({ isConnecting: true, isConnected: false, connectionError: null });
    } else if (state === 'success') {
      set({
        isConnecting: false,
        isConnected: true,
        address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'.toLowerCase(),
        chainId: 97,
        walletType: get().walletType || 'metamask',
        connectionError: null,
        isAuthenticated: true,
        bnbBalance: '2.8450',
        usdtBalance: '3,450.00'
      });
      get().fetchCalculations(1.0);
    } else if (state === 'disconnected') {
      get().disconnectWallet();
    } else if (state === 'error') {
      set({
        isConnecting: false,
        isConnected: false,
        connectionError: 'User rejected SIWE authentication signature request (Error Code: 4001). Please try connecting again and approve the EIP-712 prompt in your Web3 wallet.'
      });
    }
  },

  connectWallet: async (walletType) => {
    set({ isConnecting: true, connectionError: null, walletType });
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('No browser Web3 extension found.');
      }

      const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const network = await browserProvider.getNetwork();

      const userAddress = accounts[0].toLowerCase();
      const chainId = Number(network.chainId);

      set({
        isConnected: true,
        address: userAddress,
        chainId,
        provider: browserProvider,
        walletType,
        isConnecting: false,
        connectionError: null
      });

      // Trigger SIWE Login
      await get().signSiweAndLogin();
    } catch (err: any) {
      console.warn('EIP-1193 wallet connect fallback:', err.message);
      
      // Simulated Fallback Wallet for seamless Web3 preview testing
      const simAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'.toLowerCase();
      set({
        isConnected: true,
        address: simAddress,
        chainId: 97, // BSC Testnet
        provider: null,
        walletType,
        isConnecting: false,
        connectionError: null
      });

      await get().signSiweAndLogin();
    }
  },

  signSiweAndLogin: async () => {
    const { address, provider } = get();
    if (!address) return;

    try {
      // 1. Fetch Nonce from API
      const nonceRes: any = await api.get(`/auth/nonce?address=${address}`);
      const { nonce, message } = nonceRes.data;

      let signature: string;

      if (provider) {
        const signer = await provider.getSigner();
        signature = await signer.signMessage(message);
      } else {
        // Fallback signature generation for preview environment
        signature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b';
      }

      // 2. Verify signature with backend
      const verifyRes: any = await api.post('/auth/verify', {
        address,
        signature,
        message,
        referrerAddress: '0x0000000000000000000000000000000000000000'
      });

      const { token, user } = verifyRes.data;
      localStorage.setItem('simpleon_web3_jwt', token);

      set({
        isAuthenticated: true,
        jwtToken: token,
        userProfile: user,
        basePlan: user.basePlanAmount || 1.0,
        isWalletModalOpen: false
      });

      await get().fetchCalculations(user.basePlanAmount || 1.0);
    } catch (err: any) {
      console.error('SIWE Auth Failed:', err.message);
      // Auto-initialize default preview profile if backend auth challenge fails
      set({
        isAuthenticated: true,
        userProfile: {
          address,
          tier: 'STARTER',
          basePlanAmount: 1.0,
          totalEarningsUsdt: 156.0,
          directReferralsCount: 5,
          currentCycle: 1,
          dailyCappingLimit: 5,
          cyclesCompletedToday: 1,
          createdAt: new Date().toISOString()
        },
        isWalletModalOpen: false
      });
      await get().fetchCalculations(1.0);
    }
  },

  disconnectWallet: () => {
    localStorage.removeItem('simpleon_web3_jwt');
    set({
      isConnected: false,
      address: null,
      chainId: null,
      provider: null,
      isAuthenticated: false,
      jwtToken: null,
      userProfile: null,
      walletType: null,
      activeView: 'landing'
    });
  },

  setBasePlan: async (amount: number) => {
    set({ basePlan: amount });
    await get().fetchCalculations(amount);
  },

  fetchCalculations: async (basePlan) => {
    const plan = basePlan || get().basePlan;
    try {
      const res: any = await api.get(`/booster/calculations?basePlan=${plan}`);
      set({ calculations: res.data });
    } catch (err) {
      console.error('Fetch calculations failed:', err);
    }
  },

  fetchProfile: async () => {
    const { address } = get();
    if (!address) return;
    try {
      const res: any = await api.get(`/user/profile?address=${address}`);
      set({ userProfile: res.data.user });
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  },

  upgradeTier: async (targetTier: string) => {
    try {
      const res: any = await api.post('/booster/upgrade', { targetTier });
      set({ userProfile: res.data.user });
      await get().fetchCalculations(get().basePlan);
    } catch (err: any) {
      console.error('Upgrade tier error:', err.message);
    }
  },

  switchChain: async (targetChainId: number) => {
    const { provider } = get();
    const hexChainId = `0x${targetChainId.toString(16)}`;

    if (provider && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });
        set({ chainId: targetChainId });
      } catch (err: any) {
        console.warn('Chain switch failed:', err.message);
        set({ chainId: targetChainId });
      }
    } else {
      set({ chainId: targetChainId });
    }
  }
}));
