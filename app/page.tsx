'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Youtube,
  FileText,
  Share2,
  CheckCircle2,
  Zap,
  ArrowRight,
  TrendingUp,
  Sliders,
  Download,
  Video,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { PricingTable } from '@/components/landing/PricingTable';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();

  const handleLaunchStudio = () => {
    router.push('/dashboard');
  };

  const handleScrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPro = () => {
    router.push('/dashboard?upgrade=pro');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onLaunchStudio={handleLaunchStudio}
        onScrollToPricing={handleScrollToPricing}
      />

      {/* Hero Section */}
      <Hero
        onStartFreeTrial={handleLaunchStudio}
      />

      {/* Section 2: How It Works */}
      <section id="how-it-works" className="py-20 border-t border-zinc-900 bg-zinc-950/60 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Simple 3-Step Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Raw Media to Complete Distribution in Seconds
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
              Stop spending 8 hours manually re-writing your content for 5 different algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 space-y-4 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Input Source Content</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Paste any YouTube video link, article URL, podcast transcript, or raw founder notes. Our scrapers extract the core signal automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 space-y-4 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Gemini Flash AI Synthesis</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Our model analyzes key takeaways, contrarian hooks, and audience resonance based on your selected tone and target niche.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 space-y-4 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Publish & Export Anywhere</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Copy formatted LinkedIn posts, X threads, record with built-in Teleprompter mode, or export complete Markdown, PDF, and JSON packages.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Section 3: Feature Highlights */}
      <section id="features" className="py-20 border-t border-zinc-900 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Built For Modern Creators
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              5 Platform-Native Assets from 1 Input
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">LinkedIn Hook & Post Engine</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generates high-CTR opening hooks, digestible paragraph spacing, takeaways, and optimized hashtags.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Twitter / X Thread Sequence</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Strict 280-character limit enforcement, numbered thread structure, and viral CTA closing tweets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">3 Video Scripts + Teleprompter</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                30-60s TikTok & Reel hooks, B-roll cues, audio voiceover scripts, and real-time scrolling teleprompter.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">SEO Meta Description Pack</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Search-optimized page titles, 155-char meta descriptions, keyword tags, and URL slug suggestions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Newsletter Executive Brief</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Fast TL;DR summaries, key actionable learnings, and highlight soundbites for Substack or Beehiiv.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">All Export Formats</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Export to styled PDF with custom letterheads, Markdown (.md), clean JSON, or 1-click clipboard formats.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <PricingTable
        onSelectFree={handleLaunchStudio}
        onSelectPro={handleSelectPro}
      />

      {/* Final CTA Banner */}
      <section className="py-16 border-t border-zinc-900 bg-gradient-to-b from-zinc-950 to-indigo-950/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to 10x your content output?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
            Test RepurposeAI free with 3 complete multi-platform generation bundles right in your browser.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              onClick={handleLaunchStudio}
              className="px-8 py-4 text-base font-bold shadow-2xl shadow-indigo-600/40"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              <span>Get Started Free</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-900 bg-zinc-950 text-zinc-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-zinc-300">RepurposeAI</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-zinc-300 transition-colors">
              Features
            </a>
            <button onClick={handleScrollToPricing} className="hover:text-zinc-300 transition-colors">
              Pricing
            </button>
            <button onClick={handleLaunchStudio} className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Get Started &rarr;
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
