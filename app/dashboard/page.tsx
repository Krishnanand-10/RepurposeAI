'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Download,
  FileText,
  FileCode,
  FileBox,
  Copy,
  Check,
  RotateCcw,
  History,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { AppHeader } from '@/components/dashboard/AppHeader';
import { InputForm } from '@/components/dashboard/InputForm';
import { StepProgress, RepurposeStep } from '@/components/dashboard/StepProgress';
import { OutputBundle } from '@/components/dashboard/OutputBundle';
import { HistoryDrawer } from '@/components/dashboard/HistoryDrawer';
import { SettingsModal } from '@/components/dashboard/SettingsModal';
import { UpgradeModal } from '@/components/ui/UpgradeModal';
import { TeleprompterModal } from '@/components/ui/TeleprompterModal';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  GeneratedAssetBundle,
  InputType,
  RepurposeRequestPayload,
  UserSession,
} from '@/lib/types';
import {
  exportBundleAsMarkdown,
  exportBundleAsJSON,
  exportBundleAsPDF,
  copyToClipboard,
  formatBundleToMarkdown,
} from '@/lib/export';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // User state
  const [user, setUser] = useState<UserSession>({
    id: 'guest_user',
    email: 'creator@repurpose.ai',
    name: 'Alex Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    planTier: 'FREE',
    creditsUsed: 0,
    creditsMax: 3,
    isPro: false,
  });

  // Repurpose generation state
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<RepurposeStep>('fetching');
  const [currentInputType, setCurrentInputType] = useState<InputType>('YOUTUBE');
  const [generatedBundle, setGeneratedBundle] = useState<GeneratedAssetBundle | null>(null);

  // Modals & Drawers state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [teleprompterScript, setTeleprompterScript] = useState('');
  const [teleprompterHook, setTeleprompterHook] = useState('');

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [isCopyingAll, setIsCopyingAll] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Fetch session on load
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

    if (searchParams.get('upgrade') === 'pro' || searchParams.get('upgrade') === 'success') {
      if (searchParams.get('upgrade') === 'success') {
        showToast('🎉 Upgrade to Pro successful! Enjoy unlimited generations.');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        setIsUpgradeModalOpen(true);
      }
    }
  }, [searchParams]);

  // Handle generation submission
  const handleRepurposeSubmit = async (payload: RepurposeRequestPayload) => {
    // Check credit limits
    if (user.planTier === 'FREE' && user.creditsUsed >= user.creditsMax) {
      setIsUpgradeModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      setCurrentInputType(payload.inputType);
      setCurrentStep('fetching');

      // Step progress intervals
      const stepTimer1 = setTimeout(() => setCurrentStep('analyzing'), 1200);
      const stepTimer2 = setTimeout(() => setCurrentStep('generating'), 2800);

      // Retrieve locally saved user API key if any
      const savedApiKey = typeof window !== 'undefined' ? localStorage.getItem('repurpose_gemini_key') || undefined : undefined;

      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          userEmail: user.email,
          userApiKey: savedApiKey,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();

      if (!res.ok) {
        if (data.isLimitReached) {
          setIsUpgradeModalOpen(true);
        }
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedBundle(data);
      setCurrentStep('completed');
      
      // Update session credit count
      await fetchSession();

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });

      showToast('⚡ Asset Bundle Generated Successfully!');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to generate assets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Teleprompter opener
  const handleOpenTeleprompter = (script: string, hook: string) => {
    setTeleprompterScript(script);
    setTeleprompterHook(hook);
    setIsTeleprompterOpen(true);
  };

  // Export handlers
  const handleExportMarkdown = () => {
    if (!generatedBundle) return;
    exportBundleAsMarkdown(generatedBundle);
    showToast('Markdown file downloaded!');
  };

  const handleExportJSON = () => {
    if (!generatedBundle) return;
    exportBundleAsJSON(generatedBundle);
    showToast('JSON file downloaded!');
  };

  const handleExportPDF = async () => {
    if (!generatedBundle) return;
    showToast('Generating executive PDF...');
    await exportBundleAsPDF(generatedBundle);
    showToast('Styled PDF downloaded!');
  };

  const handleCopyAll = async () => {
    if (!generatedBundle) return;
    setIsCopyingAll(true);
    const md = formatBundleToMarkdown(generatedBundle);
    const ok = await copyToClipboard(md);
    setIsCopyingAll(false);
    if (ok) {
      showToast('All 5 distribution assets copied to clipboard!');
    }
  };

  // Simulate Pro handler for reviewer
  const handleSimulatePro = async () => {
    try {
      const res = await fetch('/api/dev/simulate-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, setPro: true }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchSession();
        setIsUpgradeModalOpen(false);
        showToast('🚀 Pro Tier successfully unlocked for this workspace!');
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to simulate pro tier', 'error');
    }
  };

  const creditsRemaining = Math.max(0, user.creditsMax - user.creditsUsed);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <AppHeader
        user={user}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSwitchToLanding={() => router.push('/')}
      />

      {/* Main Studio Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Studio Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Repurposing Studio</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold">
                v1.0
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Transform 1 YouTube video or article into LinkedIn posts, X threads, video scripts & SEO meta.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              <History className="w-3.5 h-3.5 text-zinc-400" />
              <span>Previous Runs</span>
            </button>

            {generatedBundle && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setGeneratedBundle(null)}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                <span>New Generation</span>
              </Button>
            )}
          </div>
        </div>

        {/* Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          
          {/* Left Column: Input Form Studio (5 Cols on large screen) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Input & Strategy</span>
                </h2>
                {user.planTier === 'FREE' && (
                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/30">
                    {creditsRemaining} of {user.creditsMax} Free Credits Left
                  </span>
                )}
              </div>

              <InputForm
                onSubmit={handleRepurposeSubmit}
                isLoading={isLoading}
                creditsRemaining={creditsRemaining}
                isPro={user.isPro || user.planTier === 'PRO'}
                onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              />
            </Card>
          </div>

          {/* Right Column: Output Hub / Asset Distribution Center (7 Cols on large screen) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Loading Step Progress */}
            {isLoading && (
              <Card className="p-8 border-indigo-500/30 bg-zinc-900/80">
                <StepProgress currentStep={currentStep} inputType={currentInputType} />
              </Card>
            )}

            {/* 2. Generated Asset Bundle */}
            {!isLoading && generatedBundle && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Bundle Header & Export Toolbar */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                        {generatedBundle.inputType} &bull; {generatedBundle.tone}
                      </span>
                      <h2 className="text-lg font-bold text-white mt-1.5 line-clamp-2">
                        {generatedBundle.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCopyAll}
                        leftIcon={
                          isCopyingAll ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )
                        }
                      >
                        <span>Copy All</span>
                      </Button>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-850">
                    {generatedBundle.summary}
                  </p>

                  {/* Export Options Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-850">
                    <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mr-2">
                      <Download className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Export Studio:</span>
                    </span>

                    <button
                      onClick={handleExportMarkdown}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                      title="Download clean Markdown file"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Markdown (.md)</span>
                    </button>

                    <button
                      onClick={handleExportPDF}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                      title="Download styled PDF document"
                    >
                      <FileBox className="w-3.5 h-3.5 text-rose-400" />
                      <span>Styled PDF</span>
                    </button>

                    <button
                      onClick={handleExportJSON}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                      title="Download structured JSON"
                    >
                      <FileCode className="w-3.5 h-3.5 text-amber-400" />
                      <span>JSON</span>
                    </button>
                  </div>
                </div>

                {/* Multi-Tab Asset Display */}
                <OutputBundle
                  bundle={generatedBundle}
                  onOpenTeleprompter={handleOpenTeleprompter}
                  onCopiedToast={showToast}
                />

              </div>
            )}

            {/* 3. Empty State (When no generation has taken place yet) */}
            {!isLoading && !generatedBundle && (
              <div className="p-12 rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <Sparkles className="w-7 h-7 text-indigo-400/80 animate-pulse" />
                </div>

                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-white">
                    Ready to Repurpose
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Paste a YouTube link or blog article on the left, pick your audience tone, and hit <strong>Generate Assets</strong> to create your distribution bundle.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-500">
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">💼 LinkedIn Carousel</span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">🐦 X Thread</span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">🎬 3 Video Scripts</span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">🔍 SEO Meta</span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">📧 Newsletter</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Modals & Overlays */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        userEmail={user.email}
        onSimulatePro={handleSimulatePro}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        userEmail={user.email}
        onSelectGeneration={(b) => setGeneratedBundle(b)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userEmail={user.email}
        onResetCredits={fetchSession}
        onSavedToast={showToast}
      />

      <TeleprompterModal
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
        scriptText={teleprompterScript}
        hookText={teleprompterHook}
      />

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
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 animate-pulse flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs font-mono">Loading RepurposeAI Studio...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
