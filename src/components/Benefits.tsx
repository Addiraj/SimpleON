import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Zap, ShieldAlert, Award, Star, TrendingUp } from 'lucide-react';

export default function Benefits() {
  const benefitsList = [
    {
      icon: <TrendingUp className="text-red-600 dark:text-red-500" size={24} />,
      title: 'Auto-Upgrade Engine',
      description: 'System automatically upgrades your position from collected pool revenues. No manual intervention or secondary deposit required.'
    },
    {
      icon: <RefreshCw className="text-red-600 dark:text-red-500" size={24} />,
      title: 'Infinite Re-Topups',
      description: 'Your slots recycle automatically upon completion. Re-subscribe to the same tier and keep collecting without re-deposit.'
    },
    {
      icon: <Star className="text-red-600 dark:text-red-500" size={24} />,
      title: 'Unlimited Cycles',
      description: 'Zero lifetime limits on matrix cycles. Each tier can cycle an unlimited number of times as your downline teammates scale up.'
    },
    {
      icon: <Award className="text-red-600 dark:text-red-500" size={24} />,
      title: 'Dynamic Daily Capping',
      description: 'Unlock higher daily limits natively by qualifying more team members at subsequent booster tiers. Grow direct referrals to scale your cap.'
    },
    {
      icon: <ShieldAlert className="text-red-600 dark:text-red-500" size={24} />,
      title: 'On-Chain Security',
      description: 'Operates as an autonomous smart contract. Execution rules are rigid, transparent, and completely protected from admin tampering.'
    },
    {
      icon: <Zap className="text-red-600 dark:text-red-500" size={24} />,
      title: 'Instant P2P Delivery',
      description: 'All funds are immediately routed directly peer-to-peer to user wallets. Zero platform reserve funds, zero pending manual withdrawals.'
    }
  ];

  return (
    <section id="benefits-section" className="py-16 transition-colors duration-300">
      <div id="benefits-container" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div id="benefits-header" className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="benefits-heading" className="text-3xl font-extrabold tracking-tight text-prime sm:text-4xl">
            Why Choose SimpleOn?
          </h2>
          <p id="benefits-subheading" className="mt-4 text-base text-sub">
            Engineered with a focus on mathematical longevity, security, and immediate liquidity.
          </p>
        </div>

        {/* Grid layout */}
        <div id="benefits-grid" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefitsList.map((benefit, index) => (
            <motion.div
              key={index}
              id={`benefit-card-${index}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="p-6 rounded-2xl bg-surface border border-border-theme hover:border-accent-red/20 hover:shadow-md transition-all duration-300"
            >
              <div id={`benefit-icon-wrapper-${index}`} className="p-3 bg-accent-red/10 rounded-xl w-fit mb-4">
                {benefit.icon}
              </div>
              <h3 id={`benefit-title-${index}`} className="text-lg font-bold text-prime mb-2">{benefit.title}</h3>
              <p id={`benefit-desc-${index}`} className="text-sm text-sub leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
