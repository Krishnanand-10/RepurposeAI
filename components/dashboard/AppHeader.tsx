import React from 'react';
import { Sparkles, Layers, History, Settings, ExternalLink } from 'lucide-react';
import { CreditBadge } from './CreditBadge';
import { UserSession } from '@/lib/types';

interface AppHeaderProps {
  user: UserSession;
  onOpenUpgradeModal: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onSwitchToLanding: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  onOpenUpgradeModal,
  onOpenHistory,
  onOpenSettings,
  onSwitchToLanding,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSwitchToLanding}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                Repurpose<span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium block -mt-0.5">
                Workspace / Studio
              </span>
            </div>
          </button>
        </div>

        {/* Right: Actions, Credits & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Credit Usage Badge */}
          <CreditBadge
            planTier={user.planTier}
            creditsUsed={user.creditsUsed}
            creditsMax={user.creditsMax}
            onUpgradeClick={onOpenUpgradeModal}
          />

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
            title="View Generation History"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Library</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title="Workspace Settings & API Keys"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
            />
            <span className="text-xs font-semibold text-zinc-200 hidden md:block max-w-[120px] truncate">
              {user.name.split(' ')[0]}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
