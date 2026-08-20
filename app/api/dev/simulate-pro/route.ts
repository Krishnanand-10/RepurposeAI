import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, setPro = true, resetCredits = false } = await req.json();
    const targetEmail = email || 'creator@repurpose.ai';

    try {
      const user = await prisma.user.upsert({
        where: { email: targetEmail },
        update: {
          planTier: setPro ? 'PRO' : 'FREE',
          ...(resetCredits ? { creditsUsed: 0 } : {}),
        },
        create: {
          email: targetEmail,
          name: 'Alex Vance',
          planTier: setPro ? 'PRO' : 'FREE',
          creditsUsed: 0,
        },
      });

      return NextResponse.json({
        success: true,
        message: `User plan successfully updated to ${user.planTier}`,
        user: {
          id: user.id,
          email: user.email,
          planTier: user.planTier,
          creditsUsed: user.creditsUsed,
          isPro: user.planTier === 'PRO',
        },
      });
    } catch (dbErr) {
      console.warn('Simulate Pro DB fallback:', dbErr);
      return NextResponse.json({
        success: true,
        message: `User plan simulated to ${setPro ? 'PRO' : 'FREE'}`,
        user: {
          id: 'usr_serverless',
          email: targetEmail,
          planTier: setPro ? 'PRO' : 'FREE',
          creditsUsed: 0,
          isPro: setPro,
        },
      });
    }
  } catch (error: any) {
    console.error('Dev simulate pro error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to simulate pro plan' },
      { status: 500 }
    );
  }
}
