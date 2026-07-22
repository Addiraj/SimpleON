import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Download, Filter, Search, ExternalLink, 
  RefreshCw, CheckCircle2, Clock, Sparkles, AlertCircle, Shield, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useWeb3Store } from '../store/useWeb3Store';
import { UiStateSwitcher, LoadingSkeletonTable, EmptyStateView, ErrorStateAlert, SuccessStateBanner } from './StateComponents';

interface Transaction {
  id: string;
  txHash: string;
  type: 'DIRECT_REFERRAL' | 'X5_MATRIX_SPLIT' | 'MATRIX_LEVEL_BONUS' | 'X4_SPILLOVER' | 'AUTO_RE_TOPUP' | 'AUTO_UPGRADE_RESERVE';
  tier: 'STARTER' | 'BUILDER' | 'LEADER' | 'CHAMPION';
  amountUsdt: number;
  fromAddress: string;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING';
  timestamp: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    txHash: '0xa38c7f219b1d309228e57f12e84129b8c0d9a7e6d5c4b3a2109876543210abcd',
    type: 'DIRECT_REFERRAL',
    tier: 'STARTER',
    amountUsdt: 100.00,
    fromAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    status: 'COMPLETED',
    timestamp: '2026-07-22T07:45:12Z'
  },
  {
    id: 'tx-2',
    txHash: '0x9d2b1f8e6a5c4d3b2a109876543210abcdef1234567890abcdef1234567890ab',
    type: 'X5_MATRIX_SPLIT',
    tier: 'STARTER',
    amountUsdt: 15.00,
    fromAddress: '0x3c44CdD05aB5B921a344290145c1102500c1d293',
    status: 'COMPLETED',
    timestamp: '2026-07-22T06:12:00Z'
  },
  {
    id: 'tx-3',
    txHash: '0x7e6d5c4b3a2109876543210abcdef1234567890abcdef1234567890abcdef12',
    type: 'AUTO_RE_TOPUP',
    tier: 'STARTER',
    amountUsdt: 100.00,
    fromAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    status: 'COMPLETED',
    timestamp: '2026-07-21T21:30:15Z'
  },
  {
    id: 'tx-4',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'AUTO_UPGRADE_RESERVE',
    tier: 'BUILDER',
    amountUsdt: 500.00,
    fromAddress: '0x2b55DdE01aB2C831a233190134b1001500d1c121',
    status: 'COMPLETED',
    timestamp: '2026-07-21T18:05:40Z'
  },
  {
    id: 'tx-5',
    txHash: '0x89abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567',
    type: 'MATRIX_LEVEL_BONUS',
    tier: 'BUILDER',
    amountUsdt: 325.00,
    fromAddress: '0x4f11AaB02cC3D941b355390156d1103500e1f342',
    status: 'COMPLETED',
    timestamp: '2026-07-20T14:22:10Z'
  },
  {
    id: 'tx-6',
    txHash: '0x56789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234',
    type: 'X4_SPILLOVER',
    tier: 'STARTER',
    amountUsdt: 20.00,
    fromAddress: '0x9e88FfA03dD4E051c466490178e1104500f1a564',
    status: 'COMPLETED',
    timestamp: '2026-07-19T11:00:00Z'
  }
];

