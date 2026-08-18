import React, { useState, useEffect } from 'react';
import { X, Trash2, ExternalLink, Calendar, Sparkles, Youtube, FileText, Type } from 'lucide-react';
import { GeneratedAssetBundle } from '@/lib/types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSelectGeneration: (bundle: GeneratedAssetBundle) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  userEmail,
  onSelectGeneration,
}) => {
  const [generations, setGenerations] = useState<GeneratedAssetBundle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/generations?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.generations) {
        setGenerations(data.generations);
      }
    } catch (err) {
      console.error('Fetch history error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, userEmail]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/generations/${id}`, { method: 'DELETE' });
      setGenerations((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (!isOpen) return null;

  const filtered = generations.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>📚 Generation Library</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {generations.length} saved distribution bundles
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-zinc-850">
            <input
              type="text"
              placeholder="Search previous generations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="text-center py-12 text-zinc-500 text-xs">
                Loading saved bundles...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs space-y-2">
                <Sparkles className="w-6 h-6 text-zinc-600 mx-auto" />
                <p>No generations found</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectGeneration(item);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-850/80 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-zinc-800 text-indigo-400 text-xs">
                        {item.inputType === 'YOUTUBE' ? (
                          <Youtube className="w-3.5 h-3.5" />
                        ) : item.inputType === 'BLOG' ? (
                          <FileText className="w-3.5 h-3.5" />
                        ) : (
                          <Type className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        {item.tone}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(item.id!, e)}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete from Library"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="text-[10px] text-zinc-500 font-mono pt-1 flex items-center justify-between">
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                    <span className="text-indigo-400 font-semibold group-hover:underline">
                      Load Assets &rarr;
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
