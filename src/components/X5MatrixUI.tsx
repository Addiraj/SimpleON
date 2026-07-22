import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, RefreshCw, CheckCircle2, Clock, Users, ArrowRight, ShieldCheck, 
  Sparkles, ExternalLink, ChevronLeft, ChevronRight, Filter, Info, Zap, AlertCircle 
} from 'lucide-react';
import { useWeb3Store } from '../store/useWeb3Store';

interface MatrixNode {
  slotNumber: number;
  label: string;
  isFilled: boolean;
  address?: string;
  timestamp?: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  tierAmount: number;
  incomeGenerated: number;
  reTopupAmount: number;
  upgradeWalletAmount: number;
}

export default function X5MatrixUI() {
  const { basePlan } = useWeb3Store();

  const [selectedCycle, setSelectedCycle] = useState<number>(3); // Current Cycle #3
  const [hoveredNode, setHoveredNode] = useState<MatrixNode | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const mainPlanCost = basePlan * 100;
  const x5PoolAmount = mainPlanCost * 0.15; // 15% of Main Plan

  // Cycle 3 Current State (3 slots filled out of 5)
  const currentNodes: MatrixNode[] = [
    {
      slotNumber: 1,
      label: 'Position #1',
      isFilled: true,
      address: '0x8f3C91029381A063b4f8a2910d',
      timestamp: '2026-07-20 14:32:00',
      status: 'COMPLETED',
      tierAmount: x5PoolAmount,
      incomeGenerated: x5PoolAmount * 0.8,
      reTopupAmount: x5PoolAmount * 0.2,
      upgradeWalletAmount: 0
    },
    {
      slotNumber: 2,
      label: 'Position #2',
      isFilled: true,
      address: '0x4e5d6c7b8a901234567890ab',
      timestamp: '2026-07-21 09:15:22',
      status: 'COMPLETED',
      tierAmount: x5PoolAmount,
      incomeGenerated: x5PoolAmount * 0.8,
      reTopupAmount: x5PoolAmount * 0.2,
      upgradeWalletAmount: 0
    },
    {
      slotNumber: 3,
      label: 'Position #3',
      isFilled: true,
      address: '0x1234567890abcdef12345678',
      timestamp: '2026-07-22 04:10:05',
      status: 'ACTIVE',
      tierAmount: x5PoolAmount,
      incomeGenerated: x5PoolAmount * 0.8,
      reTopupAmount: x5PoolAmount * 0.2,
      upgradeWalletAmount: 0
    },
    {
      slotNumber: 4,
      label: 'Position #4',
      isFilled: false,
      status: 'PENDING',
      tierAmount: x5PoolAmount,
      incomeGenerated: 0,
      reTopupAmount: 0,
      upgradeWalletAmount: 0
    },
    {
      slotNumber: 5,
      label: 'Position #5 (Auto-Recycle)',
      isFilled: false,
      status: 'PENDING',
      tierAmount: x5PoolAmount,
      incomeGenerated: 0,
      reTopupAmount: 0,
      upgradeWalletAmount: 0
    }
  ];

  // Matrix History Cycles
  const matrixCyclesHistory = [
    { cycle: 3, status: 'IN_PROGRESS', filledSlots: 3, totalSlots: 5, earnings: x5PoolAmount * 0.8 * 3, dateStarted: '2026-07-20' },
    { cycle: 2, status: 'COMPLETED', filledSlots: 5, totalSlots: 5, earnings: x5PoolAmount * 0.8 * 5, dateStarted: '2026-06-12', dateCompleted: '2026-07-19' },
    { cycle: 1, status: 'COMPLETED', filledSlots: 5, totalSlots: 5, earnings: x5PoolAmount * 0.4 * 5, dateStarted: '2026-05-01', dateCompleted: '2026-06-11' },
  ];

  const activeCount = currentNodes.filter(n => n.isFilled).length;
  const pendingCount = currentNodes.filter(n => !n.isFilled).length;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Hero Title Header */}
      <div className="rounded-3xl bg-surface border border-border-theme p-8 shadow-xl relative overflow-hidden glass-panel">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent-red/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-accent-red/10 px-3.5 py-1 text-xs font-bold text-accent-red border border-accent-red/20">
              <Layers size={14} />
              <span>X5 Matrix Engine • 15% Allocation Pool</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-prime tracking-tight">
              Interactive <span className="text-accent-red">X5 Matrix</span> Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-sub max-w-2xl leading-relaxed">
              Every 5th placement triggers automated matrix recycling. Cycle 1 splits payouts as 20% Re-topup, 40% Upgrade Wallet, and 40% Net Income. Cycle 2+ delivers <strong className="text-emerald-500 font-mono">80% direct net income</strong>!
            </p>
          </div>

          {/* Cycle Selector Cards */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="p-3 rounded-2xl bg-surface-elevated border border-border-theme text-right">
              <span className="text-[10px] font-mono text-sub block uppercase font-bold">Active Cycle</span>
              <span className="text-2xl font-black font-mono text-accent-red">Cycle #{selectedCycle}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-elevated border border-border-theme text-right">
              <span className="text-[10px] font-mono text-sub block uppercase font-bold">X5 Slot Value</span>
              <span className="text-2xl font-black font-mono text-emerald-500">${x5PoolAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-1">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Filled Node Slots</span>
          <div className="text-3xl font-black font-mono text-prime">{activeCount} / 5 Slots</div>
          <div className="w-full bg-border-theme h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-accent-red h-full rounded-full transition-all duration-500" style={{ width: `${(activeCount / 5) * 100}%` }} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-1">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Pending Node Slots</span>
          <div className="text-3xl font-black font-mono text-amber-500">{pendingCount} Slots Open</div>
          <p className="text-[11px] text-sub">Next slot: Position #{activeCount + 1}</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-1">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Cycle 3 Generated Income</span>
          <div className="text-3xl font-black font-mono text-emerald-500">${(x5PoolAmount * 0.8 * activeCount).toFixed(2)} USDT</div>
          <p className="text-[11px] text-emerald-500 font-bold">80% Net Payout Rate Active</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-1">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Completed Cycles</span>
          <div className="text-3xl font-black font-mono text-accent-blue">2 Cycles Recycling</div>
          <p className="text-[11px] text-sub">10 Total Recycled Nodes</p>
        </div>
      </div>

      {/* INTERACTIVE SVG MATRIX SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-theme shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-border-theme gap-4">
          <div>
            <h2 className="text-lg font-black text-prime flex items-center space-x-2">
              <Sparkles size={18} className="text-accent-red" />
              <span>Interactive SVG X5 Matrix Node Map</span>
            </h2>
            <p className="text-xs text-sub">Hover over any position node to inspect live placement timestamps and wallet reward splits.</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl bg-accent-red/10 text-accent-red font-mono text-xs font-bold border border-accent-red/20">
              Auto Spillover Enabled
            </span>
          </div>
        </div>

        {/* SVG Graphic Canvas */}
        <div className="relative p-8 rounded-2xl bg-surface-elevated/80 border border-border-theme flex flex-col items-center justify-center min-h-[420px]">
          
          <svg className="w-full max-w-2xl h-80 overflow-visible" viewBox="0 0 600 320">
            {/* Connector Lines from Root (300, 50) to 5 Nodes */}
            <g stroke="currentColor" className="text-border-theme" strokeWidth="2" strokeDasharray="4 4">
              <line x1="300" y1="50" x2="80" y2="230" />
              <line x1="300" y1="50" x2="190" y2="230" />
              <line x1="300" y1="50" x2="300" y2="230" />
              <line x1="300" y1="50" x2="410" y2="230" />
              <line x1="300" y1="50" x2="520" y2="230" />
            </g>

            {/* Root Node (Center Top) */}
            <g className="cursor-pointer">
              <circle cx="300" cy="50" r="28" fill="#DC2626" className="shadow-lg" />
              <text x="300" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                ROOT
              </text>
            </g>

            {/* 5 Satellite Nodes */}
            {currentNodes.map((node, index) => {
              const xPositions = [80, 190, 300, 410, 520];
              const cx = xPositions[index];
              const cy = 230;

              const isFilled = node.isFilled;
              const isRecycleNode = index === 4;

              return (
                <g 
                  key={node.slotNumber} 
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Ring if Active */}
                  {isFilled && (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="26" 
                      fill="none" 
                      stroke={isRecycleNode ? "#F59E0B" : "#10B981"} 
                      strokeWidth="2"
                      className="animate-ping opacity-30" 
                    />
                  )}

                  {/* Main Circle Node */}
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r="22" 
                    fill={isFilled ? (isRecycleNode ? "#F59E0B" : "#10B981") : "var(--color-surface, #1E293B)"} 
                    stroke={isFilled ? "none" : "var(--color-border-theme, #334155)"} 
                    strokeWidth="2"
                    className="transition-transform duration-200 group-hover:scale-110"
                  />

                  {/* Icon or Text inside Node */}
                  <text 
                    x={cx} 
                    y={cy + 4} 
                    textAnchor="middle" 
                    fill={isFilled ? "#FFFFFF" : "#94A3B8"} 
                    fontSize="11" 
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    #{node.slotNumber}
                  </text>

                  {/* Node Sub-label */}
                  <text 
                    x={cx} 
                    y={cy + 40} 
                    textAnchor="middle" 
                    fill="currentColor" 
                    className="text-sub" 
                    fontSize="10" 
                    fontFamily="monospace"
                  >
                    {isFilled ? `${node.address?.slice(0, 4)}...` : 'OPEN'}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Hover Tooltip Drawer */}
          <AnimatePresence>
            {hoveredNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-elevated border border-border-theme rounded-2xl p-4 shadow-2xl z-20 min-w-[320px] text-xs font-mono space-y-2"
              >
                <div className="flex justify-between items-center border-b border-border-theme pb-2">
                  <span className="font-bold text-prime">{hoveredNode.label}</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    hoveredNode.isFilled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {hoveredNode.isFilled ? 'FILLED & PAID' : 'AWAITING SPILLOVER'}
                  </span>
                </div>

                {hoveredNode.isFilled ? (
                  <div className="space-y-1 text-sub">
                    <p><strong className="text-prime">Wallet:</strong> {hoveredNode.address}</p>
                    <p><strong className="text-prime">Placed:</strong> {hoveredNode.timestamp}</p>
                    <p><strong className="text-prime">Slot Amount:</strong> ${hoveredNode.tierAmount.toFixed(2)} USDT</p>
                    <p className="text-emerald-500 font-bold">
                      Payout (80% Net): +${hoveredNode.incomeGenerated.toFixed(2)} USDT
                    </p>
                  </div>
                ) : (
                  <p className="text-sub">
                    Position empty. Direct referrals or matrix spillover from upline will occupy this slot automatically.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cycle Breakdown Flow Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-surface-elevated border border-border-theme space-y-2">
            <h3 className="text-xs font-extrabold text-prime font-mono uppercase flex items-center space-x-2">
              <Zap size={14} className="text-accent-red" />
              <span>Cycle 1 Payout Formula</span>
            </h3>
            <p className="text-xs text-sub leading-relaxed">
              <strong>20%</strong> Re-topup Pool + <strong>40%</strong> Auto-Upgrade Wallet + <strong>40%</strong> Direct Net Income. Ensures rapid progression to higher tiers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-elevated border border-border-theme space-y-2">
            <h3 className="text-xs font-extrabold text-prime font-mono uppercase flex items-center space-x-2">
              <RefreshCw size={14} className="text-emerald-500" />
              <span>Cycle 2+ Perpetual Recycling Formula</span>
            </h3>
            <p className="text-xs text-sub leading-relaxed">
              <strong>20%</strong> Re-topup Pool + <strong>80% Direct Net Income</strong>. Provides maximum cashflow for continuous matrix cycles.
            </p>
          </div>
        </div>
      </div>

      {/* MATRIX HISTORY TABLE WITH FILTERS & PAGINATION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-theme shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-theme">
          <div>
            <h2 className="text-lg font-black text-prime flex items-center space-x-2">
              <Clock size={18} className="text-accent-blue" />
              <span>Matrix Cycles Log & Historic Payouts</span>
            </h2>
            <p className="text-xs text-sub">Complete record of active and completed X5 matrix cycles</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-surface-elevated border border-border-theme text-xs font-mono font-bold text-prime focus:outline-none"
            >
              <option value="ALL">All Cycles</option>
              <option value="COMPLETED">Completed Cycles</option>
              <option value="IN_PROGRESS">Active In Progress</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-border-theme text-sub uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Cycle ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Slot Progress</th>
                <th className="py-3 px-4">Total Income Generated</th>
                <th className="py-3 px-4">Date Started</th>
                <th className="py-3 px-4">Date Recycled</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme">
              {matrixCyclesHistory
                .filter(item => historyFilter === 'ALL' ? true : item.status === historyFilter)
                .map((item) => (
                  <tr key={item.cycle} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-prime">Cycle #{item.cycle}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-prime font-bold">{item.filledSlots} / {item.totalSlots} Slots</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-500">${item.earnings.toFixed(2)} USDT</td>
                    <td className="py-3.5 px-4 text-sub">{item.dateStarted}</td>
                    <td className="py-3.5 px-4 text-sub">{item.dateCompleted || 'In Progress'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => setSelectedCycle(item.cycle)}
                        className="px-3 py-1 rounded-lg bg-surface-elevated hover:bg-surface border border-border-theme text-prime text-[11px] font-bold"
                      >
                        View Node Map
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
