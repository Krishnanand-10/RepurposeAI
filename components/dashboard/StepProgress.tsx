import React from 'react';
import { Loader2, CheckCircle2, Youtube, Sparkles, FileText, Check } from 'lucide-react';

export type RepurposeStep = 'fetching' | 'analyzing' | 'generating' | 'completed';

interface StepProgressProps {
  currentStep: RepurposeStep;
  inputType: 'YOUTUBE' | 'BLOG' | 'TEXT';
}

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep, inputType }) => {
  const steps = [
    {
      id: 'fetching',
      label:
        inputType === 'YOUTUBE'
          ? 'Fetching YouTube transcript & captions...'
          : inputType === 'BLOG'
          ? 'Scraping article & extracting body text...'
          : 'Cleaning & tokenizing raw transcript...',
      icon: <Youtube className="w-4 h-4" />,
    },
    {
      id: 'analyzing',
      label: 'Analyzing key takeaways & core frameworks with Gemini AI...',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'generating',
      label: 'Synthesizing LinkedIn, Twitter Thread, Video Hooks & SEO pack...',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const getStepStatus = (stepId: string) => {
    const order = ['fetching', 'analyzing', 'generating', 'completed'];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(stepId);

    if (currentIndex > stepIndex) return 'done';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/95 border border-indigo-500/30 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">AI Repurposing Engine Active</h4>
          <p className="text-xs text-zinc-400">Transforming your source content into distribution assets</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {steps.map((s, idx) => {
          const status = getStepStatus(s.id);
          return (
            <div
              key={s.id}
              className={`flex items-center gap-3 text-xs p-3 rounded-xl transition-all duration-300 ${
                status === 'active'
                  ? 'bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 shadow-sm'
                  : status === 'done'
                  ? 'bg-zinc-900/50 border border-zinc-800 text-zinc-400'
                  : 'bg-zinc-950/40 border border-zinc-900 text-zinc-600'
              }`}
            >
              <div className="shrink-0">
                {status === 'done' ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : status === 'active' ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-zinc-800 text-zinc-600 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </div>
                )}
              </div>
              <span className="font-medium flex-1">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
