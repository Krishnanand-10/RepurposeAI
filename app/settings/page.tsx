'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Save,
  Trash2,
  Shield,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [name, setName] = useState('Alex Vance');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('repurpose_creator_name');
      if (savedName) setName(savedName);
    }
  }, []);

  const handleSaveProfile = (showToast: (msg: string) => void) => {
    setIsSaving(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('repurpose_creator_name', name.trim() || 'Alex Vance');
    }
    setTimeout(() => {
      setIsSaving(false);
      showToast('✅ Creator profile updated!');
    }, 300);
  };

  const handleClearHistory = async (userEmail: string, showToast: (msg: string) => void) => {
    if (!confirm('Are you sure you want to delete all past generation runs from your library?')) return;

    try {
      const res = await fetch(`/api/generations?email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('🧹 Library history cleared successfully');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to clear history');
    }
  };

  return (
    <DashboardShell>
      {({ user, showToast }) => (
        <div className="space-y-8 max-w-3xl">
          
          {/* Header Banner */}
          <div className="pb-6 border-b border-zinc-800">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <SettingsIcon className="w-6 h-6 text-indigo-400" />
              <span>Workspace Settings</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage your creator profile and workspace data.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Section 1: Creator Profile */}
            <Card className="p-6 border-zinc-800 bg-zinc-900/60 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Creator Profile</h2>
                  <p className="text-xs text-zinc-400">
                    Your personal workspace identity and author attribution.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">
                    Workspace Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  isLoading={isSaving}
                  onClick={() => handleSaveProfile(showToast)}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  <span>Save Profile</span>
                </Button>
              </div>
            </Card>

            {/* Section 2: Data Management & Danger Zone */}
            <Card className="p-6 border-rose-950/60 bg-rose-950/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-rose-300">Clear Library History</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Permanently delete all past scraped transcripts and saved asset bundles.
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleClearHistory(user.email, showToast)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  <span>Clear All History</span>
                </Button>
              </div>
            </Card>

          </div>

        </div>
      )}
    </DashboardShell>
  );
}
