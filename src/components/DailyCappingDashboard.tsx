import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Trophy, AlertTriangle, ArrowUpRight, TrendingUp, CheckCircle2, 
  ShieldCheck, Clock, Users, DollarSign, ChevronRight, Bell, Sparkles 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useWeb3Store } from '../store/useWeb3Store';

export default function DailyCappingDashboard() {
  const { setActiveView } = useWeb3Store();

  const [selectedPeriod, setSelectedPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');

  const todaysEarnings = 320.00;
  const currentCap = 500.00;
  const remainingCap = currentCap - todaysEarnings;
  const capUsagePercent = (todaysEarnings / currentCap) * 100;

  const qualifiedBuilders = 4;
  const nextTierRequirement = 5; // Need 5 qualified builders to unlock $1,000/day cap

  const hourlyCappingData = [
    { time: '00:00', earnings: 20 },
    { time: '04:00', earnings: 60 },
    { time: '08:00', earnings: 140 },
    { time: '12:00', earnings: 230 },
    { time: '16:00', earnings: 290 },
    { time: '20:00', earnings: 320 },
    { time: '23:59', earnings: 320 },
  ];

  const cappingLog = [
    { id: 'log-1', time: '18:42:10', type: 'MATRIX_DISTRIBUTION', amount: '+40.00 USDT', capApplied: 'Pass (Limit Active)', status: 'APPROVED' },
    { id: 'log-2', time: '15:10:05', type: 'DIRECT_REFERRAL_BONUS', amount: '+50.00 USDT', capApplied: 'Pass (Limit Active)', status: 'APPROVED' },
    { id: 'log-3', time: '11:25:33', type: 'X5_MATRIX_RECYCLE', amount: '+80.00 USDT', capApplied: 'Pass (Limit Active)', status: 'APPROVED' },
    { id: 'log-4', time: '08:05:12', type: 'LEVEL_POOL_SPILLOVER', amount: '+150.00 USDT', capApplied: 'Pass (Limit Active)', status: 'APPROVED' },
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-surface border border-border-theme p-8 shadow-xl relative overflow-hidden glass-panel">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-500 border border-amber-500/20">
              <Zap size={14} />
              <span>Real-Time Daily Earning Cap Guard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-prime tracking-tight">
              Daily <span className="text-amber-500">Capping</span> & Limits Monitor
            </h1>
            <p className="text-xs sm:text-sm text-sub max-w-2xl leading-relaxed">
              Protects system sustainability. Upgrade your team qualification to unlock higher daily earning thresholds (from $500/day up to $5,000/day).
            </p>
          </div>

          <button
            onClick={() => setActiveView('plans')}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all flex items-center space-x-2 shrink-0"
          >
            <Trophy size={16} />
            <span>Increase Daily Cap</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Today's Earnings */}
        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-2">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Today's Earnings</span>
          <div className="text-3xl font-black font-mono text-emerald-500">${todaysEarnings.toFixed(2)} USDT</div>
          <p className="text-[11px] text-sub">Resets at UTC 00:00:00</p>
        </div>

        {/* Card 2: Current Cap Limit */}
        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-2">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Current Daily Cap</span>
          <div className="text-3xl font-black font-mono text-prime">${currentCap.toFixed(2)} USDT</div>
          <p className="text-[11px] text-amber-500 font-bold flex items-center space-x-1">
            <ShieldCheck size={12} />
            <span>Tier 2 Builder Level Active</span>
          </p>
        </div>

        {/* Card 3: Remaining Cap */}
        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-2">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Remaining Cap Today</span>
          <div className="text-3xl font-black font-mono text-accent-blue">${remainingCap.toFixed(2)} USDT</div>
          <p className="text-[11px] text-sub">{((remainingCap / currentCap) * 100).toFixed(0)}% limit available</p>
        </div>

        {/* Card 4: Qualified Builders */}
        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-2">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Qualified Builders</span>
          <div className="text-3xl font-black font-mono text-prime">{qualifiedBuilders} / {nextTierRequirement}</div>
          <p className="text-[11px] text-sub">Need 1 more to unlock $1,000/day</p>
        </div>

      </div>

      {/* CYCLE PROGRESS BAR & CHART */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-theme shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-theme">
          <div>
            <h2 className="text-lg font-black text-prime flex items-center space-x-2">
              <TrendingUp size={18} className="text-amber-500" />
              <span>24-Hour Capping Utilization Curve</span>
            </h2>
            <p className="text-xs text-sub">Real-time hourly earnings progression towards the 500 USDT limit</p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-xl bg-surface-elevated border border-border-theme text-prime font-bold">
              Usage: {capUsagePercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span className="text-sub">$0.00</span>
            <span className="text-amber-500">${todaysEarnings.toFixed(2)} / ${currentCap.toFixed(2)} USDT</span>
          </div>
          <div className="w-full bg-border-theme h-3.5 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-amber-500 to-accent-red h-full rounded-full transition-all duration-700"
              style={{ width: `${capUsagePercent}%` }}
            />
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyCappingData}>
              <defs>
                <linearGradient id="capGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} domain={[0, 600]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#capGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CAPPING LOG TABLE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-theme shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border-theme">
          <h2 className="text-lg font-black text-prime flex items-center space-x-2">
            <Clock size={18} className="text-sub" />
            <span>Today's Distribution Audit Log</span>
          </h2>
          <span className="text-xs font-mono text-sub">4 Verified Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-theme text-sub uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Transaction Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Capping Status</th>
                <th className="py-3 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme">
              {cappingLog.map((log) => (
                <tr key={log.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="py-3.5 px-4 text-sub">{log.time}</td>
                  <td className="py-3.5 px-4 font-bold text-prime">{log.type}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-500">{log.amount}</td>
                  <td className="py-3.5 px-4 text-sub">{log.capApplied}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                      {log.status}
                    </span>
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
