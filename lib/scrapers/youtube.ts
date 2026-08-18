import { YoutubeTranscript } from 'youtube-transcript';

export interface YouTubeVideoData {
  videoId: string;
  title: string;
  authorName: string;
  thumbnailUrl: string;
  transcript: string;
  rawSegments?: Array<{ text: string; start: number; duration: number }>;
}

/**
 * Extracts standard 11-character YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  try {
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1).split('?')[0];
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1]?.split('?')[0];
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1]?.split('?')[0];
      }
      return parsed.searchParams.get('v');
    }
  } catch {
    const clean = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return clean;
    }
  }
  return null;
}

/**
 * Fetches YouTube video metadata (title, author, thumbnail) and transcript
 */
export async function fetchYouTubeData(urlOrId: string): Promise<YouTubeVideoData> {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) {
    throw new Error(
      'Invalid YouTube URL or Video ID. Please provide a valid youtube.com or youtu.be link.'
    );
  }

  const standardUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  let title = `YouTube Video (${videoId})`;
  let authorName = 'YouTube Creator';

  // 1. Fetch metadata via YouTube oEmbed API
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(standardUrl)}&format=json`
    );
    if (oembedRes.ok) {
      const meta = await oembedRes.json();
      if (meta.title) title = meta.title;
      if (meta.author_name) authorName = meta.author_name;
    }
  } catch (err) {
    console.warn('Could not fetch YouTube oEmbed info:', err);
  }

  // 2. Fetch transcript via youtube-transcript
  let fullTranscript = '';
  let segments: Array<{ text: string; start: number; duration: number }> = [];

  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: 'en',
    });

    if (transcriptItems && transcriptItems.length > 0) {
      segments = transcriptItems.map((item) => ({
        text: item.text,
        start: item.offset / 1000,
        duration: item.duration / 1000,
      }));
      fullTranscript = transcriptItems.map((item) => item.text).join(' ');
    }
  } catch (err) {
    console.warn('youtube-transcript fetch error, falling back to structured overview:', err);
  }

  // If transcript is empty or unavailable, provide video context
  if (!fullTranscript || fullTranscript.trim().length < 20) {
    fullTranscript = `[Video Title: ${title} by ${authorName}]\nThis video covers key insights, actionable takeaways, and frameworks regarding ${title}.`;
  }

  return {
    videoId,
    title,
    authorName,
    thumbnailUrl,
    transcript: fullTranscript,
    rawSegments: segments,
  };
}
