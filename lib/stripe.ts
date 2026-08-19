import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key_repurpose_ai', {
  apiVersion: '2024-11-20.acacia' as any,
  appInfo: {
    name: 'RepurposeAI',
    version: '1.0.0',
  },
});

export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || 'price_repurpose_ai_pro_monthly';

/**
 * Creates a Stripe Checkout Session for Pro tier
 */
export async function createCheckoutSession(params: {
  userId: string;
  userEmail: string;
  returnUrl: string;
}) {
  const { userId, userEmail, returnUrl } = params;

  // In production with real Stripe keys
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'RepurposeAI Pro Plan',
              description: 'Unlimited AI Repurposing, Teleprompter Pro, SEO Pack, All Export Formats',
            },
            unit_amount: 2900, // $29.00/month
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&upgrade=success`,
      cancel_url: `${returnUrl}?upgrade=cancelled`,
      metadata: {
        userId,
      },
    });

    return session;
  }

  // Demo fallback session simulation
  return {
    id: `cs_test_${Date.now()}`,
    url: `${returnUrl}?simulated_checkout=true&userId=${userId}`,
  };
}

/**
 * Creates a Stripe Billing Portal Session for customer subscription management
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const { customerId, returnUrl } = params;

  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return portalSession;
  }

  return {
    url: `${returnUrl}?portal_simulated=true`,
  };
}
