import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPortalSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active Stripe billing profile found for this account.' },
        { status: 400 }
      );
    }

    const host = req.headers.get('origin') || 'http://localhost:3000';
    const returnUrl = `${host}/dashboard`;

    const portal = await createPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error: any) {
    console.error('Stripe portal error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create billing portal' },
      { status: 500 }
    );
  }
}