export default function LedgerTransactions() {
  const { address, isConnected, openWalletModal } = useWeb3Store();
  const [uiState, setUiState] = useState<'loaded' | 'loading' | 'empty' | 'error' | 'success'>('loaded');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('156.00');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const filteredTxs = mockTransactions.filter(tx => {
    const matchesSearch = tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.fromAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawSuccess(true);
      setIsWithdrawModalOpen(false);
    }, 1500);
  };

  const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div id="ledger-wrapper" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Title & Header */}
      <div id="ledger-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border-theme pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-accent-red font-bold mb-1">
            <Wallet size={16} />
            <span>Real-time On-Chain Accounting</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-prime">
            Wallet Ledger & Earnings
          </h1>
          <p className="text-sm text-sub mt-1">
            Auditable transaction logs for direct commissions, matrix splits, auto re-topup reserves, and payout disbursements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-accent-red text-white text-xs font-bold hover:bg-accent-red/90 transition-all flex items-center space-x-2 shadow-lg shadow-accent-red/25"
          >
            <ArrowUpRight size={16} />
            <span>Withdraw USDT</span>
          </button>
        </div>
      </div>

      {/* Inspector UI State Switcher Bar */}
      <UiStateSwitcher currentState={uiState} onStateChange={setUiState} />

      {/* Quick Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-surface border border-border-theme glass-panel">
          <div className="flex justify-between items-center text-sub text-xs mb-2">
            <span>Available Balance</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wallet size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-prime">$156.00 <span className="text-xs text-sub font-medium">USDT</span></div>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1">Available for immediate withdrawal</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border-theme glass-panel">
          <div className="flex justify-between items-center text-sub text-xs mb-2">
            <span>Auto Upgrade Reserve</span>
            <div className="p-2 rounded-xl bg-accent-blue/10 text-accent-blue">
              <Shield size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-prime">$500.00 <span className="text-xs text-sub font-medium">USDT</span></div>
          <p className="text-[11px] text-sub font-medium mt-1">Reserved for Builder Tier upgrade</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border-theme glass-panel">
          <div className="flex justify-between items-center text-sub text-xs mb-2">
            <span>Total Earnings</span>
            <div className="p-2 rounded-xl bg-accent-purple/10 text-accent-purple">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-prime">$1,090.00 <span className="text-xs text-sub font-medium">USDT</span></div>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1">+18.5% this week</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border-theme glass-panel">
          <div className="flex justify-between items-center text-sub text-xs mb-2">
            <span>Network Gas Saved</span>
            <div className="p-2 rounded-xl bg-accent-orange/10 text-accent-orange">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-prime">~$42.50 <span className="text-xs text-sub font-medium">BNB</span></div>
          <p className="text-[11px] text-sub font-medium mt-1">Batch smart contract processing</p>
        </div>
      </div>

      {/* Main Ledger Section based on UI State */}
      {uiState === 'loading' && <LoadingSkeletonTable />}

      {uiState === 'error' && (
        <ErrorStateAlert 
          title="Failed to Sync BSC Node Ledger" 
          message="The BNB Smart Chain JSON-RPC endpoint timed out while querying contract event logs for wallet address 0x71C7...976F. Please check network connection and try again."
          onRetry={() => setUiState('loaded')}
        />
      )}

      {withdrawSuccess && (
        <SuccessStateBanner
          title="USDT Withdrawal Dispatched!"
          message="Your transaction has been submitted to BNB Smart Chain. Hash: 0x9f88...341e. Funds will arrive in your wallet within 1-2 block confirmations."
          onDismiss={() => setWithdrawSuccess(false)}
        />
      )}

      {(uiState === 'loaded' || uiState === 'success') && (
        <div className="p-6 rounded-2xl bg-surface border border-border-theme">
          
          {/* Controls: Search, Filter, Export */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sub" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Tx Hash or Address..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-elevated border border-border-theme text-xs text-prime focus:outline-none focus:border-accent-red transition-all"
              />
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="px-3 py-2 pr-8 rounded-xl bg-surface-elevated border border-border-theme text-xs font-semibold text-prime appearance-none focus:outline-none focus:border-accent-red cursor-pointer"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="DIRECT_REFERRAL">Direct Referral</option>
                  <option value="X5_MATRIX_SPLIT">X5 Matrix Split (15%)</option>
                  <option value="MATRIX_LEVEL_BONUS">13-Level Matrix (65%)</option>
                  <option value="X4_SPILLOVER">X4 Spillover (20%)</option>
                  <option value="AUTO_RE_TOPUP">Auto Re-Topup</option>
                  <option value="AUTO_UPGRADE_RESERVE">Auto Upgrade Reserve</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sub pointer-events-none" size={14} />
              </div>

              <button
                onClick={() => alert("Exporting Ledger CSV...")}
                className="px-3 py-2 rounded-xl bg-surface-elevated border border-border-theme text-xs font-bold text-prime hover:bg-border-theme transition-all flex items-center space-x-1.5 shrink-0"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table View */}
          {filteredTxs.length === 0 ? (
            <EmptyStateView
              title="No Matching Ledger Records"
              description="No on-chain transactions match your current search query or event filter. Try resetting your filter settings."
              actionText="Reset Filters"
              onAction={() => { setSearchQuery(''); setTypeFilter('ALL'); }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-theme text-sub uppercase font-mono tracking-wider">
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">From Wallet</th>
                    <th className="py-3 px-4">Tx Hash</th>
                    <th className="py-3 px-4 text-right">Amount (USDT)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-theme/50">
                  {filteredTxs.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-prime">
                        <span className="inline-flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            tx.type === 'DIRECT_REFERRAL' ? 'bg-emerald-500' :
                            tx.type === 'AUTO_UPGRADE_RESERVE' ? 'bg-accent-blue' :
                            tx.type === 'AUTO_RE_TOPUP' ? 'bg-accent-orange' : 'bg-accent-purple'
                          }`}></span>
                          <span>{tx.type.replace(/_/g, ' ')}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-surface-elevated border border-border-theme text-sub">
                          {tx.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-sub">
                        {formatAddress(tx.fromAddress)}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <a
                          href={`https://testnet.bscscan.com/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-red hover:underline inline-flex items-center space-x-1"
                        >
                          <span>{formatAddress(tx.txHash)}</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-500">
                        +${tx.amountUsdt.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 inline-flex items-center space-x-1">
                          <CheckCircle2 size={12} />
                          <span>{tx.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-sub text-[11px] font-mono">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Empty State Inspector Trigger */}
      {uiState === 'empty' && (
        <EmptyStateView
          title="No Transaction History Found"
          description="You have not subscribed to any Booster Plan or generated matrix referral income yet. Subscribe to Starter Plan ($100) to start earning immediately."
          actionText="Explore Booster Plans"
          onAction={() => alert("Redirecting to Booster Plans...")}
        />
      )}

      {/* Withdraw Modal */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-surface border border-border-theme p-6 shadow-2xl relative"
            >
              <h3 className="text-xl font-extrabold text-prime mb-1">Withdraw USDT Earnings</h3>
              <p className="text-xs text-sub mb-6">Direct instant transfer to connected BSC wallet via smart contract payout queue.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-sub font-bold mb-1">Destination Address</label>
                  <input
                    type="text"
                    readOnly
                    value={address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-theme font-mono text-xs text-sub cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-sub font-bold mb-1">Withdrawal Amount (USDT)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      className="w-full pl-3 pr-16 py-2.5 rounded-xl bg-surface-elevated border border-border-theme text-base font-bold text-prime focus:outline-none focus:border-accent-red"
                    />
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount('156.00')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-accent-red/10 text-accent-red text-xs font-bold"
                    >
                      MAX
                    </button>
                  </div>
                  <span className="text-[11px] text-sub mt-1 block">Available: $156.00 USDT</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-elevated border border-border-theme text-xs space-y-1.5 text-sub">
                  <div className="flex justify-between">
                    <span>Network Fee (BSC Gas):</span>
                    <span className="font-mono text-prime font-bold">~$0.12 BNB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Processing Time:</span>
                    <span className="font-mono text-emerald-500 font-bold">&lt; 3 Seconds</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="flex-1 py-2.5 rounded-full border border-border-theme text-xs font-bold text-sub hover:text-prime transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isWithdrawing}
                    onClick={handleWithdraw}
                    className="flex-1 py-2.5 rounded-full bg-accent-red text-white text-xs font-bold hover:bg-accent-red/90 transition-all flex items-center justify-center space-x-2"
                  >
                    {isWithdrawing ? (
                      <>
                        <RefreshCw className="animate-spin" size={14} />
                        <span>Signing Tx...</span>
                      </>
                    ) : (
                      <span>Confirm Payout</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
