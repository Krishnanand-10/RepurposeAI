'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  Layers,
  Youtube,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Download,
  Check,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GeneratedAssetBundle } from '@/lib/types';

export default function HistoryPage() {
  const router = useRouter();
  const [generations, setGenerations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'YOUTUBE' | 'BLOG' | 'TEXT'>('ALL');
  const [selectedBundle, setSelectedBundle] = useState<GeneratedAssetBundle | null>(null);

  const fetchGenerations = async (userEmail = 'creator@repurpose.ai') => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/generations?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setGenerations(data.generations || []);
      }
    } catch (err) {
      console.warn('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent, showToast: (msg: string) => void) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this generation?')) return;

    try {
      const res = await fetch(`/api/generations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGenerations((prev) => prev.filter((g) => g.id !== id));
        if (selectedBundle?.title && generations.find((g) => g.id === id)?.sourceTitle === selectedBundle.title) {
          setSelectedBundle(null);
        }
        showToast('Generation removed from library');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = generations.filter((gen) => {
    const matchesSearch =
      (gen.sourceTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gen.originalContentSummary || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || gen.inputType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardShell>
      {({ user, showToast }) => {
        useEffect(() => {
          fetchGenerations(user.email);
        }, [user.email]);

        return (
          <div className="space-y-8">
            
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                  <History className="w-6 h-6 text-indigo-400" />
                  <span>Generation History & Library</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Access, review, and re-export past multi-platform distribution packages.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard')}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                <span>New Generation</span>
              </Button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, topic or keywords..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder:text-zinc-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Type Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
                {(['ALL', 'YOUTUBE', 'BLOG', 'TEXT'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      filterType === type
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    }`}
                  >
                    {type === 'ALL' ? 'All Formats' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Content List / Table */}
            {isLoading ? (
              <div className="py-20 text-center text-zinc-500 space-y-3">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono">Loading saved generations...</p>
              </div>
            ) : filtered.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-zinc-800 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <History className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">No generations found</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    {searchQuery
                      ? 'No past outputs match your search query.'
                      : 'You haven\'t repurposed any content yet. Head to the Studio to generate your first asset bundle!'}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="mt-2"
                >
                  <span>Go to Studio ✨</span>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((gen) => {
                  const dateFormatted = new Date(gen.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={gen.id}
                      onClick={() => {
                        // Reconstruct bundle object and navigate or view
                        router.push('/dashboard');
                      }}
                      className="group p-5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-sm hover:shadow-indigo-500/5"
                    >
                      <div className="space-y-3">
                        {/* Type & Date */}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 uppercase">
                            {gen.inputType === 'YOUTUBE' && <Youtube className="w-3 h-3 text-rose-400" />}
                            {gen.inputType === 'BLOG' && <FileText className="w-3 h-3 text-sky-400" />}
                            {gen.inputType === 'TEXT' && <Sparkles className="w-3 h-3 text-amber-400" />}
                            <span>{gen.inputType}</span>
                          </span>

                          <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{dateFormatted}</span>
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                          {gen.sourceTitle || 'Repurposed Content'}
                        </h3>

                        {/* Summary preview */}
                        {gen.originalContentSummary && (
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {gen.originalContentSummary}
                          </p>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                        <span className="text-[11px] font-mono text-zinc-400">
                          Tone: <span className="text-zinc-200 capitalize">{gen.tone || 'Engaging'}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDelete(gen.id, e, showToast)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                            title="Delete generation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }}
    </DashboardShell>
  );
}
