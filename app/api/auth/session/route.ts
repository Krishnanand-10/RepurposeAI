import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || 'creator@repurpose.ai';

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: 'Alex Vance',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          planTier: 'FREE',
          creditsUsed: 0,
        },
      });
    }

    const isPro = user.planTier === 'PRO';
    const creditsMax = isPro ? Infinity : 3;

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name || 'Creator',
      avatar: user.avatar || '',
      planTier: user.planTier,
      creditsUsed: user.creditsUsed,
      creditsMax,
      isPro,
    });
  } catch (error: any) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch user session' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatar, resetCredits, planTier } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        ...(name ? { name } : {}),
        ...(avatar ? { avatar } : {}),
        ...(planTier ? { planTier } : {}),
        ...(resetCredits ? { creditsUsed: 0 } : {}),
      },
      create: {
        email,
        name: name || 'Creator',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        planTier: planTier || 'FREE',
        creditsUsed: 0,
      },
    });

    const isPro = user.planTier === 'PRO';

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name || 'Creator',
      avatar: user.avatar || '',
      planTier: user.planTier,
      creditsUsed: user.creditsUsed,
      creditsMax: isPro ? Infinity : 3,
      isPro,
    });
  } catch (error: any) {
    console.error('Session update error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update session' },
      { status: 500 }
    );
  }
}
