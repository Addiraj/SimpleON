import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Landmark, Users, TrendingUp, Globe } from 'lucide-react';

interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

function CountUp({ end, prefix = '', suffix = '', duration = 1.5 }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <span className="font-mono tracking-tight text-2xl sm:text-3xl font-black tabular-nums">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsTicker() {
  return (
    <div 
      id="live-stats-ticker" 
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-20"
    >
      <div 
        id="stats-container-inner" 
        className="rounded-3xl border border-border-theme bg-surface-elevated/80 backdrop-blur-md p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/4 h-20 w-40 rounded-full bg-accent-red/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-20 w-40 rounded-full bg-accent-blue/5 blur-2xl pointer-events-none" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center text-center">
          
          {/* Stat 1 */}
          <div id="stat-total-distributed" className="flex flex-col items-center space-y-2">
            <div className="p-2.5 bg-accent-red/10 text-accent-red rounded-xl">
              <Landmark size={20} />
            </div>
            <div className="text-prime">
              <CountUp end={1245680} prefix="" suffix=" USDT" />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-sub uppercase tracking-wider">
              Total Distributed
            </span>
          </div>

          {/* Stat 2 */}
          <div id="stat-active-participants" className="flex flex-col items-center space-y-2 border-l border-border-theme/40 md:border-l">
            <div className="p-2.5 bg-accent-blue/10 text-accent-blue rounded-xl">
              <Users size={20} />
            </div>
            <div className="text-prime">
              <CountUp end={142395} />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-sub uppercase tracking-wider">
              Active Participants
            </span>
          </div>

          {/* Stat 3 */}
          <div id="stat-distributed-today" className="flex flex-col items-center space-y-2 border-l border-border-theme/40 md:border-l">
            <div className="p-2.5 bg-accent-orange/10 text-accent-orange rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div className="text-prime">
              <CountUp end={48512} suffix=" USDT" />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-sub uppercase tracking-wider">
              Distributed Today
            </span>
          </div>

          {/* Stat 4 */}
          <div id="stat-countries-represented" className="flex flex-col items-center space-y-2 border-l border-border-theme/40 md:border-l">
            <div className="p-2.5 bg-accent-purple/10 text-accent-purple rounded-xl">
              <Globe size={20} />
            </div>
            <div className="text-prime">
              <CountUp end={118} />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-sub uppercase tracking-wider">
              Countries Active
            </span>
          </div>

        </div>

        {/* Caption */}
        <div 
          id="stats-ticker-caption" 
          className="mt-6 text-center text-[10px] sm:text-xs text-sub/80 border-t border-border-theme/50 pt-4 font-medium"
        >
          Illustrative simulation data — not live platform statistics. All numbers are for structural demonstration purposes.
        </div>
      </div>
    </div>
  );
}
