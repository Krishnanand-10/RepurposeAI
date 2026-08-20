import React from 'react';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InteractivePreview } from './InteractivePreview';

interface HeroProps {
  onStartFreeTrial: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartFreeTrial }) => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>⚡ Powered by Gemini Flash & Next.js 14</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Turn Any Long-Form Content into{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Viral Social Assets
          </span>{' '}
          in Seconds
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed">
          Paste a YouTube link or blog post. Instantly get a LinkedIn summary, X thread, video hooks, and SEO meta descriptions ready to publish.
        </p>

        {/* Primary Single CTA */}
        <div className="flex items-center justify-center pt-2">
          <Button
            size="lg"
            onClick={onStartFreeTrial}
            className="w-full sm:w-auto px-10 py-4 text-base font-bold shadow-xl shadow-indigo-600/30"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            <span>Start Free Trial (3 Generations)</span>
          </Button>
        </div>

        {/* Trust bullets */}
        <div className="flex items-center justify-center gap-6 text-xs text-zinc-500 flex-wrap pt-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>5 Distribution Formats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Markdown & PDF Export</span>
          </div>
        </div>

        {/* Interactive Mock Preview */}
        <div className="pt-8">
          <InteractivePreview />
        </div>

      </div>
    </section>
  );
};
