import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ShieldCheck, Zap, Lock, RefreshCw, Layers } from 'lucide-react';

export default function WhyChooseSection() {
  const comparisonData = [
    {
      feature: 'Fund Custody & Control',
      simpleOn: '100% Non-Custodial (Direct P2P Wallet Delivery)',
      traditional: 'Centralized Platform Reserves (Risk of freezing/exit scam)',
      simpleOnGood: true
    },
    {
      feature: 'Payout Speed',
      simpleOn: 'Instant Smart Contract Execution (< 3 Seconds)',
      traditional: 'Manual Batch Requests (24h - 7 Days Approval)',
      simpleOnGood: true
    },
    {
      feature: 'Contract Auditability',
      simpleOn: '100% Open-Source BscScan Verified Code',
      traditional: 'Closed-Source Private Server Databases',
      simpleOnGood: true
    },
    {
      feature: 'Matrix Spillover Depth',
      simpleOn: '13-Level Forced 3x3 Auto Spillover Matrix',
      traditional: 'Shallow 2-3 Level Unilevel or Rigid Binary Pools',
      simpleOnGood: true
    },
    {
      feature: 'Slot Re-Topup Mechanics',
      simpleOn: 'Automated 5-Partner Re-Topup Reserve',
      traditional: 'Manual Re-Purchase Deadlines or Monthly Fees',
      simpleOnGood: true
    },
    {
      feature: 'Admin Alteration Risk',
      simpleOn: 'Immutable Rules — Zero Admin Override Capability',
      traditional: 'Admin can alter compensation plans anytime',
      simpleOnGood: true
    }
  ];

  return (
    <section id="why-choose-section" className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full bg-accent-red/10 px-3.5 py-1.5 text-xs font-bold text-accent-red border border-accent-red/20 mb-3">
            <ShieldCheck size={14} />
            <span>Superior Web3 Architecture</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-prime sm:text-4xl lg:text-5xl">
            Why Choose <span className="text-accent-red">SimpleOn</span>?
          </h2>
          <p className="mt-4 text-base text-sub leading-relaxed">
            See how SimpleOn's autonomous BEP-20 smart contract outclasses traditional centralized network marketing platforms.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="rounded-3xl bg-surface border border-border-theme overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-elevated border-b border-border-theme text-sub uppercase font-mono tracking-wider">
                  <th className="py-4 px-6 font-bold w-1/3">Feature Benchmark</th>
                  <th className="py-4 px-6 font-bold w-1/3 text-accent-red bg-accent-red/5">SimpleOn Protocol</th>
                  <th className="py-4 px-6 font-bold w-1/3 text-sub">Legacy Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme/50">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-prime text-sm flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-accent-red/10 text-accent-red shrink-0">
                        {idx % 2 === 0 ? <Zap size={14} /> : <Lock size={14} />}
                      </div>
                      <span>{row.feature}</span>
                    </td>
                    <td className="py-4 px-6 bg-accent-red/5 text-prime font-bold text-xs">
                      <div className="flex items-start space-x-2 text-emerald-500">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                        <span className="text-prime leading-normal">{row.simpleOn}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sub text-xs">
                      <div className="flex items-start space-x-2 text-red-400">
                        <XCircle size={16} className="shrink-0 mt-0.5" />
                        <span className="text-sub leading-normal">{row.traditional}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
