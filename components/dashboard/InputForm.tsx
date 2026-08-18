import React, { useState } from 'react';
import {
  Youtube,
  FileText,
  Type,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  ClipboardPaste,
  Wand2,
} from 'lucide-react';
import { AudienceTone, InputType, RepurposeRequestPayload } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface InputFormProps {
  onSubmit: (payload: RepurposeRequestPayload) => void;
  isLoading: boolean;
  creditsRemaining: number;
  onOpenUpgradeModal: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  isLoading,
  creditsRemaining,
  onOpenUpgradeModal,
}) => {
  const [inputType, setInputType] = useState<InputType>('YOUTUBE');
  const [sourceUrl, setSourceUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [tone, setTone] = useState<AudienceTone>('engaging');
  const [targetAudience, setTargetAudience] = useState('Tech founders & growth marketers');
  const [customInstructions, setCustomInstructions] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const samplePresets = [
    {
      label: '🎥 Tech Talk',
      type: 'YOUTUBE' as InputType,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'How Next.js & AI Are Changing Full-Stack Engineering in 2026',
    },
    {
      label: '📰 SaaS Blog',
      type: 'BLOG' as InputType,
      url: 'https://vercel.com/blog/building-ai-applications',
      title: 'Building Production-Grade AI Applications',
    },
    {
      label: '✍️ Founder Notes',
      type: 'TEXT' as InputType,
      text: `When we launched our SaaS product last year, we made 3 critical mistakes:\n1. We spent 6 months building features before talking to 10 customers.\n2. We priced at $9/mo instead of value-based pricing at $49/mo.\n3. We published blog posts once and never repurposed them into video hooks or threads.\nOnce we fixed our distribution engine, our organic MRR grew 400% in 90 days.`,
    },
  ];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (inputType === 'TEXT') {
        setRawText(text);
      } else {
        setSourceUrl(text);
      }
    } catch (err) {
      console.warn('Could not read clipboard', err);
    }
  };

  const handleLoadPreset = (preset: typeof samplePresets[0]) => {
    setInputType(preset.type);
    if (preset.type === 'TEXT') {
      setRawText(preset.text || '');
    } else {
      setSourceUrl(preset.url || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      inputType,
      sourceUrl: inputType !== 'TEXT' ? sourceUrl : undefined,
      rawText: inputType === 'TEXT' ? rawText : undefined,
      tone,
      targetAudience,
      customInstructions,
    });
  };

  const isFormValid =
    inputType === 'TEXT' ? rawText.trim().length >= 20 : sourceUrl.trim().length >= 10;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Input Mode Selector Tabs */}
      <div className="flex p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setInputType('YOUTUBE')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            inputType === 'YOUTUBE'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Youtube className="w-4 h-4" />
          <span>YouTube URL</span>
        </button>

        <button
          type="button"
          onClick={() => setInputType('BLOG')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            inputType === 'BLOG'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Blog / Article</span>
        </button>

        <button
          type="button"
          onClick={() => setInputType('TEXT')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            inputType === 'TEXT'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Raw Text</span>
        </button>
      </div>

      {/* Main Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            {inputType === 'YOUTUBE'
              ? 'YouTube Video Link'
              : inputType === 'BLOG'
              ? 'Blog Post / Article URL'
              : 'Paste Transcript / Outline'}
          </label>
          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Paste from Clipboard</span>
          </button>
        </div>

        {inputType === 'TEXT' ? (
          <div className="relative">
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste long-form text, podcast transcript, meeting notes, or newsletter draft here (minimum 20 characters)..."
              className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 text-sm leading-relaxed placeholder:text-zinc-600 focus:outline-none transition-all resize-none"
            />
            <div className="absolute bottom-3 right-3 text-[11px] font-mono text-zinc-500">
              {rawText.length} chars
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder={
                inputType === 'YOUTUBE'
                  ? 'https://www.youtube.com/watch?v=...'
                  : 'https://yourblog.com/posts/...'
              }
              className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none transition-all font-mono"
            />
          </div>
        )}
      </div>

      {/* Preset Samples */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-zinc-500 font-medium">Quick Presets:</span>
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleLoadPreset(preset)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Advanced Customization Collapsible */}
      <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-900/40">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audience Tone & Instructions</span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-4 pt-1 border-t border-zinc-800/60 space-y-3.5 bg-zinc-950/40">
            {/* Tone Selector */}
            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1.5 uppercase">
                Audience Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'engaging', label: '🔥 Viral & Engaging' },
                  { id: 'professional', label: '💼 B2B Leader' },
                  { id: 'storyteller', label: '📖 Storyteller' },
                  { id: 'punchy', label: '⚡ Direct / Punchy' },
                  { id: 'casual', label: '☕ Casual & Friendly' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id as AudienceTone)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      tone === t.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                Target Niche / Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Early-stage startup founders, marketing directors..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1 uppercase">
                Custom Creator Instructions
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Focus heavily on ROI, emphasize 3-step playbook..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Generate Action Button */}
      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        disabled={!isFormValid || isLoading}
        className="w-full py-4 text-base font-bold shadow-xl shadow-indigo-600/30"
        leftIcon={<Wand2 className="w-5 h-5 text-indigo-200" />}
      >
        <span>Generate Distribution Bundle ✨</span>
      </Button>

      {/* Credit Warning if exhausted */}
      {creditsRemaining === 0 && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
          <span>You have used all 3 free generations.</span>
          <button
            type="button"
            onClick={onOpenUpgradeModal}
            className="font-bold underline text-white hover:text-rose-200"
          >
            Upgrade to Pro ⚡
          </button>
        </div>
      )}
    </form>
  );
};
