import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const PRODUCT_IDS: Record<string, string> = {
  tier1: process.env.STRIPE_PRODUCT_TIER1 || 'prod_Ts62kYWMFXFWIB',
  tier2: process.env.STRIPE_PRODUCT_TIER2 || 'prod_Ts62IFiGFpNTpK',
  tier3: process.env.STRIPE_PRODUCT_TIER3 || 'prod_Ts62eKD6QBZSTe',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-04-30.basil',
  });

  try {
    const { tier = 'tier1' } = req.body as { tier?: string };

    const productId = PRODUCT_IDS[tier];
    if (!productId) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price'],
    });

    if (!product.default_price) {
      console.error(`Product ${productId} has no default price`);
      return res.status(500).json({ error: 'Product pricing not configured' });
    }

    const priceId = typeof product.default_price === 'string'
      ? product.default_price
      : product.default_price.id;

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/purchase/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { tier, product_id: productId },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
