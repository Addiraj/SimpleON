import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileCode, AlertTriangle, ExternalLink } from 'lucide-react';

export default function SecuritySection() {
  const securityBadges = [
    {
      title: 'ReentrancyGuard Protocol',
      desc: 'Prevents re-entrancy attack vectors on deposit and payout distribution calls.',
      icon: <Lock className="text-accent-red" size={20} />
    },
    {
      title: 'SafeERC20 Implementation',
      desc: 'Standardized BEP-20 USDT token transfers with strict return value checks.',
      icon: <CheckCircle2 className="text-accent-blue" size={20} />
    },
    {
      title: 'EIP-712 Nonce Verification',
      desc: 'SIWE cryptographic signature authentication prevents replay attacks.',
      icon: <ShieldCheck className="text-accent-orange" size={20} />
    },
    {
      title: '100% Non-Custodial',
      desc: 'Zero platform reserve vault. Smart contract auto-routes funds directly P2P.',
      icon: <FileCode className="text-accent-purple" size={20} />
    }
  ];

  return (
    <section id="security-audit-section" className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full bg-accent-red/10 px-3.5 py-1.5 text-xs font-bold text-accent-red border border-accent-red/20 mb-3">
            <ShieldCheck size={14} />
            <span>Smart Contract Security Verification</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-prime sm:text-4xl lg:text-5xl">
            100% Audited & <span className="text-accent-red">Immutable</span>
          </h2>
          <p className="mt-4 text-base text-sub leading-relaxed">
            Our autonomous BEP-20 smart contract logic cannot be shut down, modified, or altered by any central authority.
          </p>
        </div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityBadges.map((badge, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-surface border border-border-theme space-y-3 shadow-sm hover:border-accent-red/30 transition-all">
              <div className="p-3 rounded-2xl bg-surface-elevated w-fit border border-border-theme">
                {badge.icon}
              </div>
              <h3 className="text-base font-extrabold text-prime">{badge.title}</h3>
              <p className="text-xs text-sub leading-relaxed">{badge.desc}</p>
            </div>
          ))}
        </div>

        {/* BscScan Verified Contract Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-elevated border border-border-theme flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-prime">Verified Smart Contract Source Code</div>
              <div className="text-xs text-sub font-mono mt-0.5">Contract Address: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
            </div>
          </div>

          <a
            href="https://testnet.bscscan.com/address/0x71C7656EC7ab88b098defB751B7401B5f6d8976F#code"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-surface border border-border-theme text-xs font-bold text-prime hover:bg-border-theme transition-all flex items-center space-x-2 shrink-0"
          >
            <span>View Source on BscScan</span>
            <ExternalLink size={14} />
          </a>
        </div>

      </div>
    </section>
  );
}
