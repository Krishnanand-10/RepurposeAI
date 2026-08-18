import React from 'react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface CreditBadgeProps {
  planTier: 'FREE' | 'PRO';
  creditsUsed: number;
  creditsMax: number;
  onUpgradeClick?: () => void;
}

export const CreditBadge: React.FC<CreditBadgeProps> = ({
  planTier,
  creditsUsed,
  creditsMax,
  onUpgradeClick,
}) => {
  const isPro = planTier === 'PRO';

  if (isPro) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-sm">
        <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
        <span>PRO UNLIMITED</span>
      </div>
    );
  }

  const remaining = Math.max(0, creditsMax - creditsUsed);
  const isExhausted = remaining === 0;

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
          isExhausted
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 ${isExhausted ? 'text-rose-400' : 'text-indigo-400'}`} />
        <span>
          <strong className="text-white font-bold">{creditsUsed}</strong> / {creditsMax} Free Used
        </span>
      </div>

      {isExhausted && onUpgradeClick && (
        <button
          onClick={onUpgradeClick}
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 animate-pulse"
        >
          Upgrade ⚡
        </button>
      )}
    </div>
  );
};
