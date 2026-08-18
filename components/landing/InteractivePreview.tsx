import React, { useState } from 'react';
import { Youtube, Twitter, Linkedin, Video, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';

export const InteractivePreview: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const mockTweet = `1/ The Golden Rule of Modern Distribution:\n\nNever publish a 20-minute video or 2,000-word article without generating at least 5 derivative assets.\n\nYour audience doesn't live on one feed. Meet them where they already scroll. 🧵👇`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mockTweet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-zinc-900/90 border border-zinc-800 p-4 sm:p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-zinc-500 ml-2">Repurpose Studio Live Preview</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Gemini AI Pipeline</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Input Source */}
        <div className="md:col-span-5 space-y-3.5 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5">
              <Youtube className="w-4 h-4 text-red-500" />
              Source Video
            </span>
            <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
              18:42 mins
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="text-xs font-bold text-white line-clamp-1">
              How to Build & Scale AI SaaS in 2026
            </div>
            <div className="text-[11px] text-zinc-400 line-clamp-2">
              Deep dive into architecture, prompt pipelines, LLM structured JSON output, and Stripe monetization.
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[11px] flex items-center justify-between">
            <span>✨ Extracted 3,420 words of transcript</span>
            <span className="font-mono text-[10px]">0.8s</span>
          </div>
        </div>

        {/* Center: Transformation Arrow */}
        <div className="md:col-span-2 flex justify-center py-2 md:py-0">
          <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-600/20">
            <ArrowRight className="w-5 h-5 hidden md:block" />
            <Sparkles className="w-5 h-5 md:hidden" />
          </div>
        </div>

        {/* Right: Transformed Asset Output */}
        <div className="md:col-span-5 space-y-3.5 p-4 rounded-2xl bg-zinc-950/80 border border-indigo-500/30 shadow-xl shadow-indigo-600/5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Twitter className="w-4 h-4 text-sky-400" />
              Viral Tweet Hook (1/6)
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
            {mockTweet}
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">✓ 248/280 chars</span>
              <span>&bull; Ready to publish</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
