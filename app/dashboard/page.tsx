'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
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
  Table,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { InputForm } from '@/components/dashboard/InputForm';
import { StepProgress, RepurposeStep } from '@/components/dashboard/StepProgress';
import { OutputBundle } from '@/components/dashboard/OutputBundle';
import { TeleprompterModal } from '@/components/ui/TeleprompterModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  GeneratedAssetBundle,
  InputType,
  RepurposeRequestPayload,
} from '@/lib/types';
import {
  exportBundleAsMarkdown,
  exportBundleAsJSON,
  exportBundleAsPDF,
  exportBundleAsCSV,
  copyToClipboard,
  formatBundleToMarkdown,
} from '@/lib/export';

function DashboardContent() {
  const router = useRouter();

  // Repurpose generation state
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<RepurposeStep>('fetching');
  const [currentInputType, setCurrentInputType] = useState<InputType>('YOUTUBE');
  const [generatedBundle, setGeneratedBundle] = useState<GeneratedAssetBundle | null>(null);

  // Teleprompter state
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [teleprompterScript, setTeleprompterScript] = useState('');
  const [teleprompterHook, setTeleprompterHook] = useState('');
  const [isCopyingAll, setIsCopyingAll] = useState(false);

  // Teleprompter opener
  const handleOpenTeleprompter = (script: string, hook: string) => {
    setTeleprompterScript(script);
    setTeleprompterHook(hook);
    setIsTeleprompterOpen(true);
  };

  const handleExportMarkdown = (bundle: GeneratedAssetBundle, showToast: (msg: string) => void) => {
    exportBundleAsMarkdown(bundle);
    showToast('Markdown file downloaded!');
  };

  const handleExportJSON = (bundle: GeneratedAssetBundle, showToast: (msg: string) => void) => {
    exportBundleAsJSON(bundle);
    showToast('JSON file downloaded!');
  };

  const handleExportPDF = async (bundle: GeneratedAssetBundle, showToast: (msg: string) => void) => {
    showToast('Generating executive PDF...');
    await exportBundleAsPDF(bundle);
    showToast('Styled PDF downloaded!');
  };

  const handleExportCSV = (bundle: GeneratedAssetBundle, showToast: (msg: string) => void) => {
    exportBundleAsCSV(bundle);
    showToast('Scheduler CSV file downloaded!');
  };

  const handleCopyAll = async (bundle: GeneratedAssetBundle, showToast: (msg: string) => void) => {
    setIsCopyingAll(true);
    const md = formatBundleToMarkdown(bundle);
    const ok = await copyToClipboard(md);
    setIsCopyingAll(false);
    if (ok) {
      showToast('All distribution assets copied to clipboard!');
    }
  };

  return (
    <DashboardShell>
      {({ user, fetchSession, showToast }) => {
        const creditsRemaining = Math.max(0, (user.creditsMax || 3) - (user.creditsUsed || 0));

        // Handle generation submission
        const handleRepurposeSubmit = async (payload: RepurposeRequestPayload) => {
          if (user.planTier === 'FREE' && user.creditsUsed >= (user.creditsMax || 3)) {
            router.push('/billing');
            return;
          }

          try {
            setIsLoading(true);
            setCurrentInputType(payload.inputType);
            setCurrentStep('fetching');

            const stepTimer1 = setTimeout(() => setCurrentStep('analyzing'), 1200);
            const stepTimer2 = setTimeout(() => setCurrentStep('generating'), 2800);

            const savedApiKey =
              typeof window !== 'undefined'
                ? localStorage.getItem('repurpose_gemini_key') || undefined
                : undefined;

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
                router.push('/billing');
              }
              throw new Error(data.error || 'Generation failed');
            }

            setGeneratedBundle(data);
            setCurrentStep('completed');
            await fetchSession();

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

        return (
          <div className="space-y-6">
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
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push('/history')}
                  leftIcon={<History className="w-3.5 h-3.5 text-zinc-400" />}
                >
                  <span>Library & Runs</span>
                </Button>

                {generatedBundle && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setGeneratedBundle(null)}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    <span>New Run</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Studio Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              
              {/* Left Column: Input Form Studio (5 Cols on large screen) */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-6 border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Input & Strategy</span>
                    </h2>
                    {user.planTier === 'FREE' && (
                      <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/30">
                        {creditsRemaining} of {user.creditsMax || 3} Free Left
                      </span>
                    )}
                  </div>

                  <InputForm
                    onSubmit={handleRepurposeSubmit}
                    isLoading={isLoading}
                    creditsRemaining={creditsRemaining}
                    isPro={user.isPro || user.planTier === 'PRO'}
                    onOpenUpgradeModal={() => router.push('/billing')}
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
                            onClick={() => handleCopyAll(generatedBundle, showToast)}
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
                          <span>Export:</span>
                        </span>

                        <button
                          onClick={() => handleExportMarkdown(generatedBundle, showToast)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                          title="Download clean Markdown file"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Markdown</span>
                        </button>

                        <button
                          onClick={() => handleExportPDF(generatedBundle, showToast)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                          title="Download styled PDF document"
                        >
                          <FileBox className="w-3.5 h-3.5 text-rose-400" />
                          <span>PDF</span>
                        </button>

                        <button
                          onClick={() => handleExportCSV(generatedBundle, showToast)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                          title="Download Scheduler CSV (Buffer/Notion)"
                        >
                          <Table className="w-3.5 h-3.5 text-emerald-400" />
                          <span>CSV</span>
                        </button>

                        <button
                          onClick={() => handleExportJSON(generatedBundle, showToast)}
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

                {/* 3. Empty State Landing */}
                {!isLoading && !generatedBundle && (
                  <Card className="p-12 text-center border-dashed border-zinc-800/80 bg-zinc-900/30 flex flex-col items-center justify-center min-h-[420px] space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner text-zinc-400">
                      <Sparkles className="w-7 h-7 text-indigo-400/80" />
                    </div>
                    <div className="space-y-1.5 max-w-sm">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        Ready to Repurpose
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Paste a YouTube video link or blog article on the left, pick your audience tone, and hit <strong className="text-zinc-200">Generate</strong> to create your distribution bundle.
                      </p>
                    </div>

                    {/* Format pill badges */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono text-zinc-500">
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        💼 LinkedIn Carousel
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        🧵 X Thread
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        🎬 3 Video Scripts
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        🔍 SEO Meta
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        📬 Newsletter
                      </span>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Teleprompter Modal */}
            <TeleprompterModal
              isOpen={isTeleprompterOpen}
              onClose={() => setIsTeleprompterOpen(false)}
              scriptText={teleprompterScript}
              hookText={teleprompterHook}
            />
          </div>
        );
      }}
    </DashboardShell>
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
