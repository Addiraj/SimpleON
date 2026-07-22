import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Rocket, TrendingUp, Users, Trophy, ShieldCheck, ChevronDown, ChevronUp, Layers, Coins, Target } from 'lucide-react';

export default function Plans({ basePlan = 1 }: { basePlan?: number } = {}) {
  const [expandedSection, setExpandedSection] = useState<'booster' | 'main' | null>('booster');

  const starterCost = basePlan * 1;
  const builderCost = basePlan * 4;
  const leaderCost = basePlan * 16;
  const championCost = basePlan * 64;
  const mainPlanCost = basePlan * 100;

  const boosterTiers = [
    {
      name: 'Starter Booster',
      cost: `${starterCost.toFixed(2)} USDT`,
      costFormula: '1 × Base Plan',
      collection: `${(starterCost * 5).toFixed(2)} USDT`,
      reSubscribe: `${starterCost.toFixed(2)} USDT`,
      upgrade: `${builderCost.toFixed(2)} USDT`,
      description: `Your entry ticket. Out of ${(starterCost * 5).toFixed(2)} USDT collected from 5 direct partners, ${starterCost.toFixed(2)} USDT is used to re-subscribe and ${builderCost.toFixed(2)} USDT automatically upgrades you to Builder.`,
      accent: 'border-red-500 dark:border-red-600',
      badgeBg: 'bg-red-50 text-red-600 dark:bg-red-950/25 dark:text-red-500',
      icon: <Rocket size={20} className="text-red-600 dark:text-red-500" />
    },
    {
      name: 'Builder Booster',
      cost: `${builderCost.toFixed(2)} USDT`,
      costFormula: '4 × Base Plan',
      collection: `${(builderCost * 5).toFixed(2)} USDT`,
      reSubscribe: `${builderCost.toFixed(2)} USDT`,
      upgrade: `${leaderCost.toFixed(2)} USDT`,
      description: `The second tier. Out of ${(builderCost * 5).toFixed(2)} USDT collected, ${builderCost.toFixed(2)} USDT is recycled into Builder re-subscription and ${leaderCost.toFixed(2)} USDT is used to auto-upgrade to Leader.`,
      accent: 'border-blue-500 dark:border-blue-600',
      badgeBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/25 dark:text-blue-500',
      icon: <TrendingUp size={20} className="text-blue-600 dark:text-blue-500" />
    },
    {
      name: 'Leader Booster',
      cost: `${leaderCost.toFixed(2)} USDT`,
      costFormula: '16 × Base Plan',
      collection: `${(leaderCost * 5).toFixed(2)} USDT`,
      reSubscribe: `${leaderCost.toFixed(2)} USDT`,
      upgrade: `${championCost.toFixed(2)} USDT`,
      description: `The high tier. ${(leaderCost * 5).toFixed(2)} USDT collected: ${leaderCost.toFixed(2)} USDT goes to Leader re-subscription and ${championCost.toFixed(2)} USDT automatically upgrades you to Champion.`,
      accent: 'border-orange-500 dark:border-orange-600',
      badgeBg: 'bg-orange-50 text-orange-600 dark:bg-orange-950/25 dark:text-orange-500',
      icon: <Users size={20} className="text-orange-600 dark:text-orange-500" />
    },
    {
      name: 'Champion Booster',
      cost: `${championCost.toFixed(2)} USDT`,
      costFormula: '64 × Base Plan',
      collection: `${(championCost * 5).toFixed(2)} USDT`,
      reSubscribe: `${championCost.toFixed(2)} USDT`,
      upgrade: `${mainPlanCost.toFixed(2)} USDT (to Main Plan)`,
      income: `${(basePlan * 156).toFixed(2)} USDT (Net Income)`,
      description: `The peak of Booster. Total collection of ${(championCost * 5).toFixed(2)} USDT is distributed exactly: ${championCost.toFixed(2)} USDT for Champion re-topup, ${mainPlanCost.toFixed(2)} USDT to activate the Main Plan, leaving ${(basePlan * 156).toFixed(2)} USDT directly in your Wallet as "First Net Income".`,
      accent: 'border-purple-500 dark:border-purple-600',
      badgeBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/25 dark:text-purple-500',
      icon: <Trophy size={20} className="text-purple-600 dark:text-purple-500" />
    }
  ];

  const mainPlanAllocations = [
    {
      module: 'X5 Matrix Split',
      percentage: '15%',
      amount: `${(mainPlanCost * 0.15).toFixed(2)} USDT`,
      formula: '15% × Main Plan Amount',
      description: 'A dedicated 5-position matrix. Payout cycle 1: 20% retopup, 40% upgrade wallet, 40% income. From cycle 2 onward: 20% retopup, 80% direct net income.'
    },
    {
      module: '13-Level Forced Income Pool',
      percentage: '65%',
      amount: `${(mainPlanCost * 0.65).toFixed(2)} USDT`,
      formula: '65% × Main Plan Amount',
      description: `Distributed evenly as ${(mainPlanCost * 0.65 / 13).toFixed(2)} USDT per level across 13 levels. Leverages a 3×3 forced matrix with automated spillover placement.`
    },
    {
      module: 'X4 Matrix Allocation',
      percentage: '20%',
      amount: `${(mainPlanCost * 0.20).toFixed(2)} USDT`,
      formula: '20% × Main Plan Amount',
      description: 'A 2×2 forced spillover matrix. Allocates 20.00 USDT for automated spillover recycling, unlimited cycles, and passive team placement.'
    }
  ];

  const ladderSteps = [
    { name: 'Starter', multiple: '1x', cost: starterCost, color: 'text-accent-red border-accent-red/30 bg-accent-red/5' },
    { name: 'Builder', multiple: '4x', cost: builderCost, color: 'text-accent-blue border-accent-blue/30 bg-accent-blue/5' },
    { name: 'Leader', multiple: '16x', cost: leaderCost, color: 'text-accent-orange border-accent-orange/30 bg-accent-orange/5' },
    { name: 'Champion', multiple: '64x', cost: championCost, color: 'text-accent-purple border-accent-purple/30 bg-accent-purple/5' },
    { name: 'Main Plan', multiple: '100x', cost: mainPlanCost, color: 'text-green-600 border-green-500/30 bg-green-500/5' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "What happens when a Booster tier's 5 direct slots are full?",
      answer: `Once your 5 direct partner slots are filled, the gathered subscription value triggers two simultaneous actions: first, your current Booster tier is immediately re-subscribed (re-topup) so you can receive from subsequent cycles, and second, the remaining collected value is used to automatically upgrade your position to the next higher Booster level.`
    },
    {
      question: "What is 'daily capping' and how do I increase mine?",
      answer: "Daily capping is a protective limit that defines the maximum cycle distributions you can receive in a 24-hour period (initially set to 5 cycles). To increase your daily capping limit, you can support your active direct referrals in upgrading to higher tier qualification levels (such as Qualified Builder, Leader, or Champion)."
    },
    {
      question: "What's the difference between the Booster Plan and the Main Plan?",
      answer: `The Booster Plan is the entry and acceleration phase where participants start with a low, flexible budget (1x Base Plan) and build up team size and upgrade capital. The Main Plan is the advanced, high-yield tier (100x Base Plan) that activates once you complete the Champion Booster, opening deep matrix splits, level pools, and global spillovers.`
    },
    {
      question: "What are the X5 and X4 matrices?",
      answer: "The X5 Matrix is a fast-recycling 5-position matrix where payouts are split in real-time (splitting into recycling, upgrade, and income wallets depending on your current cycle number). The X4 Matrix is a 2×2 forced passive placement matrix that utilizes global spillover pathways, allowing slots to be filled by upstream or downstream team activity."
    },
    {
      question: "What happens to my position if I stop referring new members?",
      answer: "Because SimpleOn includes passive structures like the 13-Level forced pool and the X4 Matrix, your position can still receive passive spillover placements and distributions from active upline or downline members. However, active direct referrals are highly recommended to accelerate your booster tier upgrades and increase your daily capping limits. Final behavior depends on live platform rules to be confirmed."
    }
  ];

  return (
    <section id="plans-section" className="py-16 transition-colors duration-300">
      <div id="plans-container" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div id="plans-header" className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="plans-heading" className="text-3xl font-extrabold tracking-tight text-prime sm:text-4xl">
            Dual-Plan Earning Structure
          </h2>
          <p id="plans-subheading" className="mt-4 text-base text-sub">
            A dynamic mathematical system where Booster levels feed directly into the high-yield Main Plan.
          </p>
        </div>

        {/* ===========================================
            4. SLOT/LEVEL PRICING LADDER
           =========================================== */}
        <div id="pricing-ladder" className="mb-16">
          <div className="bg-surface-elevated/40 border border-border-theme rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-extrabold text-prime mb-8 text-center sm:text-left flex items-center space-x-2">
              <Target size={20} className="text-accent-red" />
              <span>SimpleOn Pricing Ladder & Growth Multipliers</span>
            </h3>

            {/* Desktop / Tablet Timeline view */}
            <div className="hidden md:flex items-center justify-between relative px-4">
              {/* Central connection line */}
              <div className="absolute left-12 right-12 top-10 h-0.5 bg-dashed bg-border-theme z-0" />

              {ladderSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  {/* Step Card */}
                  <div className="flex flex-col items-center relative z-10 w-28">
                    <div className={`h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center font-mono ${step.color} shadow-sm`}>
                      <span className="text-[10px] font-black tracking-tighter opacity-80">{step.multiple}</span>
                      <span className="text-[12px] font-extrabold -mt-1">{step.cost.toFixed(0)}</span>
                    </div>
                    <div className="text-center mt-3">
                      <span className="text-sm font-black text-prime block">{step.name}</span>
                      <span className="text-[11px] text-sub font-bold">{step.cost.toFixed(2)} USDT</span>
                    </div>
                  </div>

                  {/* Arrow connector between steps (not after the last one) */}
                  {idx < ladderSteps.length - 1 && (
                    <div className="flex flex-col items-center justify-center text-xs font-black text-accent-red bg-surface-elevated px-2.5 py-1.5 rounded-xl border border-border-theme shadow-xs relative z-10 hover:scale-105 transition-transform">
                      <span>×4</span>
                      <span className="text-[9px] text-sub uppercase tracking-tighter">Scale</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile List/Vertical view */}
            <div className="flex md:hidden flex-col space-y-4">
              {ladderSteps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-border-theme bg-surface">
                  <div className="flex items-center space-x-4">
                    <div className={`h-11 w-11 rounded-full border flex flex-col items-center justify-center font-mono ${step.color}`}>
                      <span className="text-[8px] font-bold">{step.multiple}</span>
                      <span className="text-xs font-black">{step.cost.toFixed(0)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-black text-prime block">{step.name} Tier</span>
                      <span className="text-xs text-sub">{step.multiple} of Base Plan</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-accent-red block">{step.cost.toFixed(2)}</span>
                    <span className="text-[10px] text-sub font-bold">USDT Cost</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Accordions */}
        <div id="plans-accordions" className="space-y-6">

          {/* 1. Booster Plan */}
          <div id="plans-accordion-booster" className="border border-border-theme rounded-3xl overflow-hidden bg-surface shadow-sm transition-colors duration-300">
            <button
              id="plans-accordion-booster-trigger"
              onClick={() => setExpandedSection(expandedSection === 'booster' ? null : 'booster')}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none hover:bg-surface-elevated transition-colors"
            >
              <div id="booster-header-group" className="flex items-center space-x-4">
                <div id="booster-header-icon" className="p-3 rounded-2xl bg-accent-red/10 text-accent-red">
                  <Rocket size={24} />
                </div>
                <div>
                  <h3 id="booster-header-title" className="text-xl font-bold text-prime">Booster Plan (4 Upgrade Tiers)</h3>
                  <p id="booster-header-desc" className="text-xs text-sub mt-1">Scale from 1 USDT to 64 USDT to trigger automatic Main Plan entry</p>
                </div>
              </div>
              <div id="booster-header-toggle">
                {expandedSection === 'booster' ? <ChevronUp size={20} className="text-sub" /> : <ChevronDown size={20} className="text-sub" />}
              </div>
            </button>

            {expandedSection === 'booster' && (
              <div id="plans-accordion-booster-content" className="p-6 md:p-8 border-t border-border-theme bg-surface-elevated/40">
                <div id="booster-tiers-grid" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {boosterTiers.map((tier, idx) => (
                    <div
                      key={idx}
                      id={`booster-tier-card-${idx}`}
                      className={`flex flex-col rounded-2xl border bg-surface p-6 shadow-sm transition-transform hover:-translate-y-1 ${tier.accent}`}
                    >
                      <div id={`booster-tier-icon-group-${idx}`} className="flex items-center justify-between mb-4">
                        <span id={`booster-tier-badge-${idx}`} className={`inline-flex items-center px-3 py-1 text-xs font-black rounded-lg ${tier.badgeBg}`}>
                          {tier.costFormula}
                        </span>
                        <div id={`booster-tier-icon-${idx}`} className="p-2 bg-surface-elevated rounded-xl">
                          {tier.icon}
                        </div>
                      </div>

                      <h4 id={`booster-tier-name-${idx}`} className="text-lg font-bold text-prime mb-2">{tier.name}</h4>
                      <p id={`booster-tier-desc-${idx}`} className="text-xs text-sub mb-6 flex-grow leading-relaxed">{tier.description}</p>

                      <div id={`booster-tier-stats-${idx}`} className="space-y-3 pt-4 border-t border-border-theme text-xs font-bold text-prime">
                        <div id={`booster-tier-stat-cost-${idx}`} className="flex justify-between">
                          <span className="text-sub font-normal">Subscription</span>
                          <span className="text-prime">{tier.cost}</span>
                        </div>
                        <div id={`booster-tier-stat-coll-${idx}`} className="flex justify-between">
                          <span className="text-sub font-normal">Collection (5x)</span>
                          <span className="text-prime">{tier.collection}</span>
                        </div>
                        <div id={`booster-tier-stat-up-${idx}`} className="flex justify-between">
                          <span className="text-sub font-normal">Auto Upgrade</span>
                          <span className="text-accent-red">{tier.upgrade}</span>
                        </div>
                        {tier.income && (
                          <div id={`booster-tier-stat-inc-${idx}`} className="flex justify-between pt-2 border-t border-dashed border-border-theme">
                            <span className="text-green-600">Net Profit</span>
                            <span className="text-green-600 font-black">{tier.income}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Main Plan */}
          <div id="plans-accordion-main" className="border border-border-theme rounded-3xl overflow-hidden bg-surface shadow-sm transition-colors duration-300">
            <button
              id="plans-accordion-main-trigger"
              onClick={() => setExpandedSection(expandedSection === 'main' ? null : 'main')}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none hover:bg-surface-elevated transition-colors"
            >
              <div id="main-header-group" className="flex items-center space-x-4">
                <div id="main-header-icon" className="p-3 rounded-2xl bg-accent-red/10 text-accent-red">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 id="main-header-title" className="text-xl font-bold text-prime">Main Plan (100 USDT Entry)</h3>
                  <p id="main-header-desc" className="text-xs text-sub mt-1">Multi-tiered matrix engine with high-volume pool spillovers</p>
                </div>
              </div>
              <div id="main-header-toggle">
                {expandedSection === 'main' ? <ChevronUp size={20} className="text-sub" /> : <ChevronDown size={20} className="text-sub" />}
              </div>
            </button>

            {expandedSection === 'main' && (
              <div id="plans-accordion-main-content" className="p-6 md:p-8 border-t border-border-theme bg-surface-elevated/40">
                <div id="main-allocations-grid" className="grid gap-6 lg:grid-cols-3">
                  {mainPlanAllocations.map((alloc, idx) => (
                    <div
                      key={idx}
                      id={`main-alloc-card-${idx}`}
                      className="rounded-2xl border border-border-theme bg-surface p-6 shadow-sm flex flex-col"
                    >
                      <div id={`main-alloc-header-${idx}`} className="flex items-center justify-between mb-4">
                        <span id={`main-alloc-badge-${idx}`} className="inline-flex items-center px-2.5 py-1 text-xs font-black rounded-lg bg-accent-red/10 text-accent-red">
                          {alloc.percentage}
                        </span>
                        <span id={`main-alloc-amount-${idx}`} className="text-base font-extrabold text-prime">{alloc.amount}</span>
                      </div>
                      
                      <h4 id={`main-alloc-title-${idx}`} className="text-base font-bold text-prime mb-2">{alloc.module}</h4>
                      <p id={`main-alloc-desc-${idx}`} className="text-xs text-sub leading-relaxed mb-4 flex-grow">{alloc.description}</p>
                      
                      <div id={`main-alloc-formula-${idx}`} className="pt-3 border-t border-border-theme text-[11px] text-sub">
                        Formula: <span className="text-prime font-bold">{alloc.formula}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div id="main-plan-note" className="mt-8 p-4 rounded-xl border border-accent-red/20 bg-accent-red/5 text-xs text-accent-red text-center max-w-3xl mx-auto font-medium">
                  Note: The entire system scales proportionally. When the Base Plan input is changed (e.g. from 1 USDT to 10 USDT), all corresponding payouts, subscriptions, and pool allocations are dynamically scaled by that factor.
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ===========================================
            6. EXPANDED FAQ SECTION
           =========================================== */}
        <div id="plans-faq-section" className="mt-20 pt-12 border-t border-border-theme/40">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] font-black bg-accent-red/10 text-accent-red rounded-full uppercase tracking-wider mb-2">
              Learn More
            </span>
            <h3 className="text-2xl font-black text-prime">Frequently Asked Questions</h3>
            <p className="text-sm text-sub mt-2">
              Get clear, direct answers about the system's mathematics, split structures, and placement spillovers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-border-theme rounded-2xl bg-surface overflow-hidden shadow-xs transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-prime hover:bg-surface-elevated/50 transition-colors"
                  >
                    <span className="text-sm md:text-base pr-4">{faq.question}</span>
                    <div>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-accent-red" />
                      ) : (
                        <ChevronDown size={18} className="text-sub" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="p-5 border-t border-border-theme bg-surface-elevated/20 text-xs md:text-sm text-sub leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
