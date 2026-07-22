import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, Type, Sliders, Layers, CheckSquare, Sparkles, ShieldCheck, 
  AlertOctagon, AlertTriangle, CheckCircle2, RefreshCw, Inbox, ArrowRight, 
  Search, Bell, User, Wallet, Lock, Copy, Check, ExternalLink, Flame
} from 'lucide-react';
import { LoadingSkeletonCard, LoadingSkeletonTable, EmptyStateView, ErrorStateAlert, SuccessStateBanner } from './StateComponents';
import { useWeb3Store } from '../store/useWeb3Store';

export default function DesignSystemShowcase() {
  const { openWalletModal, toggleNotificationCenter } = useWeb3Store();

  const [activeTab, setActiveTab] = useState<'COMPONENTS' | 'TOKENS' | 'SYSTEM_STATES' | 'SPECIAL_PAGES'>('COMPONENTS');
  const [toggleState, setToggleState] = useState(true);
  const [inputText, setInputText] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [rangeVal, setRangeVal] = useState(4.0);
  const [copied, setCopied] = useState(false);

  // For System States tab
  const [demoState, setDemoState] = useState<'SKELETON' | 'EMPTY' | 'ERROR' | 'SUCCESS'>('SKELETON');
  
  // For Special Pages tab
  const [demoPage, setDemoPage] = useState<'404' | 'MAINTENANCE'>('404');

  const copyText = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-surface border border-border-theme p-8 shadow-xl relative overflow-hidden glass-panel">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent-red/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-accent-red/10 px-3.5 py-1 text-xs font-bold text-accent-red border border-accent-red/20">
              <Sparkles size={14} />
              <span>Enterprise Design System & Component Spec</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-prime tracking-tight">
              Design System & <span className="text-accent-red">UI Architecture</span>
            </h1>
            <p className="text-xs sm:text-sm text-sub max-w-2xl leading-relaxed">
              Standardized design tokens, accessible components, atomic layout cards, dark/light mode CSS variables, and error/empty states crafted for SimpleOn.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={openWalletModal}
              className="px-5 py-3 rounded-2xl bg-surface-elevated border border-border-theme text-prime text-xs font-bold hover:bg-surface transition-all flex items-center space-x-2 shadow-sm"
            >
              <Wallet size={16} />
              <span>Launch Wallet Modal</span>
            </button>
            <button
              onClick={toggleNotificationCenter}
              className="px-5 py-3 rounded-2xl bg-accent-red text-white text-xs font-black shadow-md hover:bg-accent-red/90 transition-all flex items-center space-x-2"
            >
              <Bell size={16} />
              <span>Trigger Drawer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Section Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-border-theme">
        <button
          onClick={() => setActiveTab('COMPONENTS')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'COMPONENTS' ? 'bg-accent-red text-white shadow-md' : 'bg-surface-elevated text-sub hover:text-prime'
          }`}
        >
          <Layers size={14} />
          <span>UI Components Library</span>
        </button>

        <button
          onClick={() => setActiveTab('TOKENS')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'TOKENS' ? 'bg-accent-red text-white shadow-md' : 'bg-surface-elevated text-sub hover:text-prime'
          }`}
        >
          <Palette size={14} />
          <span>Design Tokens & Colors</span>
        </button>

        <button
          onClick={() => setActiveTab('SYSTEM_STATES')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'SYSTEM_STATES' ? 'bg-accent-red text-white shadow-md' : 'bg-surface-elevated text-sub hover:text-prime'
          }`}
        >
          <AlertTriangle size={14} />
          <span>State Handler Feedback</span>
        </button>

        <button
          onClick={() => setActiveTab('SPECIAL_PAGES')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'SPECIAL_PAGES' ? 'bg-accent-red text-white shadow-md' : 'bg-surface-elevated text-sub hover:text-prime'
          }`}
        >
          <AlertOctagon size={14} />
          <span>404 & Maintenance Views</span>
        </button>
      </div>

      {/* TAB 1: UI COMPONENTS */}
      {activeTab === 'COMPONENTS' && (
        <div className="space-y-10">
          
          {/* Buttons Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-theme shadow-xl space-y-6">
            <h2 className="text-base font-black text-prime font-mono uppercase flex items-center space-x-2">
              <Sliders size={18} className="text-accent-red" />
              <span>Button Variants</span>
            </h2>

            <div className="flex flex-wrap items-center gap-4">
              <button className="px-6 py-3 rounded-2xl bg-accent-red text-white text-xs font-black shadow-lg shadow-accent-red/20 hover:bg-accent-red/90 transition-all">
                Primary Action
              </button>

              <button className="px-6 py-3 rounded-2xl bg-surface-elevated border border-border-theme text-prime text-xs font-bold hover:bg-surface transition-all">
                Secondary Outlined
              </button>

              <button className="px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all">
                Success Pill
              </button>

              <button className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all">
                Warning Highlight
              </button>

              <button disabled className="px-6 py-3 rounded-2xl bg-border-theme text-sub text-xs font-bold cursor-not-allowed">
                Disabled State
              </button>

              <button className="p-3 rounded-2xl bg-surface-elevated border border-border-theme text-prime hover:text-accent-red transition-all">
                <Flame size={18} />
              </button>
            </div>
          </div>

          {/* Form Inputs & Controls */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-theme shadow-xl space-y-6">
            <h2 className="text-base font-black text-prime font-mono uppercase">Form Controls & Inputs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Text Input with Icon */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-sub block">Text / Wallet Input</label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 rounded-2xl bg-surface-elevated border border-border-theme text-prime text-xs font-mono font-bold focus:outline-none focus:border-accent-red"
                  />
                  <button onClick={copyText} className="absolute right-3 top-1/2 -translate-y-1/2 text-sub hover:text-prime">
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Dropdown Select */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-sub block">Dropdown Select</label>
                <select className="w-full px-4 py-3 rounded-2xl bg-surface-elevated border border-border-theme text-prime text-xs font-mono font-bold focus:outline-none focus:border-accent-red">
                  <option>Starter Booster Tier ($1.00 USDT)</option>
                  <option>Builder Booster Tier ($4.00 USDT)</option>
                  <option>Leader Booster Tier ($16.00 USDT)</option>
                  <option>Champion Booster Tier ($64.00 USDT)</option>
                </select>
              </div>

              {/* Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-sub">Booster Multiplier</span>
                  <span className="text-accent-red">${rangeVal.toFixed(2)} USDT</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={rangeVal}
                  onChange={(e) => setRangeVal(parseFloat(e.target.value))}
                  className="w-full accent-accent-red"
                />
              </div>

              {/* Checkbox & Switch Toggle */}
              <div className="flex items-center space-x-6 pt-4">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-prime font-mono">
                  <input type="checkbox" checked={toggleState} onChange={() => setToggleState(!toggleState)} className="w-4 h-4 accent-accent-red" />
                  <span>Enable Auto-Compounding</span>
                </label>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-sub">Notifications</span>
                  <button
                    onClick={() => setToggleState(!toggleState)}
                    className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${toggleState ? 'bg-emerald-500 justify-end' : 'bg-border-theme justify-start'}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Badges & Chips */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-theme shadow-xl space-y-6">
            <h2 className="text-base font-black text-prime font-mono uppercase">Badges & Status Tags</h2>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono flex items-center space-x-1">
                <CheckCircle2 size={12} />
                <span>Web3 Verified</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-accent-red/10 text-accent-red border border-accent-red/20 text-xs font-bold font-mono">
                X5 Matrix Active
              </span>

              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold font-mono">
                Daily Limit Active
              </span>

              <span className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 text-xs font-bold font-mono">
                5 Direct Referrals
              </span>

              <span className="px-3 py-1 rounded-full bg-surface-elevated text-sub border border-border-theme text-xs font-bold font-mono">
                Standby
              </span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DESIGN TOKENS */}
      {activeTab === 'TOKENS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-theme shadow-xl space-y-8">
          <h2 className="text-base font-black text-prime font-mono uppercase flex items-center space-x-2">
            <Palette size={18} className="text-accent-red" />
            <span>Brand Colors & Semantic CSS Variables</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Red Accent */}
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border-theme space-y-2">
              <div className="h-16 rounded-xl bg-accent-red shadow-md" />
              <div className="text-xs font-mono font-bold text-prime">Accent Red</div>
              <p className="text-[10px] font-mono text-sub">var(--color-accent-red) • #DC2626</p>
            </div>

            {/* Emerald Green */}
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border-theme space-y-2">
              <div className="h-16 rounded-xl bg-emerald-500 shadow-md" />
              <div className="text-xs font-mono font-bold text-prime">Emerald Green</div>
              <p className="text-[10px] font-mono text-sub">#10B981 • Rewards & Success</p>
            </div>

            {/* Accent Blue */}
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border-theme space-y-2">
              <div className="h-16 rounded-xl bg-accent-blue shadow-md" />
              <div className="text-xs font-mono font-bold text-prime">Accent Blue</div>
              <p className="text-[10px] font-mono text-sub">var(--color-accent-blue) • #2563EB</p>
            </div>

            {/* Amber Gold */}
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border-theme space-y-2">
              <div className="h-16 rounded-xl bg-amber-500 shadow-md" />
              <div className="text-xs font-mono font-bold text-prime">Amber Gold</div>
              <p className="text-[10px] font-mono text-sub">#F59E0B • Capping & Tier Alerts</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM STATES */}
      {activeTab === 'SYSTEM_STATES' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 pb-4">
            <button
              onClick={() => setDemoState('SKELETON')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${demoState === 'SKELETON' ? 'bg-accent-red text-white' : 'bg-surface-elevated text-sub'}`}
            >
              Loading Skeleton
            </button>
            <button
              onClick={() => setDemoState('EMPTY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${demoState === 'EMPTY' ? 'bg-accent-red text-white' : 'bg-surface-elevated text-sub'}`}
            >
              Empty State
            </button>
            <button
              onClick={() => setDemoState('ERROR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${demoState === 'ERROR' ? 'bg-accent-red text-white' : 'bg-surface-elevated text-sub'}`}
            >
              Error Alert
            </button>
            <button
              onClick={() => setDemoState('SUCCESS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${demoState === 'SUCCESS' ? 'bg-accent-red text-white' : 'bg-surface-elevated text-sub'}`}
            >
              Success Banner
            </button>
          </div>

          {demoState === 'SKELETON' && (
            <div className="space-y-6">
              <LoadingSkeletonCard />
              <LoadingSkeletonTable />
            </div>
          )}

          {demoState === 'EMPTY' && (
            <EmptyStateView
              title="No Active Matrix Cycles Found"
              description="You have not activated an X5 Matrix Tier yet. Choose a plan to participate in automated team spillovers."
              actionText="Explore Plans"
              onAction={() => alert('Navigating to plans')}
            />
          )}

          {demoState === 'ERROR' && (
            <ErrorStateAlert
              title="BNB Smart Chain RPC Timeout"
              message="Failed to fetch current gas prices from node endpoint. Retrying via backup RPC provider..."
              onRetry={() => alert('Retrying RPC connection')}
            />
          )}

          {demoState === 'SUCCESS' && (
            <SuccessStateBanner
              title="Matrix Reward Distribution Executed"
              message="+80.00 USDT successfully credited to your connected Web3 address."
            />
          )}
        </div>
      )}

      {/* TAB 4: SPECIAL SYSTEM PAGES */}
      {activeTab === 'SPECIAL_PAGES' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 pb-4">
            <button
              onClick={() => setDemoPage('404')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${demoPage === '404' ? 'bg-accent-red text-white' : 'bg-surface-elevated text-sub'}`}
            >
              404 Page View
            </button>
            <button
              onClick={() => setDemoPage('MAINTENANCE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${demoPage === 'MAINTENANCE' ? 'bg-accent-red text-white' : 'bg-surface-elevated text-sub'}`}
            >
              Maintenance Mode View
            </button>
          </div>

          {demoPage === '404' ? (
            <div className="p-12 rounded-3xl bg-surface border border-border-theme text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
              <div className="text-8xl font-black font-mono text-accent-red tracking-tight">404</div>
              <h2 className="text-2xl font-black text-prime">Smart Contract Page Not Found</h2>
              <p className="text-xs text-sub leading-relaxed">
                The matrix page or block index you requested does not exist on this chain branch.
              </p>
              <button onClick={() => setActiveTab('COMPONENTS')} className="px-6 py-3 rounded-2xl bg-accent-red text-white font-bold text-xs">
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-surface border border-amber-500/30 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
              <div className="p-4 rounded-full bg-amber-500/10 text-amber-500 w-16 h-16 mx-auto flex items-center justify-center">
                <AlertOctagon size={32} />
              </div>
              <h2 className="text-2xl font-black text-prime">Scheduled Smart Contract Upgrade</h2>
              <p className="text-xs text-sub leading-relaxed">
                The SimpleOn protocol is currently undergoing a non-custodial contract audit upgrade on BNB Smart Chain. All funds remain 100% safe on-chain.
              </p>
              <span className="inline-block px-4 py-1.5 rounded-full bg-surface-elevated text-amber-500 text-xs font-mono font-bold border border-border-theme">
                Estimated Time Remaining: 24 mins
              </span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
