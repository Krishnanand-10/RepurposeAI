import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || 'creator@repurpose.ai';

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: 'Alex Vance',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          planTier: 'PRO',
          creditsUsed: 0,
        },
      });
    }

    const isPro = user.planTier === 'PRO';
    const creditsMax = isPro ? 999999 : 3;

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name || 'Alex Vance',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      planTier: user.planTier,
      creditsUsed: user.creditsUsed,
      creditsMax,
      isPro,
    });
  } catch (error: any) {
    console.warn('Database session fallback (serverless mode):', error?.message);
    
    // Return resilient default session so app never crashes on Vercel serverless
    return NextResponse.json({
      id: 'usr_serverless',
      email,
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      planTier: 'PRO',
      creditsUsed: 0,
      creditsMax: 999999,
      isPro: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatar, resetCredits, planTier } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          ...(name !== undefined ? { name } : {}),
          ...(avatar !== undefined ? { avatar } : {}),
          ...(planTier !== undefined ? { planTier } : {}),
          ...(resetCredits ? { creditsUsed: 0 } : {}),
        },
        create: {
          email,
          name: name || 'Alex Vance',
          avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          planTier: planTier || 'PRO',
          creditsUsed: 0,
        },
      });

      const isPro = user.planTier === 'PRO';
      return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        planTier: user.planTier,
        creditsUsed: user.creditsUsed,
        creditsMax: isPro ? 999999 : 3,
        isPro,
      });
    } catch (dbErr) {
      console.warn('Session DB update skipped:', dbErr);
      return NextResponse.json({
        id: 'usr_serverless',
        email,
        name: name || 'Alex Vance',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        planTier: planTier || 'PRO',
        creditsUsed: 0,
        creditsMax: 999999,
        isPro: true,
      });
    }
  } catch (error: any) {
    console.error('Session update error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update session' },
      { status: 500 }
    );
  }
}
