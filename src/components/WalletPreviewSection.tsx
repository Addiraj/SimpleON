import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ShieldCheck, Check, ArrowRight, ExternalLink, Key, RefreshCw } from 'lucide-react';
import { useWeb3Store } from '../store/useWeb3Store';

export default function WalletPreviewSection() {
  const { isConnected, address, chainId, openWalletModal, disconnectWallet } = useWeb3Store();
  const [activeTab, setActiveTab] = useState<'metamask' | 'trust' | 'binance'>('metamask');

  const formatAddr = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <section id="wallet-connection-preview-section" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full bg-accent-purple/10 px-3.5 py-1.5 text-xs font-bold text-accent-purple border border-accent-purple/20 mb-3">
            <Key size={14} />
            <span>Web3 Self-Custody First</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-prime sm:text-4xl lg:text-5xl">
            Non-Custodial <span className="text-accent-red">Wallet Connection</span>
          </h2>
          <p className="mt-4 text-base text-sub leading-relaxed">
            Connect directly using standard EVM providers. SIWE (Sign-In with Ethereum / EIP-4361) verifies your identity without revealing private keys.
          </p>
        </div>

        {/* Interactive Wallet Connection Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-surface border border-border-theme p-6 sm:p-10 shadow-xl relative overflow-hidden glass-panel">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Supported Provider Tabs */}
            <div className="md:col-span-5 space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-sub tracking-wider font-mono">Supported Web3 Wallets</h3>
              
              <div className="space-y-2">
                {[
                  { id: 'metamask', name: 'MetaMask Wallet', desc: 'Browser Extension & Mobile App', badge: 'Recommended' },
                  { id: 'trust', name: 'Trust Wallet', desc: 'Mobile Web3 & dApp Browser', badge: 'EVM Ready' },
                  { id: 'binance', name: 'Binance Web3 Wallet', desc: 'Direct BNB Smart Chain Integration', badge: 'BSC Optimized' },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setActiveTab(w.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      activeTab === w.id
                        ? 'border-accent-red bg-accent-red/5 shadow-sm'
                        : 'border-border-theme bg-surface-elevated/50 hover:bg-surface-elevated'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-prime">{w.name}</div>
                      <div className="text-[11px] text-sub mt-0.5">{w.desc}</div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-surface border border-border-theme text-accent-red">
                      {w.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Col: Connection Status & Interactive Trigger */}
            <div className="md:col-span-7 p-6 rounded-2xl bg-surface-elevated border border-border-theme space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border-theme">
                <div>
                  <div className="text-xs font-mono uppercase text-sub font-bold">Network RPC Status</div>
                  <div className="text-sm font-extrabold text-prime flex items-center space-x-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>BNB Smart Chain (BSC Testnet ID 97)</span>
                  </div>
                </div>
                <ShieldCheck size={20} className="text-emerald-500" />
              </div>

              {/* Status Display */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-surface border border-border-theme/60">
                  <span className="text-sub">Connection Mode:</span>
                  <span className="text-prime font-bold">In-Browser EIP-1193 Provider</span>
                </div>

                <div className="flex justify-between p-3 rounded-xl bg-surface border border-border-theme/60">
                  <span className="text-sub">Connected Account:</span>
                  <span className="text-accent-red font-bold">
                    {isConnected && address ? formatAddr(address) : '0x71C7...976F (Preview)'}
                  </span>
                </div>

                <div className="flex justify-between p-3 rounded-xl bg-surface border border-border-theme/60">
                  <span className="text-sub">BEP-20 USDT Approval:</span>
                  <span className="text-emerald-500 font-bold">Unlimited Smart Contract Permitted</span>
                </div>
              </div>

              {/* Connect Button */}
              <div className="pt-2">
                {isConnected ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={disconnectWallet}
                      className="flex-1 py-3 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-accent-red text-xs font-bold hover:bg-red-500/20 transition-all"
                    >
                      Disconnect Wallet
                    </button>
                    <a
                      href={`https://testnet.bscscan.com/address/${address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-surface border border-border-theme text-sub hover:text-prime transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={openWalletModal}
                    className="w-full py-3.5 px-6 rounded-xl bg-accent-red text-white text-xs font-extrabold hover:bg-accent-red/90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-accent-red/25"
                  >
                    <Wallet size={16} />
                    <span>Connect Web3 Wallet Now</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
