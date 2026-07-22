import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'General' | 'Security' | 'Payouts' | 'Matrix';
}

const faqs: FaqItem[] = [
  {
    category: 'General',
    question: 'What is SimpleOn and how does it work?',
    answer: 'SimpleOn is a 100% decentralized Web3 smart contract income engine running on BNB Smart Chain. It combines a 5-partner fast booster plan with a 13-Level forced 3x3 matrix to distribute USDT earnings peer-to-peer with zero platform retention.'
  },
  {
    category: 'Payouts',
    question: 'How are USDT commissions paid out?',
    answer: 'All payouts occur instantly on-chain in BEP-20 USDT directly to your connected Web3 wallet address. There are no manual withdrawal requests, waiting periods, or admin approvals required.'
  },
  {
    category: 'Matrix',
    question: 'What is the 5-Partner Cycle and Auto Re-Topup?',
    answer: 'Each Booster Tier position requires 5 partner placements to complete a cycle. Upon the 5th placement, the smart contract automatically uses reserved funds to re-topup your slot, allowing you to cycle repeatedly without re-depositing.'
  },
  {
    category: 'Security',
    question: 'Is the smart contract audited and secure?',
    answer: 'Yes! The smart contract is open-source, fully verified on BscScan, and audited for vulnerability vectors like ReentrancyGuard, SafeERC20 logic, and SIWE EIP-712 nonce authentication.'
  },
  {
    category: 'Matrix',
    question: 'What is the 13-Level Forced Matrix Spillover?',
    answer: 'When upline sponsors or team members refer additional partners beyond their top 3 direct positions, those new positions automatically spill over into the next available slot down the tree, earning level bonuses for everyone above them.'
  },
  {
    category: 'General',
    question: 'What wallet do I need to get started?',
    answer: 'You can use any standard EVM-compatible Web3 wallet, such as MetaMask, Trust Wallet, or Binance Web3 Wallet, configured for BNB Smart Chain (BSC Testnet or Mainnet).'
  }
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-20 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full bg-accent-blue/10 px-3.5 py-1.5 text-xs font-bold text-accent-blue border border-accent-blue/20 mb-3">
            <HelpCircle size={14} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-prime sm:text-4xl lg:text-5xl">
            Everything You Need to <span className="text-accent-red">Know</span>
          </h2>
          <p className="mt-4 text-base text-sub leading-relaxed">
            Transparent answers regarding smart contract mechanics, payouts, matrices, and security.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-surface border border-border-theme overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 hover:bg-surface-elevated/50 transition-colors"
                >
                  <span className="text-base font-extrabold text-prime flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-accent-red bg-accent-red/10 px-2.5 py-1 rounded-full shrink-0">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-sub shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent-red' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-xs text-sub leading-relaxed border-t border-border-theme/40 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
