'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, History, CreditCard, Settings } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Toast } from '@/components/ui/Toast';
import { UserSession } from '@/lib/types';

interface DashboardShellProps {
  children: (props: {
    user: UserSession;
    fetchSession: () => Promise<void>;
    showToast: (msg: string, type?: 'success' | 'error') => void;
  }) => React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [user, setUser] = useState<UserSession>({
    id: 'guest',
    email: 'creator@repurpose.ai',
    name: 'Alex Vance',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    planTier: 'PRO',
    creditsUsed: 0,
    creditsMax: 999999,
    isPro: true,
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const fetchSession = async () => {
    try {
      const res = await fetch(`/api/auth/session?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.warn('Could not load session:', err);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex selection:bg-indigo-500 selection:text-white">
      
      {/* Desktop Persistent Sidebar (hidden on small screens) */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-white">
              Repurpose<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Slide-out Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-50 bg-zinc-950/95 backdrop-blur-xl p-6 space-y-4 border-b border-zinc-800">
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold ${
                  pathname === '/dashboard' ? 'bg-indigo-600/20 text-indigo-300' : 'text-zinc-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Studio</span>
              </Link>

              <Link
                href="/history"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold ${
                  pathname === '/history' ? 'bg-indigo-600/20 text-indigo-300' : 'text-zinc-400'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History & Library</span>
              </Link>

              <Link
                href="/billing"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold ${
                  pathname === '/billing' ? 'bg-indigo-600/20 text-indigo-300' : 'text-zinc-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Billing & Plans</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold ${
                  pathname === '/settings' ? 'bg-indigo-600/20 text-indigo-300' : 'text-zinc-400'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children({ user, fetchSession, showToast })}
        </main>
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
