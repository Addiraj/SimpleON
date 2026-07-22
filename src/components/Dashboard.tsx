import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, Trophy, Users, TrendingUp, ShieldCheck, Copy, Check, ExternalLink, 
  ArrowUpRight, Zap, RefreshCw, BarChart2, PieChart, Activity, Sliders, ChevronRight, 
  Sparkles, Search, Bell, Sun, Moon, Menu, X, Clock, ArrowDownLeft, Share2, DollarSign,
  Layers, Award, Download, UserCheck, Flame, Filter, CheckCircle2, ChevronDown, User, LogOut
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, Legend 
} from 'recharts';
import { useWeb3Store } from '../store/useWeb3Store';
import { UiStateSwitcher, LoadingSkeletonCard, LoadingSkeletonTable, EmptyStateView, ErrorStateAlert, SuccessStateBanner } from './StateComponents';

// Mock Analytics Data
const earningsTrendData = [
  { day: 'Jul 1', earnings: 120, referrals: 1 },
  { day: 'Jul 5', earnings: 280, referrals: 2 },
  { day: 'Jul 10', earnings: 450, referrals: 3 },
  { day: 'Jul 15', earnings: 720, referrals: 5 },
  { day: 'Jul 20', earnings: 980, referrals: 7 },
  { day: 'Jul 22', earnings: 1245, referrals: 9 },
];

const revenueDistributionData = [
  { name: 'Direct Sponsor (20%)', value: 249, color: '#10B981' },
  { name: '13-Level Matrix (65%)', value: 809, color: '#3B82F6' },
  { name: 'X5 Matrix Split (15%)', value: 187, color: '#F59E0B' },
  { name: 'X4 Passive Spillover', value: 150, color: '#8B5CF6' },
];

const monthlyVolumeData = [
  { month: 'Mar', volume: 1200, rewards: 240 },
  { month: 'Apr', volume: 2400, rewards: 480 },
  { month: 'May', volume: 4800, rewards: 960 },
  { month: 'Jun', volume: 8500, rewards: 1700 },
  { month: 'Jul', volume: 12450, rewards: 2490 },
];

// Mock Transactions List
const initialTransactions = [
  { id: 'tx-101', type: 'Direct Commission', amount: '+$20.00 USDT', status: 'Completed', txHash: '0x9a8f...3e21', time: '10 mins ago', category: 'Commission' },
  { id: 'tx-102', type: '13-Level Matrix Spillover', amount: '+$65.00 USDT', status: 'Completed', txHash: '0x8b7e...4f12', time: '45 mins ago', category: 'Matrix' },
  { id: 'tx-103', type: 'Starter Plan Upgrade', amount: '-$100.00 USDT', status: 'Completed', txHash: '0x7c6d...5a09', time: '2 hours ago', category: 'Deposit' },
  { id: 'tx-104', type: 'Auto Re-Topup Trigger', amount: '-$50.00 USDT', status: 'Completed', txHash: '0x6d5c...6b88', time: '5 hours ago', category: 'Auto' },
  { id: 'tx-105', type: 'X5 Split Pool Reward', amount: '+$15.00 USDT', status: 'Completed', txHash: '0x5e4d...7c77', time: '1 day ago', category: 'Pool' },
];

// Mock Notifications
const initialNotifications = [
  { id: 'n1', title: 'New Direct Referral', description: 'Partner 0x8f3C...A063 joined using your link.', time: '5m ago', read: false },
  { id: 'n2', title: 'Matrix Spillover Received', description: 'Credited +$65.00 USDT from 13-Level Team Tree.', time: '1h ago', read: false },
  { id: 'n3', title: 'Booster 80% Milestones', description: 'You are 1 referral away from Cycle #3 completion.', time: '3h ago', read: false },
  { id: 'n4', title: 'Smart Contract Audit', description: 'BscScan verified 100% non-custodial SIWE login.', time: '1d ago', read: true },
];

