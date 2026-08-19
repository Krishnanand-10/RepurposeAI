import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GeneratedAssetBundle } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const g = await prisma.generation.findUnique({
      where: { id },
    });

    if (!g) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
    }

    const parsed: GeneratedAssetBundle = {
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
    };

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Fetch generation by id error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch generation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.generation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Delete generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete generation' },
      { status: 500 }
    );
  }
}
