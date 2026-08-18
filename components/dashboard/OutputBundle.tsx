import React, { useState } from 'react';
import {
  Linkedin,
  Twitter,
  Video,
  Search,
  Mail,
  PlayCircle,
  FileText,
  Hash,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { GeneratedAssetBundle } from '@/lib/types';
import { AssetCard } from './AssetCard';

interface OutputBundleProps {
  bundle: GeneratedAssetBundle;
  onOpenTeleprompter: (script: string, hook: string) => void;
  onCopiedToast: (msg: string) => void;
}

export const OutputBundle: React.FC<OutputBundleProps> = ({
  bundle,
  onOpenTeleprompter,
  onCopiedToast,
}) => {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'twitter' | 'video' | 'seo' | 'newsletter'>('linkedin');

  // Format LinkedIn copy text
  const linkedinFullText = `${bundle.linkedinPost.hook}\n\n${bundle.linkedinPost.body}\n\nKey Takeaways:\n${bundle.linkedinPost.bulletPoints.map((b) => `• ${b}`).join('\n')}\n\n${bundle.linkedinPost.callToAction}\n\n${bundle.linkedinPost.hashtags.join(' ')}`;

  // Format Twitter thread copy text
  const twitterFullThread = bundle.twitterThread
    .map((t) => `${t.tweetNumber}/${bundle.twitterThread.length}\n${t.content}`)
    .join('\n\n---\n\n');

  // Format SEO copy text
  const seoFullText = `Title: ${bundle.seoMeta.metaTitle}\nDescription: ${bundle.seoMeta.metaDescription}\nKeywords: ${bundle.seoMeta.keywords.join(', ')}\nSlug: /${bundle.seoMeta.slugSuggestion}`;

  // Format Newsletter copy text
  const newsletterFullText = `TL;DR:\n${bundle.newsletterBrief.tldr}\n\nKey Takeaways:\n${bundle.newsletterBrief.keyTakeaways.map((t) => `• ${t}`).join('\n')}\n\nQuote:\n"${bundle.newsletterBrief.highlightQuote}"`;

  return (
    <div className="space-y-5">
      
      {/* Output Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'linkedin'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span>LinkedIn Post</span>
        </button>

        <button
          onClick={() => setActiveTab('twitter')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'twitter'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Twitter className="w-3.5 h-3.5" />
          <span>X Thread ({bundle.twitterThread.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'video'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>3 Video Hooks</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'seo'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>SEO Meta</span>
        </button>

        <button
          onClick={() => setActiveTab('newsletter')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'newsletter'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Newsletter</span>
        </button>
      </div>

      {/* Tab 1: LinkedIn Summary Post */}
      {activeTab === 'linkedin' && (
        <AssetCard
          title="LinkedIn Thought-Leadership Post"
          icon={<Linkedin className="w-4 h-4" />}
          badge="Formatted for high engagement"
          copyContent={linkedinFullText}
          charCount={linkedinFullText.length}
          maxCharCount={3000}
          onCopied={() => onCopiedToast('LinkedIn post copied to clipboard!')}
        >
          <div className="space-y-4 font-sans text-sm">
            {/* Magnetic Hook Callout */}
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                🪝 Magnetic 2-Second Hook
              </span>
              <p className="font-semibold text-white whitespace-pre-line">{bundle.linkedinPost.hook}</p>
            </div>

            {/* Body */}
            <div className="text-zinc-300 whitespace-pre-line leading-relaxed">
              {bundle.linkedinPost.body}
            </div>

            {/* Bullet Points */}
            <div className="space-y-2 py-2">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Key Takeaways:</span>
              <ul className="space-y-1.5 pl-2">
                {bundle.linkedinPost.bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Call to Action */}
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-200 italic">
              💬 {bundle.linkedinPost.callToAction}
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {bundle.linkedinPost.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        </AssetCard>
      )}

      {/* Tab 2: Twitter/X Thread */}
      {activeTab === 'twitter' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-zinc-400">
              {bundle.twitterThread.length} Tweet Narrative Breakdown
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(twitterFullThread);
                onCopiedToast('Full Twitter thread copied to clipboard!');
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Copy Whole Thread 📋
            </button>
          </div>

          <div className="space-y-3">
            {bundle.twitterThread.map((tweet) => {
              const charCount = tweet.content.length;
              const isOverLimit = charCount > 280;

              return (
                <div
                  key={tweet.tweetNumber}
                  className={`p-4 rounded-2xl bg-zinc-900 border transition-all ${
                    tweet.isHook
                      ? 'border-indigo-500/40 bg-gradient-to-r from-indigo-950/30 to-zinc-900'
                      : 'border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px] font-bold font-mono">
                        {tweet.tweetNumber}
                      </span>
                      {tweet.isHook && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                          Thread Hook
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-mono ${
                          isOverLimit ? 'text-rose-400 font-bold' : 'text-zinc-500'
                        }`}
                      >
                        {charCount}/280
                      </span>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(tweet.content);
                          onCopiedToast(`Tweet #${tweet.tweetNumber} copied!`);
                        }}
                        className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <p className="text-zinc-200 text-sm whitespace-pre-line leading-relaxed">
                    {tweet.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Short-Form Video Scripts */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-zinc-400">
              3 High-Retention Scripts for Reels / TikTok / Shorts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {bundle.videoScripts.map((script, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3.5"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold font-mono">
                      Script #{idx + 1}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium font-mono">
                      ⏱️ {script.targetDuration || '30-45s'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Launch Teleprompter */}
                    <button
                      onClick={() =>
                        onOpenTeleprompter(
                          `${script.hook}\n\n${script.voiceoverScript}\n\nCTA: ${script.callToAction}`,
                          script.hook
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md shadow-purple-600/25"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Teleprompter</span>
                    </button>

                    <button
                      onClick={() => {
                        const text = `Hook: ${script.hook}\n\nVisual Direction:\n${script.visualDirection}\n\nVoiceover:\n${script.voiceoverScript}\n\nCTA: ${script.callToAction}`;
                        navigator.clipboard.writeText(text);
                        onCopiedToast(`Video Script #${idx + 1} copied!`);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                    >
                      Copy Script
                    </button>
                  </div>
                </div>

                {/* Hook */}
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                    Spoken Hook
                  </span>
                  <p className="text-white font-semibold text-sm">"{script.hook}"</p>
                </div>

                {/* Visual Direction */}
                <div className="text-xs text-zinc-400 bg-zinc-950/30 p-2.5 rounded-lg border border-zinc-850 font-mono">
                  🎬 <strong className="text-zinc-300">Visual B-Roll:</strong> {script.visualDirection}
                </div>

                {/* Voiceover Script */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Voiceover Cadence:
                  </span>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                    {script.voiceoverScript}
                  </p>
                </div>

                {/* CTA */}
                <div className="text-xs text-emerald-400 font-medium">
                  🎯 <strong className="text-zinc-200">Call to Action:</strong> {script.callToAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: SEO Meta Pack */}
      {activeTab === 'seo' && (
        <AssetCard
          title="Search Engine Optimization Meta Pack"
          icon={<Search className="w-4 h-4" />}
          badge="Google SERP Optimized"
          copyContent={seoFullText}
          onCopied={() => onCopiedToast('SEO Meta Pack copied!')}
        >
          <div className="space-y-5">
            {/* Google SERP Preview Simulator */}
            <div className="p-4 rounded-xl bg-white text-zinc-900 shadow-lg space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Google Search Result Preview
              </span>
              <div className="text-xs text-zinc-500 font-mono truncate">
                https://yoursite.com/{bundle.seoMeta.slugSuggestion}
              </div>
              <h4 className="text-base font-medium text-blue-700 hover:underline cursor-pointer leading-tight">
                {bundle.seoMeta.metaTitle}
              </h4>
              <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed">
                {bundle.seoMeta.metaDescription}
              </p>
            </div>

            {/* Title & Description Fields */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
                  <span>SEO Title</span>
                  <span className="font-mono">{bundle.seoMeta.metaTitle.length}/60</span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={bundle.seoMeta.metaTitle}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-medium focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
                  <span>Meta Description</span>
                  <span
                    className={`font-mono ${
                      bundle.seoMeta.metaDescription.length > 160 ? 'text-rose-400 font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {bundle.seoMeta.metaDescription.length}/160
                  </span>
                </div>
                <textarea
                  readOnly
                  rows={3}
                  value={bundle.seoMeta.metaDescription}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-zinc-400 block mb-1.5">
                  Target Keyword Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {bundle.seoMeta.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono"
                    >
                      🏷️ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AssetCard>
      )}

      {/* Tab 5: Newsletter Brief */}
      {activeTab === 'newsletter' && (
        <AssetCard
          title="Executive Brief & Newsletter Digest"
          icon={<Mail className="w-4 h-4" />}
          badge="Ready for Substack / Beehiiv"
          copyContent={newsletterFullText}
          onCopied={() => onCopiedToast('Newsletter digest copied!')}
        >
          <div className="space-y-4">
            {/* TLDR */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                Executive TL;DR
              </span>
              <p className="text-white text-sm font-medium leading-relaxed">
                {bundle.newsletterBrief.tldr}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Core Insights:
              </span>
              <ul className="space-y-2 pl-2">
                {bundle.newsletterBrief.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-zinc-300 text-sm">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlight Soundbite Quote */}
            {bundle.newsletterBrief.highlightQuote && (
              <blockquote className="p-3.5 rounded-xl bg-zinc-950/80 border-l-4 border-indigo-500 text-zinc-300 text-sm italic">
                "{bundle.newsletterBrief.highlightQuote}"
              </blockquote>
            )}
          </div>
        </AssetCard>
      )}

    </div>
  );
};
