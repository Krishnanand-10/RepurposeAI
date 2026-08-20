import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GeneratedAssetBundle } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || 'creator@repurpose.ai';
    const query = searchParams.get('q') || '';

    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbErr) {
      console.warn('DB lookup skipped in generations:', dbErr);
      return NextResponse.json({ generations: [] });
    }

    if (!user) {
      return NextResponse.json({ generations: [] });
    }

    const generations = await prisma.generation.findMany({
      where: {
        userId: user.id,
        ...(query
          ? {
              OR: [
                { sourceTitle: { contains: query } },
                { originalContentSummary: { contains: query } },
                { sourceUrl: { contains: query } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const parsedGenerations: GeneratedAssetBundle[] = generations.map((g) => ({
      id: g.id,
      title: g.sourceTitle || 'Untitled Generation',
      summary: g.originalContentSummary || '',
      sourceUrl: g.sourceUrl || undefined,
      inputType: g.inputType as any,
      tone: g.tone as any,
      thumbnailUrl: g.thumbnailUrl || undefined,
      linkedinPost: g.linkedinPost ? JSON.parse(g.linkedinPost) : null,
      twitterThread: g.twitterThread ? JSON.parse(g.twitterThread) : [],
      videoScripts: g.videoScripts ? JSON.parse(g.videoScripts) : [],
      seoMeta: g.seoMeta ? JSON.parse(g.seoMeta) : null,
      newsletterBrief: g.newsletterBrief ? JSON.parse(g.newsletterBrief) : null,
      createdAt: g.createdAt.toISOString(),
    }));

    return NextResponse.json({ generations: parsedGenerations });
  } catch (error: any) {
    console.warn('Fetch generations fallback:', error);
    return NextResponse.json({ generations: [] });
  }
}
