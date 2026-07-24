import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, ExternalLink, Quote, Wallet } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  address: string;
  earnings: string;
  quote: string;
  txHash: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Alexandre V.',
    role: 'Leader Tier Sponsor',
    address: '0x8f3C...A063',
    earnings: '$12,450 USDT',
    quote: 'The 100% peer-to-peer payout speed is unreal. As soon as my 5th partner joined, the smart contract executed the auto re-topup and sent funds directly to my wallet in seconds.',
    txHash: '0xa38c7f219b1d309228e57f12e84129b8c0d9a7e6d5c4b3a2109876543210abcd'
  },
  {
    name: 'Elena Rostova',
    role: 'Champion Tier Partner',
    address: '0x3c44...d293',
    earnings: '$38,900 USDT',
    quote: 'The 13-Level forced matrix spillover creates real team momentum. I received $325 USDT matrix level bonuses from spillover nodes I didn’t even recruit directly!',
    txHash: '0x9d2b1f8e6a5c4d3b2a109876543210abcdef1234567890abcdef1234567890ab'
  },
  {
    name: 'Marcus Thorne',
    role: 'Builder Tier Member',
    address: '0x71C7...976F',
    earnings: '$4,200 USDT',
    quote: 'No admin delay and no manual withdrawal buttons. The contract rules are immutable and visible on BscScan. This is the cleanest Web3 matrix engine I’ve ever seen.',
    txHash: '0x7e6d5c4b3a2109876543210abcdef1234567890abcdef1234567890abcdef12'
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials-section" className="py-20 relative bg-surface-elevated/30 border-y border-border-theme">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-500 border border-emerald-500/20 mb-3">
            <ShieldCheck size={14} />
            <span>On-Chain Verified Community Feedback</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-prime sm:text-4xl lg:text-5xl">
            Trusted by <span className="text-accent-red">Web3 Leaders</span> Worldwide
          </h2>
          <p className="mt-4 text-base text-sub leading-relaxed">
            Real feedback from active matrix leaders backed by auditable BNB Smart Chain transactions.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.4 }}
              className="p-8 rounded-3xl bg-surface border border-border-theme shadow-md flex flex-col justify-between relative hover:border-accent-red/30 transition-all"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-mono font-bold">
                    {t.earnings} Earned
                  </span>
                </div>

                <p className="text-xs text-prime italic leading-relaxed mb-6 font-medium">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-border-theme/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-prime">{t.name}</div>
                  <div className="text-[10px] text-sub font-mono">{t.role}</div>
                </div>

                <a
                  href={`https://testnet.bscscan.com/tx/${t.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-surface-elevated text-sub hover:text-accent-red transition-colors flex items-center space-x-1 text-[10px] font-mono"
                >
                  <span>{t.address}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
