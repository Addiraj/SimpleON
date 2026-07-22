import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Wallet, ArrowRight, CheckCircle2, Zap, AlertCircle, RefreshCw, Lock, Sparkles } from 'lucide-react';
import { useWeb3Store } from '../store/useWeb3Store';

export default function WalletModal() {
  const { 
    isWalletModalOpen, 
    closeWalletModal, 
    connectWallet, 
    isConnecting, 
    connectionError, 
    setConnectionError,
    walletType 
  } = useWeb3Store();

  if (!isWalletModalOpen) return null;

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      badge: 'Popular',
      color: 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-500',
      description: 'Connect using MetaMask extension or mobile dApp browser.',
      svg: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber-500">
          <path d="M21.52 1.5a.69.69 0 00-.81.08L14.9 6.22 13.5 1.7a.69.69 0 00-1.12-.22L8.14 5.37 3.32 1.58a.69.69 0 00-.82-.08.68.68 0 00-.28.81l2.84 8.71L.46 13.91a.69.69 0 00.1.92l8.82 8.44a.69.69 0 00.95 0l8.82-8.44a.69.69 0 00.1-.92l-4.6-2.89 2.84-8.71a.68.68 0 00-.28-.81z" />
        </svg>
      )
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      badge: 'Mobile First',
      color: 'border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/20 text-blue-500',
      description: 'Direct EIP-1193 integration for Trust Wallet users.',
      svg: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-500">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      )
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      badge: 'Multi-Chain',
      color: 'border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-500/20 text-cyan-500',
      description: 'Scan QR code with Trust Wallet, Rainbow, or 100+ Web3 wallets.',
      svg: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-cyan-500">
          <path d="M6.5 8c2.8-2.8 7.2-2.8 10 0l.5.5-2 2-.5-.5c-1.7-1.7-4.3-1.7-6 0l-.5.5-2-2 .5-.5zm-4 4c5-5 13-5 18 0l.5.5-2 2-.5-.5c-3.9-3.9-10.1-3.9-14 0l-.5.5-2-2 .5-.5zm7.5 4.5l2 2 2-2 2 2c-.6.6-1.4 1-2 1s-1.4-.4-2-1l-2-2z" />
        </svg>
      )
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      badge: 'Self-Custody',
      color: 'border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-500/20 text-indigo-500',
      description: 'Connect with Coinbase Smart Wallet or mobile app.',
      svg: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-indigo-500">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-2-5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-surface border border-border-theme rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-red/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-theme relative z-10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-accent-red/10 text-accent-red flex items-center justify-center border border-accent-red/20 shadow-sm">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-prime">Connect Web3 Wallet</h3>
              <p className="text-xs text-sub">Select your wallet provider to authenticate</p>
            </div>
          </div>
          <button
            onClick={closeWalletModal}
            className="p-2 rounded-xl hover:bg-surface-elevated text-sub hover:text-prime transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Security Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-surface-elevated/90 border border-border-theme flex items-center space-x-3 text-xs text-sub relative z-10">
          <Shield size={18} className="text-accent-red shrink-0" />
          <span>
            Uses cryptographic <strong className="text-prime font-bold">SIWE (Sign-In With Ethereum / EIP-4361)</strong> for secure session authentication without gas fees.
          </span>
        </div>

        {/* Connection Error State Alert */}
        <AnimatePresence>
          {connectionError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 flex items-start space-x-3"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="font-extrabold uppercase tracking-wide">Connection Error</div>
                <div className="leading-relaxed text-[11px] text-prime/90">{connectionError}</div>
                <button
                  onClick={() => setConnectionError(null)}
                  className="mt-2 text-[10px] font-bold underline hover:text-white"
                >
                  Dismiss error and try again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connecting Loading Indicator */}
        {isConnecting && (
          <div className="mt-6 p-6 rounded-2xl bg-accent-red/5 border border-accent-red/30 flex flex-col items-center justify-center text-center space-y-3">
            <RefreshCw size={28} className="text-accent-red animate-spin" />
            <div>
              <div className="text-sm font-extrabold text-prime">
                Connecting to {walletType ? walletType.toUpperCase() : 'Web3 Provider'}...
              </div>
              <div className="text-xs text-sub mt-1">
                Awaiting EIP-1193 signature approval in your wallet prompt
              </div>
            </div>
          </div>
        )}

        {/* Wallet Provider List Cards */}
        {!isConnecting && (
          <div className="mt-6 space-y-3 relative z-10">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => connectWallet(wallet.id as any)}
                disabled={isConnecting}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border ${wallet.color} hover:scale-[1.01] active:scale-[0.99] transition-all text-left shadow-xs group`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl ${wallet.iconBg} shrink-0`}>
                    {wallet.svg}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-prime">{wallet.name}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider bg-surface/80 border border-border-theme text-prime">
                        {wallet.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-sub mt-0.5 leading-snug">{wallet.description}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-sub group-hover:text-accent-red transition-colors shrink-0 ml-2" />
              </button>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-border-theme text-center flex items-center justify-between text-[11px] text-sub font-mono">
          <span className="flex items-center space-x-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>BSC Chain ID 97 / 56</span>
          </span>
          <span className="flex items-center space-x-1">
            <Lock size={12} className="text-accent-red" />
            <span>100% Non-Custodial</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
