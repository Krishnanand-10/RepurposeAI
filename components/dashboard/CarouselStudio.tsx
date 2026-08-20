import React, { useState, useRef } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
  Sparkles,
  Palette,
  Check,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { GeneratedAssetBundle } from '@/lib/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CarouselStudioProps {
  bundle: GeneratedAssetBundle;
  onToast: (msg: string) => void;
}

type CarouselTheme = 'indigo' | 'midnight' | 'sunset' | 'editorial';

interface CarouselSlide {
  id: number;
  slideType: 'cover' | 'insight' | 'cta';
  badge: string;
  headline: string;
  body: string;
  subtext?: string;
}

export const CarouselStudio: React.FC<CarouselStudioProps> = ({ bundle, onToast }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [theme, setTheme] = useState<CarouselTheme>('indigo');
  const [isExporting, setIsExporting] = useState(false);
  const hiddenCarouselRef = useRef<HTMLDivElement>(null);

  // Generate 5 structured slides from the asset bundle
  const bullets = bundle.linkedinPost?.bulletPoints || [];
  const slides: CarouselSlide[] = [
    {
      id: 1,
      slideType: 'cover',
      badge: `${bundle.inputType} MASTERCLASS`,
      headline: bundle.linkedinPost?.hook || bundle.title,
      body: bundle.summary || 'A breakdown of high-impact strategies and actionable frameworks.',
      subtext: 'Swipe to see the 3-step breakdown 👉',
    },
    {
      id: 2,
      slideType: 'insight',
      badge: 'INSIGHT 01',
      headline: bullets[0] || 'Build high-signal distribution before scaling volume.',
      body:
        bundle.twitterThread?.[1]?.content ||
        'Focus on 1 core contrarian insight that directly solves your audience\'s primary pain point.',
      subtext: 'Key Principle',
    },
    {
      id: 3,
      slideType: 'insight',
      badge: 'INSIGHT 02',
      headline: bullets[1] || 'Transform 1 long-form asset into 5 native platform formats.',
      body:
        bundle.twitterThread?.[2]?.content ||
        'Do not reinvent the wheel. Repurpose the core premise with hooks tailored to specific platform algorithms.',
      subtext: 'Actionable Framework',
    },
    {
      id: 4,
      slideType: 'insight',
      badge: 'INSIGHT 03',
      headline: bullets[2] || bullets[0] || 'Consistency compound effects create category dominance.',
      body:
        bundle.twitterThread?.[3]?.content ||
        'The top 1% of creators win by standardizing their production workflow and automating delivery.',
      subtext: 'Execution Playbook',
    },
    {
      id: 5,
      slideType: 'cta',
      badge: 'FINAL TAKEAWAY',
      headline: bundle.newsletterBrief?.highlightQuote || 'Work smarter, not harder.',
      body: bundle.linkedinPost?.callToAction || 'Which of these insights will you implement this week? Drop your thoughts below!',
      subtext: '♻️ Repost if you found this valuable & Follow for more!',
    },
  ];

  // Theme styling definitions
  const themeStyles = {
    indigo: {
      name: 'Indigo Cyber',
      cardBg: 'bg-gradient-to-br from-indigo-950 via-zinc-950 to-purple-950',
      border: 'border-indigo-500/40',
      badgeBg: 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300',
      headlineColor: 'text-white',
      bodyColor: 'text-zinc-300',
      accentColor: 'text-indigo-400',
      footerBorder: 'border-indigo-500/20',
      pdfBg: 'linear-gradient(145deg, #0f172a, #1e1b4b, #09090b)',
      pdfTextColor: '#ffffff',
      pdfBadgeBg: 'rgba(99, 102, 241, 0.2)',
      pdfBadgeColor: '#a5b4fc',
      pdfAccentColor: '#818cf8',
    },
    midnight: {
      name: 'Midnight Slate',
      cardBg: 'bg-gradient-to-br from-zinc-900 to-zinc-950',
      border: 'border-zinc-750',
      badgeBg: 'bg-zinc-800 border border-zinc-700 text-zinc-300',
      headlineColor: 'text-zinc-100',
      bodyColor: 'text-zinc-400',
      accentColor: 'text-zinc-300',
      footerBorder: 'border-zinc-800',
      pdfBg: 'linear-gradient(145deg, #18181b, #09090b)',
      pdfTextColor: '#f4f4f5',
      pdfBadgeBg: '#27272a',
      pdfBadgeColor: '#e4e4e7',
      pdfAccentColor: '#d4d4d8',
    },
    sunset: {
      name: 'Sunset Glow',
      cardBg: 'bg-gradient-to-br from-purple-950 via-rose-950 to-amber-950',
      border: 'border-rose-500/40',
      badgeBg: 'bg-rose-500/20 border border-rose-500/40 text-rose-300',
      headlineColor: 'text-white',
      bodyColor: 'text-rose-100/90',
      accentColor: 'text-amber-300',
      footerBorder: 'border-rose-500/20',
      pdfBg: 'linear-gradient(145deg, #2e1065, #4c0519, #451a03)',
      pdfTextColor: '#ffffff',
      pdfBadgeBg: 'rgba(244, 63, 94, 0.2)',
      pdfBadgeColor: '#fda4af',
      pdfAccentColor: '#fcd34d',
    },
    editorial: {
      name: 'Clean Editorial',
      cardBg: 'bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-900',
      border: 'border-zinc-300',
      badgeBg: 'bg-zinc-900 text-white',
      headlineColor: 'text-zinc-950',
      bodyColor: 'text-zinc-700',
      accentColor: 'text-indigo-600',
      footerBorder: 'border-zinc-300',
      pdfBg: '#f8fafc',
      pdfTextColor: '#0f172a',
      pdfBadgeBg: '#0f172a',
      pdfBadgeColor: '#ffffff',
      pdfAccentColor: '#4f46e5',
    },
  };

  const activeTheme = themeStyles[theme];
  const currentSlide = slides[currentSlideIndex];

  // Export all 5 slides into a multi-page 4:5 PDF carousel for LinkedIn
  const handleExportPDFCarousel = async () => {
    try {
      setIsExporting(true);
      onToast('Generating 5-slide PDF Carousel...');

      // 1. Create a 4:5 aspect ratio offscreen container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-99999px';
      container.style.top = '0';
      container.style.width = '600px';
      container.style.height = '750px'; // 4:5 standard LinkedIn ratio
      container.style.boxSizing = 'border-box';
      container.style.fontFamily = 'Inter, -apple-system, sans-serif';

      document.body.appendChild(container);

      // Create PDF in 4:5 portrait orientation
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [480, 600], // 4:5 ratio
      });

      for (let i = 0; i < slides.length; i++) {
        const s = slides[i];

        container.style.background = activeTheme.pdfBg;
        container.style.color = activeTheme.pdfTextColor;
        container.style.padding = '48px 40px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'space-between';

        container.innerHTML = `
          <!-- Slide Header -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="background: ${activeTheme.pdfBadgeBg}; color: ${activeTheme.pdfBadgeColor}; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; letter-spacing: 0.5px; text-transform: uppercase;">
              ${s.badge}
            </span>
            <span style="font-size: 11px; font-weight: 700; opacity: 0.6;">
              ${i + 1} / ${slides.length}
            </span>
          </div>

          <!-- Slide Content Body -->
          <div style="margin: auto 0; padding: 20px 0;">
            <h1 style="font-size: 26px; font-weight: 900; line-height: 1.25; margin-bottom: 20px; color: ${activeTheme.pdfTextColor};">
              ${s.headline}
            </h1>
            <p style="font-size: 15px; line-height: 1.6; opacity: 0.85; margin: 0; white-space: pre-line;">
              ${s.body}
            </p>
          </div>

          <!-- Slide Footer -->
          <div style="border-top: 1px solid rgba(128, 128, 128, 0.2); padding-top: 18px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 14px; font-weight: 800; color: ${activeTheme.pdfAccentColor};">✦ RepurposeAI</span>
            </div>
            <span style="font-size: 11px; font-weight: 600; color: ${activeTheme.pdfAccentColor};">
              ${s.subtext || 'Swipe 👉'}
            </span>
          </div>
        `;

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) {
          pdf.addPage([480, 600], 'portrait');
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, 480, 600);
      }

      document.body.removeChild(container);

      const slug = (bundle.title || 'carousel')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 30);
      pdf.save(`repurpose-carousel-${slug}.pdf`);

      onToast('🎉 LinkedIn Carousel PDF Downloaded!');
    } catch (err) {
      console.error('Carousel PDF generation failed:', err);
      onToast('Failed to export carousel PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Visual Carousel Slide Builder</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono font-semibold">
                LinkedIn 4:5 Deck
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              5-slide auto-formatted visual deck ready to post as a document carousel
            </p>
          </div>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-zinc-400" />
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            {(Object.keys(themeStyles) as CarouselTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  theme === t
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {themeStyles[t].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Slide Stage */}
      <div className="relative max-w-md mx-auto aspect-[4/5] rounded-3xl p-8 shadow-2xl flex flex-col justify-between overflow-hidden border transition-all duration-300 backdrop-blur-xl select-none ${activeTheme.cardBg} ${activeTheme.border}">
        
        {/* Slide Header */}
        <div className="flex items-center justify-between z-10">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${activeTheme.badgeBg}`}>
            {currentSlide.badge}
          </span>
          <span className="text-xs font-mono font-bold text-zinc-400">
            {currentSlideIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Slide Central Message */}
        <div className="space-y-4 my-auto z-10">
          <h2 className={`text-2xl sm:text-3xl font-black leading-tight tracking-tight ${activeTheme.headlineColor}`}>
            {currentSlide.headline}
          </h2>
          <p className={`text-sm leading-relaxed ${activeTheme.bodyColor}`}>
            {currentSlide.body}
          </p>
        </div>

        {/* Slide Footer */}
        <div className={`pt-4 border-t flex items-center justify-between z-10 ${activeTheme.footerBorder}`}>
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${activeTheme.accentColor}`} />
            <span className="text-xs font-bold font-mono tracking-tight text-zinc-300">
              RepurposeAI
            </span>
          </div>
          <span className={`text-xs font-semibold flex items-center gap-1 ${activeTheme.accentColor}`}>
            <span>{currentSlide.subtext || 'Swipe'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/10 pointer-events-none" />
      </div>

      {/* Slide Navigation & Export Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-md mx-auto">
        
        {/* Step dots & Previous / Next buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  currentSlideIndex === i ? 'w-6 bg-indigo-500' : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Multi-Page PDF Carousel Download */}
        <button
          onClick={handleExportPDFCarousel}
          disabled={isExporting}
          className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Exporting Deck...' : 'Download LinkedIn Carousel (PDF)'}</span>
        </button>
      </div>

      {/* Feature Explainer Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-300 max-w-xl mx-auto">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Pro-Tip:</strong> Upload this downloaded PDF directly to LinkedIn via the <em>"Add a document"</em> button. Document posts natively generate swipeable carousels that receive <strong>300%+ higher reach</strong> than standard links.
        </p>
      </div>
    </div>
  );
};
