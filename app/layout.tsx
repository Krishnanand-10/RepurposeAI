import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RepurposeAI — AI-Powered Multi-Platform Content Repurposing',
  description:
    'Turn YouTube videos, blog articles, and transcripts into viral LinkedIn posts, Twitter/X threads, TikTok/Reels video scripts, and SEO packages in seconds with Gemini AI.',
  keywords: [
    'AI content repurposing',
    'YouTube to Twitter thread',
    'blog to LinkedIn post',
    'viral video script generator',
    'content marketing AI',
    'RepurposeAI',
  ],
  authors: [{ name: 'RepurposeAI Team' }],
  openGraph: {
    title: 'RepurposeAI — AI-Powered Content Repurposing',
    description:
      'Transform 1 piece of long-form content into 5+ distribution assets in seconds.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