export default function Dashboard() {
  const { 
    userProfile, address, chainId, basePlan, setBasePlan, calculations, 
    upgradeTier, bnbBalance, usdtBalance, openWalletModal, disconnectWallet 
  } = useWeb3Store();

  const [uiState, setUiState] = useState<'loaded' | 'loading' | 'empty' | 'error' | 'success'>('loaded');
  const [copied, setCopied] = useState(false);
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);

  // Dashboard Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'overview' | 'transactions' | 'rewards' | 'quickActions'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [txFilter, setTxFilter] = useState<'All' | 'Commission' | 'Matrix' | 'Deposit'>('All');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const formattedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '0x71C7...976F';
  const referralLink = address ? `${window.location.origin}/?ref=${address}` : 'https://simpleon.io/?ref=0x71C7...976F';

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpgrade = async (tier: string) => {
    setUpgradingTier(tier);
    await upgradeTier(tier);
    setUpgradingTier(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    const root = document.documentElement;
    if (!isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredTransactions = initialTransactions.filter(tx => {
    const matchesFilter = txFilter === 'All' || tx.category === txFilter;
    const matchesSearch = tx.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.amount.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="dashboard-root" className="min-h-screen bg-page text-prime font-sans">
      
      {/* 1. Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-border-theme px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
        
        {/* Left: Sidebar Toggle & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-surface-elevated text-sub hover:text-prime border border-border-theme transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-accent-red/10 text-accent-red flex items-center justify-center border border-accent-red/20">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-prime flex items-center space-x-2">
                <span>Executive Dashboard</span>
                <span className="text-[9px] font-mono font-bold bg-accent-red/10 text-accent-red px-2 py-0.5 rounded-full border border-accent-red/20">
                  LIVE BSC
                </span>
              </div>
              <p className="text-[10px] text-sub font-mono hidden sm:block">SimpleOn Income Engine v2.4</p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
            <input
              type="text"
              placeholder="Search tx hashes, team partners, rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-elevated border border-border-theme text-xs text-prime placeholder-sub focus:outline-none focus:border-accent-red transition-all"
            />
          </div>
        </div>

        {/* Right Controls: Notifications, Dark Mode, Profile Menu */}
        <div className="flex items-center space-x-3">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-2xl bg-surface-elevated border border-border-theme text-sub hover:text-prime transition-all"
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* Notification Popover Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationPopover(!showNotificationPopover)}
              className="p-2.5 rounded-2xl bg-surface-elevated border border-border-theme text-sub hover:text-prime transition-all relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-red text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            <AnimatePresence>
              {showNotificationPopover && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border-theme rounded-3xl p-5 shadow-2xl z-50 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border-theme">
                    <div className="flex items-center space-x-2">
                      <Bell size={16} className="text-accent-red" />
                      <span className="text-sm font-extrabold text-prime">Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-accent-red font-bold hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-2xl border text-xs transition-all ${
                          n.read
                            ? 'bg-surface-elevated/40 border-border-theme/60 text-sub'
                            : 'bg-accent-red/5 border-accent-red/20 text-prime font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{n.title}</span>
                          <span className="text-[10px] text-sub font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-sub mt-1 leading-snug">{n.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2.5 p-1.5 pl-3 pr-2 rounded-2xl bg-surface-elevated border border-border-theme hover:border-accent-red/40 transition-all"
            >
              <div className="w-7 h-7 rounded-xl bg-accent-red/10 text-accent-red font-mono text-xs font-bold flex items-center justify-center">
                0x
              </div>
              <span className="text-xs font-mono font-bold text-prime hidden sm:inline">{formattedAddress}</span>
              <ChevronDown size={14} className="text-sub" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-surface border border-border-theme rounded-3xl p-5 shadow-2xl z-50 space-y-4"
                >
                  <div className="pb-3 border-b border-border-theme space-y-1">
                    <div className="text-xs font-mono font-extrabold text-prime break-all">{address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}</div>
                    <div className="text-[10px] text-emerald-500 font-bold flex items-center space-x-1">
                      <ShieldCheck size={12} />
                      <span>SIWE Session Authenticated</span>
                    </div>
                  </div>

                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between p-2 rounded-xl bg-surface-elevated">
                      <span className="text-sub">BNB Balance:</span>
                      <span className="font-bold text-prime">{bnbBalance} BNB</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-surface-elevated">
                      <span className="text-sub">USDT Balance:</span>
                      <span className="font-bold text-emerald-500">${usdtBalance} USDT</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={copyReferral}
                      className="w-full py-2 px-3 rounded-xl bg-surface-elevated hover:bg-surface border border-border-theme text-xs font-bold text-prime flex items-center justify-between"
                    >
                      <span>{copied ? 'Copied Link!' : 'Copy Referral'}</span>
                      <Copy size={14} />
                    </button>

                    <button
                      onClick={() => {
                        disconnectWallet();
                        setShowProfileDropdown(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold flex items-center justify-between"
                    >
                      <span>Disconnect</span>
                      <LogOut size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* Main Layout Grid with Responsive Sidebar */}
      <div className="flex max-w-7xl mx-auto">
        
        {/* Responsive Sidebar Navigation */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-surface border-r border-border-theme transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static transition-transform duration-300 p-6 flex flex-col justify-between`}>
          
          <div className="space-y-6">
            <div className="text-xs font-mono font-bold text-sub uppercase tracking-wider px-2">
              Dashboard Views
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => { setActiveSidebarTab('overview'); setIsSidebarOpen(false); }}
                className={`w-full p-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all ${
                  activeSidebarTab === 'overview'
                    ? 'bg-accent-red text-white shadow-lg shadow-accent-red/20'
                    : 'text-sub hover:bg-surface-elevated hover:text-prime'
                }`}
              >
                <Activity size={18} />
                <span>Overview & Stats</span>
              </button>

              <button
                onClick={() => { setActiveSidebarTab('transactions'); setIsSidebarOpen(false); }}
                className={`w-full p-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all ${
                  activeSidebarTab === 'transactions'
                    ? 'bg-accent-red text-white shadow-lg shadow-accent-red/20'
                    : 'text-sub hover:bg-surface-elevated hover:text-prime'
                }`}
              >
                <Clock size={18} />
                <span>Recent Transactions</span>
              </button>

              <button
                onClick={() => { setActiveSidebarTab('rewards'); setIsSidebarOpen(false); }}
                className={`w-full p-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all ${
                  activeSidebarTab === 'rewards'
                    ? 'bg-accent-red text-white shadow-lg shadow-accent-red/20'
                    : 'text-sub hover:bg-surface-elevated hover:text-prime'
                }`}
              >
                <Award size={18} />
                <span>Recent Rewards</span>
              </button>

              <button
                onClick={() => { setActiveSidebarTab('quickActions'); setIsSidebarOpen(false); }}
                className={`w-full p-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all ${
                  activeSidebarTab === 'quickActions'
                    ? 'bg-accent-red text-white shadow-lg shadow-accent-red/20'
                    : 'text-sub hover:bg-surface-elevated hover:text-prime'
                }`}
              >
                <Zap size={18} />
                <span>Quick Actions</span>
              </button>
            </nav>
          </div>

          {/* Quick Wallet Status Widget inside Sidebar */}
          <div className="p-4 rounded-2xl bg-surface-elevated border border-border-theme space-y-2">
            <div className="text-[10px] font-mono text-sub uppercase font-bold">Smart Contract Active</div>
            <div className="text-xs font-extrabold text-prime font-mono truncate">{address || '0x71C7...976F'}</div>
            <div className="text-[11px] text-emerald-500 font-bold flex items-center space-x-1">
              <CheckCircle2 size={12} />
              <span>BSC Chain 97 Connected</span>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden">
          
          {/* State Switcher bar for debugging/demo */}
          <UiStateSwitcher currentState={uiState} onStateChange={setUiState} />

          {/* Conditional Skeleton Loader */}
          {uiState === 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <LoadingSkeletonCard />
              <LoadingSkeletonCard />
              <LoadingSkeletonCard />
              <LoadingSkeletonCard />
            </div>
          )}

          {/* Conditional Error View */}
          {uiState === 'error' && (
            <ErrorStateAlert
              title="Dashboard Data Sync Error"
              message="Failed to index live BSC node events. Please retry fetching on-chain statistics."
              onRetry={() => setUiState('loaded')}
            />
          )}

          {/* Conditional Success Banner */}
          {uiState === 'success' && (
            <SuccessStateBanner
              title="Starter Booster Activated!"
              message="$100.00 USDT allocated to Starter Node on BNB Smart Chain block #41209381."
            />
          )}

          {/* MAIN LOADED CONTENT */}
          {(uiState === 'loaded' || uiState === 'success') && (
            <>
              {/* 2. TOP STATISTICS GRID (8 Mandatory KPIs) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-prime flex items-center space-x-2">
                    <Trophy size={18} className="text-accent-red" />
                    <span>Top Executive Statistics</span>
                  </h2>
                  <span className="text-xs font-mono text-sub">Updated 2s ago</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* KPI 1: Total Income */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-3xl bg-surface border border-border-theme shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sub mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Total Income</span>
                      <DollarSign size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black font-mono text-prime">$1,245.00 USDT</div>
                    <p className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center space-x-1">
                      <TrendingUp size={12} />
                      <span>+18.4% total yield</span>
                    </p>
                  </motion.div>

                  {/* KPI 2: Today's Income */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-3xl bg-surface border border-border-theme shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sub mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Today's Income</span>
                      <Flame size={16} className="text-accent-orange" />
                    </div>
                    <div className="text-2xl font-black font-mono text-accent-orange">$120.00 USDT</div>
                    <p className="text-[11px] text-sub mt-1">3 new referral triggers</p>
                  </motion.div>

                  {/* KPI 3: Wallet Balance */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-3xl bg-surface border border-border-theme shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sub mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Wallet Balance</span>
                      <Wallet size={16} className="text-accent-blue" />
                    </div>
                    <div className="text-2xl font-black font-mono text-prime">${usdtBalance} USDT</div>
                    <p className="text-[11px] text-sub font-mono mt-1">{bnbBalance} BNB Reserve</p>
                  </motion.div>

                  {/* KPI 4: Active Cycle */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-3xl bg-surface border border-border-theme shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sub mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Active Cycle</span>
                      <RefreshCw size={16} className="text-accent-purple" />
                    </div>
                    <div className="text-2xl font-black font-mono text-prime">Cycle #3</div>
                    <p className="text-[11px] text-sub mt-1">4 / 5 Slots Filled</p>
                  </motion.div>

                  {/* KPI 5: Current Plan */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-3xl bg-surface border border-border-theme shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sub mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Current Plan</span>
                      <Zap size={16} className="text-accent-red" />
                    </div>
                    <div className="text-xl font-black font-mono text-accent-red">Starter ($100)</div>
                    <p className="text-[11px] text-sub mt-1">Daily Cap: 5 Cycles/day</p>
                  </motion.div>

                  {/* KPI 6: Total Referrals */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-3xl bg-surface border border-border-theme shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sub mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Total Referrals</span>
                      <Users size={16} className="text-accent-blue" />
                    </div>
                    <div className="text-2xl font-black font-mono text-prime">14 Directs</div>
                    <p className="text-[11px] text-sub mt-1">Team Volume: $14,200</p>
                  </motion.div>

                  {/* KPI 7: Qualified Referrals */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-3xl bg-surface border border-border-theme shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sub mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Qualified Referrals</span>
                      <UserCheck size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black font-mono text-emerald-500">9 Active</div>
                    <p className="text-[11px] text-sub mt-1">64% Qualification Rate</p>
                  </motion.div>

                  {/* KPI 8: Booster Progress */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-3xl bg-surface border border-border-theme shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-sub mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Booster Progress</span>
                      <Sparkles size={16} className="text-amber-500" />
                    </div>
                    <div className="text-2xl font-black font-mono text-prime">80%</div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden mt-2 border border-border-theme">
                      <div className="h-full bg-accent-red rounded-full" style={{ width: '80%' }} />
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* 3. QUICK ACTIONS BAR */}
              <div className="p-6 rounded-3xl bg-surface border border-border-theme space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-prime flex items-center space-x-2">
                    <Zap size={18} className="text-accent-red" />
                    <span>Quick Actions</span>
                  </h3>
                  <span className="text-xs text-sub">Instant Web3 Shortcuts</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={() => handleUpgrade('BUILDER')}
                    className="p-3.5 rounded-2xl bg-surface-elevated hover:bg-accent-red hover:text-white border border-border-theme text-xs font-bold transition-all flex flex-col items-center justify-center space-y-2 group shadow-xs"
                  >
                    <ArrowUpRight size={20} className="text-accent-red group-hover:text-white" />
                    <span>Upgrade Plan</span>
                  </button>

                  <button
                    onClick={copyReferral}
                    className="p-3.5 rounded-2xl bg-surface-elevated hover:bg-accent-red hover:text-white border border-border-theme text-xs font-bold transition-all flex flex-col items-center justify-center space-y-2 group shadow-xs"
                  >
                    {copied ? <Check size={20} className="text-emerald-500 group-hover:text-white" /> : <Copy size={20} className="text-accent-blue group-hover:text-white" />}
                    <span>{copied ? 'Link Copied' : 'Copy Referral'}</span>
                  </button>

                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="p-3.5 rounded-2xl bg-surface-elevated hover:bg-accent-red hover:text-white border border-border-theme text-xs font-bold transition-all flex flex-col items-center justify-center space-y-2 group shadow-xs"
                  >
                    <Download size={20} className="text-emerald-500 group-hover:text-white" />
                    <span>Withdraw Funds</span>
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-3.5 rounded-2xl bg-surface-elevated hover:bg-accent-red hover:text-white border border-border-theme text-xs font-bold transition-all flex flex-col items-center justify-center space-y-2 group shadow-xs"
                  >
                    <Share2 size={20} className="text-accent-purple group-hover:text-white" />
                    <span>Share Code</span>
                  </button>

                  <button
                    onClick={() => setActiveSidebarTab('overview')}
                    className="p-3.5 rounded-2xl bg-surface-elevated hover:bg-accent-red hover:text-white border border-border-theme text-xs font-bold transition-all flex flex-col items-center justify-center space-y-2 group shadow-xs"
                  >
                    <Layers size={20} className="text-accent-orange group-hover:text-white" />
                    <span>Matrix Tree</span>
                  </button>

                  <button
                    onClick={openWalletModal}
                    className="p-3.5 rounded-2xl bg-surface-elevated hover:bg-accent-red hover:text-white border border-border-theme text-xs font-bold transition-all flex flex-col items-center justify-center space-y-2 group shadow-xs"
                  >
                    <Wallet size={20} className="text-accent-red group-hover:text-white" />
                    <span>Wallet Settings</span>
                  </button>
                </div>
              </div>

              {/* 4. ANIMATED CHARTS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart 1: Line Area Earnings Velocity */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-prime flex items-center space-x-2">
                        <BarChart2 size={18} className="text-accent-red" />
                        <span>30-Day Earnings & Referral Growth</span>
                      </h3>
                      <p className="text-xs text-sub">Cumulative USDT payouts across Booster cycles</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      +156% Growth
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={earningsTrendData}>
                        <defs>
                          <linearGradient id="earningsColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF2E2E" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#FF2E2E" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="day" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                        <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-color)',
                            borderRadius: '16px',
                            color: 'var(--text-primary)'
                          }}
                        />
                        <Area type="monotone" dataKey="earnings" stroke="#FF2E2E" strokeWidth={3} fillOpacity={1} fill="url(#earningsColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Revenue Distribution Donut */}
                <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-prime flex items-center space-x-2">
                      <PieChart size={18} className="text-accent-blue" />
                      <span>Revenue Breakdown</span>
                    </h3>
                    <p className="text-xs text-sub">Smart contract payout distribution</p>
                  </div>

                  <div className="h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={revenueDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {revenueDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-sub pt-2 border-t border-border-theme">
                    {revenueDistributionData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 5. RECENT TRANSACTIONS & RECENT REWARDS PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Recent Transactions Table (8 Cols) */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-theme">
                    <div>
                      <h3 className="text-base font-extrabold text-prime flex items-center space-x-2">
                        <Clock size={18} className="text-accent-red" />
                        <span>Recent On-Chain Transactions</span>
                      </h3>
                      <p className="text-xs text-sub">Real-time smart contract events</p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center space-x-1.5 bg-surface-elevated p-1 rounded-xl border border-border-theme text-[10px] font-mono">
                      {['All', 'Commission', 'Matrix', 'Deposit'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setTxFilter(f as any)}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                            txFilter === f
                              ? 'bg-accent-red text-white shadow-xs'
                              : 'text-sub hover:text-prime'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transactions List */}
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {filteredTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3.5 rounded-2xl bg-surface-elevated border border-border-theme flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-prime flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{tx.type}</span>
                          </div>
                          <div className="text-[10px] text-sub font-mono">{tx.txHash} • {tx.time}</div>
                        </div>

                        <div className="text-right">
                          <div className={`font-mono font-extrabold ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-prime'}`}>
                            {tx.amount}
                          </div>
                          <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Recent Rewards Breakdown (5 Cols) */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-4">
                  <div className="pb-3 border-b border-border-theme">
                    <h3 className="text-base font-extrabold text-prime flex items-center space-x-2">
                      <Award size={18} className="text-emerald-500" />
                      <span>Recent Rewards Breakdown</span>
                    </h3>
                    <p className="text-xs text-sub">Allocations by reward pool mechanism</p>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border-theme flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-bold text-prime">Direct Sponsor Bonus (20%)</div>
                        <div className="text-[10px] text-sub">Instant partner commissions</div>
                      </div>
                      <span className="font-extrabold text-emerald-500 text-sm">$249.00</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border-theme flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-bold text-prime">13-Level Matrix Pool (65%)</div>
                        <div className="text-[10px] text-sub">Forced matrix tree allocation</div>
                      </div>
                      <span className="font-extrabold text-accent-blue text-sm">$809.00</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border-theme flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-bold text-prime">X5 Matrix Split (15%)</div>
                        <div className="text-[10px] text-sub">Auto re-topup cycle pool</div>
                      </div>
                      <span className="font-extrabold text-amber-500 text-sm">$187.00</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border-theme flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-bold text-prime">X4 Passive Spillover</div>
                        <div className="text-[10px] text-sub">Global team pool allocation</div>
                      </div>
                      <span className="font-extrabold text-accent-purple text-sm">$150.00</span>
                    </div>
                  </div>
                </div>

              </div>

            </>
          )}

        </main>
      </div>

      {/* MODAL 1: WITHDRAW FUNDS */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-surface border border-border-theme rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center pb-3 border-b border-border-theme">
                <div className="flex items-center space-x-2">
                  <Download size={18} className="text-emerald-500" />
                  <h3 className="text-base font-extrabold text-prime">Instant USDT Withdrawal</h3>
                </div>
                <button onClick={() => setShowWithdrawModal(false)} className="p-1 rounded-xl hover:bg-surface-elevated">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-surface-elevated border border-border-theme space-y-2">
                <div className="text-[10px] font-mono text-sub uppercase">Available Claimable Earnings</div>
                <div className="text-2xl font-mono font-black text-emerald-500">${usdtBalance} USDT</div>
                <div className="text-[11px] text-sub">Auto-credited directly to connected wallet address</div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-sub font-bold">Destination Wallet Address</label>
                <input
                  type="text"
                  disabled
                  value={address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                  className="w-full p-3 rounded-xl bg-surface-elevated border border-border-theme font-mono text-xs text-prime"
                />
              </div>

              <button
                onClick={() => {
                  alert('Withdrawal request submitted to smart contract queue!');
                  setShowWithdrawModal(false);
                }}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all"
              >
                Execute Instant Withdrawal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: SHARE REFERRAL CODE */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-surface border border-border-theme rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center pb-3 border-b border-border-theme">
                <div className="flex items-center space-x-2">
                  <Share2 size={18} className="text-accent-purple" />
                  <h3 className="text-base font-extrabold text-prime">Share Referral Code</h3>
                </div>
                <button onClick={() => setShowShareModal(false)} className="p-1 rounded-xl hover:bg-surface-elevated">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-surface-elevated border border-border-theme space-y-2 text-center">
                <div className="text-[10px] font-mono text-sub uppercase font-bold">Your Unique Invite Code</div>
                <div className="text-2xl font-mono font-black text-accent-purple tracking-widest">
                  {address ? address.slice(-6).toUpperCase() : 'F6D8976F'}
                </div>
                <p className="text-[11px] text-sub">Earn 20% instant direct commissions on every partner registration.</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={copyReferral}
                  className="w-full py-3 rounded-2xl bg-accent-red text-white font-extrabold text-xs shadow-md hover:bg-accent-red/90 transition-all flex items-center justify-center space-x-2"
                >
                  <Copy size={14} />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Full Invite Link'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
