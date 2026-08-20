import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchYouTubeData } from '@/lib/scrapers/youtube';
import { fetchArticleData } from '@/lib/scrapers/article';
import { generateContentAssets } from '@/lib/gemini';
import { RepurposeRequestPayload } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const payload: RepurposeRequestPayload = await req.json();
    const {
      inputType,
      sourceUrl,
      rawText,
      tone = 'engaging',
      targetAudience = 'Tech founders & growth marketers',
      customInstructions,
      userApiKey,
      userEmail = 'creator@repurpose.ai',
    } = payload;

    // 1. Fetch / verify user & metered credits (Safe DB lookup)
    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: 'Alex Vance',
            planTier: 'PRO', // Default to active on first run
            creditsUsed: 0,
          },
        });
      }

      if (user && user.planTier === 'FREE' && user.creditsUsed >= 3) {
        return NextResponse.json(
          {
            error:
              'You have reached the 3 free generations limit on your account. Upgrade to Pro for unlimited generation and premium formats.',
            isLimitReached: true,
          },
          { status: 403 }
        );
      }
    } catch (dbErr) {
      console.warn('Database user lookup skipped:', dbErr);
    }

    // 2. Extract content based on inputType
    let extractedTitle = 'Repurposed Content';
    let extractedContent = '';
    let thumbnailUrl: string | undefined = undefined;

    if (inputType === 'YOUTUBE') {
      if (!sourceUrl) {
        return NextResponse.json({ error: 'YouTube URL is required.' }, { status: 400 });
      }
      const ytData = await fetchYouTubeData(sourceUrl);
      extractedTitle = ytData.title;
      extractedContent = ytData.transcript;
      thumbnailUrl = ytData.thumbnailUrl;
    } else if (inputType === 'BLOG') {
      if (!sourceUrl) {
        return NextResponse.json({ error: 'Article URL is required.' }, { status: 400 });
      }
      const articleData = await fetchArticleData(sourceUrl);
      extractedTitle = articleData.title;
      extractedContent = articleData.content;
      thumbnailUrl = articleData.leadImage;
    } else {
      if (!rawText || rawText.trim().length < 20) {
        return NextResponse.json(
          { error: 'Please enter at least 20 characters of text to repurpose.' },
          { status: 400 }
        );
      }
      extractedTitle = rawText.slice(0, 50).split('\n')[0] || 'Custom Script / Notes';
      extractedContent = rawText;
    }

    // 3. Generate Asset Bundle via Gemini AI Engine
    const assetBundle = await generateContentAssets({
      rawContent: extractedContent,
      sourceTitle: extractedTitle,
      sourceUrl,
      inputType,
      tone,
      targetAudience,
      customInstructions,
      userApiKey,
      thumbnailUrl,
    });

    // 4. Save to Database (Safe DB insert)
    let savedId = `gen_${Date.now()}`;
    let createdAt = new Date().toISOString();

    if (user?.id) {
      try {
        const savedGeneration = await prisma.generation.create({
          data: {
            userId: user.id,
            inputType,
            sourceUrl: sourceUrl || null,
            sourceTitle: assetBundle.title,
            thumbnailUrl: thumbnailUrl || null,
            originalContentSummary: assetBundle.summary,
            tone,
            linkedinPost: JSON.stringify(assetBundle.linkedinPost),
            twitterThread: JSON.stringify(assetBundle.twitterThread),
            videoScripts: JSON.stringify(assetBundle.videoScripts),
            seoMeta: JSON.stringify(assetBundle.seoMeta),
            newsletterBrief: JSON.stringify(assetBundle.newsletterBrief),
          },
        });
        savedId = savedGeneration.id;
        createdAt = savedGeneration.createdAt.toISOString();

        await prisma.user.update({
          where: { id: user.id },
          data: {
            creditsUsed: { increment: 1 },
          },
        });
      } catch (dbSaveErr) {
        console.warn('Database save skipped:', dbSaveErr);
      }
    }

    return NextResponse.json({
      ...assetBundle,
      id: savedId,
      createdAt,
    });
  } catch (error: any) {
    console.error('Repurpose API error:', error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Failed to repurpose content. Please ensure GEMINI_API_KEY is configured in Vercel Environment Variables.',
      },
      { status: 500 }
    );
  }
}
