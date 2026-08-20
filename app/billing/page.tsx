'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  FileText,
  Infinity as InfinityIcon,
  RefreshCcw,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';

export default function BillingPage() {
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleStripeCheckout = async (userEmail: string, showToast: (msg: string, type?: 'success' | 'error') => void) => {
    try {
      setIsLoadingStripe(true);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Could not initiate checkout');
      }
    } catch (err: any) {
      console.warn('Stripe checkout error:', err);
      showToast(err?.message || 'Stripe keys not configured. Use the Dev Simulate Pro button below!', 'error');
    } finally {
      setIsLoadingStripe(false);
    }
  };

  const handleSimulatePro = async (
    userEmail: string,
    setPro: boolean,
    fetchSession: () => Promise<void>,
    showToast: (msg: string) => void
  ) => {
    try {
      setIsSimulating(true);
      const res = await fetch('/api/dev/simulate-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, setPro, resetCredits: true }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchSession();
        showToast(setPro ? '🎉 Pro Tier Successfully Activated!' : 'Account set back to Free Tier');
        if (setPro) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <DashboardShell>
      {({ user, fetchSession, showToast }) => {
        const isPro = user.planTier === 'PRO';
        const creditsUsed = user.creditsUsed || 0;
        const usagePercent = isPro ? 100 : Math.min(100, (creditsUsed / 3) * 100);

        return (
          <div className="space-y-8 max-w-5xl">
            
            {/* Header Banner */}
            <div className="pb-6 border-b border-zinc-800">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <CreditCard className="w-6 h-6 text-indigo-400" />
                <span>Billing & Subscription Plans</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Manage your workspace plan tier, credit metering, and payment details.
              </p>
            </div>

            {/* Current Plan & Usage Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Active Tier */}
              <Card className="p-6 border-zinc-800 bg-zinc-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                    Active Plan
                  </span>
                  <span
                    className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase ${
                      isPro
                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                        : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {isPro ? 'Pro Unlimited' : 'Free Trial'}
                  </span>
                </div>

                <div>
                  <div className="text-2xl font-black text-white flex items-center gap-2">
                    <span>{isPro ? '$29 / month' : '$0 / month'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {isPro ? 'Unlimited generations unlocked' : 'Limited to 3 trial generations'}
                  </p>
                </div>

                <div className="pt-2 text-xs text-zinc-400 font-mono">
                  Account: <span className="text-zinc-200">{user.email}</span>
                </div>
              </Card>

              {/* Card 2: Metered Generation Credits */}
              <Card className="p-6 border-zinc-800 bg-zinc-900/60 space-y-4 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                      Credit Usage Meter
                    </span>
                    <span className="text-xs font-bold text-zinc-200">
                      {isPro ? (
                        <span className="text-amber-300 flex items-center gap-1 font-mono">
                          <InfinityIcon className="w-4 h-4" /> Unlimited Runs
                        </span>
                      ) : (
                        <span className="font-mono">{creditsUsed} / 3 Free Runs Used</span>
                      )}
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden my-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPro
                          ? 'bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-500 w-full'
                          : usagePercent >= 100
                          ? 'bg-rose-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: isPro ? '100%' : `${usagePercent}%` }}
                    />
                  </div>

                  <p className="text-xs text-zinc-400">
                    {isPro
                      ? 'You have unrestricted access to all AI models, scraper engines, and multi-format export studios.'
                      : `${Math.max(0, 3 - creditsUsed)} generation remaining before Pro upgrade is required.`}
                  </p>
                </div>

                {/* Quick Simulation Bar for local reviewers */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">
                    ⚡ Dev Simulator:
                  </span>
                  <button
                    onClick={() => handleSimulatePro(user.email, !isPro, fetchSession, showToast)}
                    disabled={isSimulating}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {isSimulating ? 'Updating...' : isPro ? 'Switch to Free Tier' : 'Activate Pro (Instant Demo)'}
                  </button>
                </div>
              </Card>
            </div>

            {/* Pro Upgrade Pricing Tier Banner */}
            {!isPro && (
              <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-purple-950/60 border border-indigo-500/40 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                      Scale Your Content Engine
                    </span>
                    <h2 className="text-2xl font-extrabold text-white">
                      Upgrade to RepurposeAI Pro
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                      Multiply your long-form YouTube videos and articles into high-converting LinkedIn carousels, Twitter threads, video scripts, and newsletter digests without limits.
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                    <div className="text-3xl font-black text-white">
                      $29 <span className="text-sm font-normal text-zinc-400">/ month</span>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      isLoading={isLoadingStripe}
                      onClick={() => handleStripeCheckout(user.email, showToast)}
                      className="shadow-xl shadow-indigo-600/30 py-3 px-6"
                      leftIcon={<Zap className="w-4 h-4 fill-white" />}
                    >
                      <span>Upgrade with Stripe ✨</span>
                    </Button>
                  </div>
                </div>

                {/* Features Included */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-indigo-500/20 text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited AI Generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Visual 4:5 PDF Carousel Builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 Platform Native Formats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Scheduler CSV & JSON Exports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Teleprompter Autoscroll Studio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Google Gemini 3.6 Flash Priority</span>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Comparison Matrix */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Plan Comparison Matrix
              </h2>

              <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/60">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono">
                    <tr>
                      <th className="p-4">Feature</th>
                      <th className="p-4">Free Tier</th>
                      <th className="p-4 text-indigo-400 font-bold">Pro Plan ($29/mo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                    <tr>
                      <td className="p-4 font-semibold text-white">Monthly Repurposing Runs</td>
                      <td className="p-4 text-zinc-400">3 Total Trials</td>
                      <td className="p-4 text-emerald-400 font-bold">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-white">YouTube & Article Scrapers</td>
                      <td className="p-4 text-emerald-400">✓ Included</td>
                      <td className="p-4 text-emerald-400 font-bold">✓ High-Speed Priority</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-white">Visual LinkedIn PDF Carousels</td>
                      <td className="p-4 text-zinc-500">Preview Only</td>
                      <td className="p-4 text-emerald-400 font-bold">✓ 4 Themes & HD Export</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-white">Scheduler CSV (Buffer/Notion)</td>
                      <td className="p-4 text-zinc-500">✕</td>
                      <td className="p-4 text-emerald-400 font-bold">✓ 1-Click Download</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-white">Teleprompter Autoscroll Mode</td>
                      <td className="p-4 text-emerald-400">✓ Included</td>
                      <td className="p-4 text-emerald-400 font-bold">✓ Included</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        );
      }}
    </DashboardShell>
  );
}
