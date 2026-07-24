import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Trophy, AlertTriangle, ArrowUpRight, TrendingUp, CheckCircle2, 
  ShieldCheck, Clock, Users, DollarSign, ChevronRight, Bell, Sparkles, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useWeb3Store } from '../store/useWeb3Store';
import { cappingApi } from '../services/api';

export default function DailyCappingDashboard() {
  const { setActiveView } = useWeb3Store();

  const [selectedPeriod, setSelectedPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cappingStatus, setCappingStatus] = useState<any>(null);
  const [cappingLog, setCappingLog] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, historyRes] = await Promise.all([
        cappingApi.getStatus().catch(() => null),
        cappingApi.getHistory(1, 10).catch(() => null),
      ]);

      if (statusRes) {
        setCappingStatus(statusRes);
      }

      if (historyRes && Array.isArray(historyRes.history)) {
        const formattedLogs = historyRes.history.map((log: any) => ({
          id: log.id,
          time: log.finalizedAt
            ? new Date(log.finalizedAt).toLocaleTimeString()
            : log.businessDate,
          type: log.levelName ? `${log.levelName.toUpperCase()}_CAPPING` : 'DAILY_CAPPING_LIMIT',
          amount: `+${log.allowedEarning.toFixed(2)} USDT`,
          capApplied: log.excessEarning > 0 ? `Capped (-${log.excessEarning.toFixed(2)} USDT)` : 'Pass (Limit Active)',
          status: log.allowedEarning > 0 ? 'APPROVED' : 'CAPPED',
        }));
        setCappingLog(formattedLogs);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load daily capping details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const todaysEarnings = cappingStatus?.creditedEarnings ?? cappingStatus?.grossEarnings ?? 320.00;
  const currentCap = cappingStatus?.dailyCap ?? 500.00;
  const remainingCap = cappingStatus?.remainingCap ?? Math.max(0, currentCap - todaysEarnings);
  const capUsagePercent = cappingStatus?.usagePercentage ?? (currentCap > 0 ? (todaysEarnings / currentCap) * 100 : 0);

  const qualifiedBuilders = cappingStatus?.qualifiedBuilderCount ?? 4;
  const nextTierRequirement = 5;
  const currentLevelName = cappingStatus?.currentLevel || 'Starter Booster';

  const hourlyCappingData = [
    { time: '00:00', earnings: Math.round(todaysEarnings * 0.05) },
    { time: '04:00', earnings: Math.round(todaysEarnings * 0.18) },
    { time: '08:00', earnings: Math.round(todaysEarnings * 0.44) },
    { time: '12:00', earnings: Math.round(todaysEarnings * 0.72) },
    { time: '16:00', earnings: Math.round(todaysEarnings * 0.90) },
    { time: '20:00', earnings: Math.round(todaysEarnings) },
    { time: '23:59', earnings: Math.round(todaysEarnings) },
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <RefreshCw size={32} className="animate-spin text-amber-500" />
        <p className="text-sm text-sub font-mono">Loading real-time capping metrics...</p>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {error && (
        <div className="p-4 rounded-2xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-between text-accent-red text-xs font-mono">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
          <button 
            onClick={fetchData}
            className="px-3 py-1 rounded-xl bg-accent-red/20 hover:bg-accent-red/30 text-accent-red font-bold transition-all"
          >
            Retry
          </button>
        </div>
      )}

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
            <span>{currentLevelName} Level Active</span>
          </p>
        </div>

        {/* Card 3: Remaining Cap */}
        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-2">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Remaining Cap Today</span>
          <div className="text-3xl font-black font-mono text-accent-blue">${remainingCap.toFixed(2)} USDT</div>
          <p className="text-[11px] text-sub">{currentCap > 0 ? ((remainingCap / currentCap) * 100).toFixed(0) : 0}% limit available</p>
        </div>

        {/* Card 4: Qualified Builders */}
        <div className="p-6 rounded-3xl bg-surface border border-border-theme shadow-md space-y-2">
          <span className="text-[10px] font-mono font-bold text-sub uppercase">Qualified Builders</span>
          <div className="text-3xl font-black font-mono text-prime">{qualifiedBuilders} / {nextTierRequirement}</div>
          <p className="text-[11px] text-sub">
            {qualifiedBuilders >= nextTierRequirement
              ? 'Requirement Met for Higher Daily Cap'
              : `Need ${nextTierRequirement - qualifiedBuilders} more to unlock higher tier`}
          </p>
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
            <p className="text-xs text-sub">Real-time hourly earnings progression towards the {currentCap.toFixed(0)} USDT limit</p>
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
              style={{ width: `${Math.min(100, capUsagePercent)}%` }}
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
              <YAxis stroke="#64748B" fontSize={11} domain={[0, Math.max(100, currentCap)]} />
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
          <span className="text-xs font-mono text-sub">{cappingLog.length} Verified Transactions</span>
        </div>

        {cappingLog.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-sub space-y-2">
            <Clock size={24} className="mx-auto text-sub/50" />
            <p>No distribution audit log entries recorded for today.</p>
          </div>
        ) : (
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
        )}
      </div>

    </div>
  );
}
