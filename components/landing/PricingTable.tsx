import React from 'react';
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PricingTableProps {
  onSelectFree: () => void;
  onSelectPro: () => void;
}

export const PricingTable: React.FC<PricingTableProps> = ({ onSelectFree, onSelectPro }) => {
  return (
    <section id="pricing" className="py-20 border-t border-zinc-850 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
            Simple & Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Scale Your Content Distribution Today
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Start for free with 3 complete multi-platform generation bundles. Upgrade anytime for unlimited publishing power.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Free Starter</h3>
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold">
                  Trial
                </span>
              </div>

              <div className="text-3xl font-extrabold text-white">
                $0 <span className="text-sm font-normal text-zinc-400">/ forever</span>
              </div>

              <p className="text-xs text-zinc-400">
                Ideal for testing the multi-platform AI pipeline on your top video or article.
              </p>

              <div className="space-y-3 pt-4 border-t border-zinc-800">
                {[
                  '3 Free Multi-Format Generations',
                  'YouTube & Blog Article Scrapers',
                  'LinkedIn, Twitter Thread & 3 Video Hooks',
                  'SEO Meta Description & Keywords',
                  '1-Click Clipboard Copy & Markdown Export',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="secondary" onClick={onSelectFree} className="w-full font-bold">
              <span>Start Free (No Card Needed)</span>
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/70 via-zinc-900 to-zinc-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Pro Unlimited</span>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </h3>
              </div>

              <div className="text-3xl font-extrabold text-white">
                $19 <span className="text-sm font-normal text-zinc-400">/ month</span>
              </div>

              <p className="text-xs text-zinc-300">
                For creators, agency founders, and marketers looking to dominate social feeds.
              </p>

              <div className="space-y-3 pt-4 border-t border-indigo-500/30">
                {[
                  'Unlimited AI Repurposing Generations',
                  'Priority Google Gemini 1.5 Flash Speed',
                  'Interactive Teleprompter Recording Mode',
                  'Styled PDF, Markdown & JSON Exports',
                  'Audience Tone & Creator Style Profiles',
                  'Full Saved Library & Generation History',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={onSelectPro}
              size="lg"
              className="w-full font-bold shadow-xl shadow-indigo-600/40"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              <span>Upgrade to Pro ($19/mo)</span>
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
};
