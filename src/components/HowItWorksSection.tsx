import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Layers, Users, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Connect Web3 Wallet',
      desc: 'Link your MetaMask, Trust Wallet, or Binance Web3 Wallet on BNB Smart Chain Testnet/Mainnet via SIWE authentication.',
      icon: <Wallet className="text-accent-red" size={24} />,
      badge: 'Step 1'
    },
    {
      num: '02',
      title: 'Select Booster Plan',
      desc: 'Subscribe starting at $100 USDT (Starter Booster). Approve USDT transfer and sign the smart contract deposit transaction.',
      icon: <Layers className="text-accent-blue" size={24} />,
      badge: 'Step 2'
    },
    {
      num: '03',
      title: '5-Partner Cycle Placement',
      desc: 'Your position fills through 5 direct referrals or team spillovers. Receive instant 20% direct commissions and 65% matrix allocations.',
      icon: <Users className="text-accent-orange" size={24} />,
      badge: 'Step 3'
    },
    {
      num: '04',
      title: 'Infinite Re-Topup & Main Plan Entry',
      desc: 'Upon 5th partner completion, system executes auto re-topup and reserves funds to auto-upgrade you into higher matrix pools.',
      icon: <RefreshCw className="text-accent-purple" size={24} />,
      badge: 'Step 4'
    }
  ];

  return (
    <section id="how-booster-works-section" className="py-20 relative bg-surface-elevated/40 border-y border-border-theme">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full bg-accent-blue/10 px-3.5 py-1.5 text-xs font-bold text-accent-blue border border-accent-blue/20 mb-3">
            <Sparkles size={14} />
            <span>Frictionless Web3 Workflow</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-prime sm:text-4xl lg:text-5xl">
            How the <span className="text-accent-red">Booster Engine</span> Works
          </h2>
          <p className="mt-4 text-base text-sub leading-relaxed">
            Four transparent steps to activate your position, earn direct referral bonuses, and scale through 13 matrix levels.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="p-6 rounded-3xl bg-surface border border-border-theme flex flex-col justify-between relative shadow-sm hover:shadow-lg hover:border-accent-red/30 transition-all duration-300 group"
            >
              {/* Number watermark */}
              <span className="absolute top-4 right-4 font-mono font-black text-4xl text-sub/10 select-none group-hover:text-accent-red/20 transition-colors">
                {step.num}
              </span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-surface-elevated border border-border-theme shadow-sm">
                    {step.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-elevated border border-border-theme text-[10px] font-mono font-bold text-sub">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-prime mb-2">{step.title}</h3>
                <p className="text-xs text-sub leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-theme/60 flex items-center justify-between text-[11px] font-bold text-accent-red">
                <span>Automated On-Chain</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
