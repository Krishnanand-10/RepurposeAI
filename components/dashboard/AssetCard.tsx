import React, { useState } from 'react';
import { Copy, Check, Share2, Sparkles } from 'lucide-react';

interface AssetCardProps {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  copyContent: string;
  onCopied?: () => void;
  charCount?: number;
  maxCharCount?: number;
  actions?: React.ReactNode;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  title,
  icon,
  badge,
  children,
  copyContent,
  onCopied,
  charCount,
  maxCharCount,
  actions,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyContent);
      setCopied(true);
      if (onCopied) onCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const isOverLimit = maxCharCount && charCount && charCount > maxCharCount;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl transition-all hover:border-zinc-700/80 group">
      
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-indigo-400">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
            {badge && (
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {charCount !== undefined && (
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                isOverLimit
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              {charCount} {maxCharCount ? `/ ${maxCharCount}` : 'chars'}
            </span>
          )}

          {actions}

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              copied
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-zinc-800 hover:bg-zinc-700/80 border-zinc-700 text-zinc-200 hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="text-zinc-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};
