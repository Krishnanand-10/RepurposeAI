import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  History,
  CreditCard,
  Settings,
  ArrowUpRight,
  Zap,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { UserSession } from '@/lib/types';

interface SidebarProps {
  user: UserSession;
  onOpenUpgradeModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onOpenUpgradeModal }) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Studio',
      href: '/dashboard',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'v1.0',
    },
    {
      name: 'History',
      href: '/history',
      icon: <History className="w-4 h-4" />,
    },
    {
      name: 'Billing & Plans',
      href: '/billing',
      icon: <CreditCard className="w-4 h-4" />,
      highlight: user.planTier === 'FREE',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const isPro = user.planTier === 'PRO';
  const creditsUsed = user.creditsUsed || 0;
  const creditsMax = user.creditsMax || 3;
  const usagePercent = isPro ? 100 : Math.min(100, (creditsUsed / 3) * 100);

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-850 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      
      {/* Top: Brand Logo */}
      <div>
        <div className="p-5 border-b border-zinc-850/80">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1">
                Repurpose<span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block -mt-0.5">
                WORKSPACE
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Platform
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-indigo-400' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-850 text-zinc-400">
                    {item.badge}
                  </span>
                )}

                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Plan Status, Usage Bar & User Account */}
      <div className="p-4 border-t border-zinc-850 space-y-3">
        
        {/* Usage Progress Card */}
        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              {isPro ? (
                <>
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-300 font-bold">Pro Plan</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Free Tier</span>
                </>
              )}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {isPro ? 'Unlimited' : `${creditsUsed} / 3 Runs`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isPro
                  ? 'bg-gradient-to-r from-amber-400 to-indigo-500 w-full'
                  : usagePercent >= 100
                  ? 'bg-rose-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: isPro ? '100%' : `${usagePercent}%` }}
            />
          </div>

          {!isPro && (
            <Link
              href="/billing"
              className="mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-[11px] font-bold text-indigo-300 transition-colors"
            >
              <span>Upgrade to Pro</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* User Profile Tile */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-850">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-7 h-7 rounded-full border border-zinc-700 object-cover shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-zinc-200 truncate">
                {user.name}
              </div>
              <div className="text-[10px] text-zinc-400 truncate">
                {user.email}
              </div>
            </div>
          </div>

          <Link
            href="/"
            title="Landing Page"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </aside>
  );
};
