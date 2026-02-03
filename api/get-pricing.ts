import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const PRODUCT_IDS: Record<string, string> = {
  tier1: process.env.STRIPE_PRODUCT_TIER1 || 'prod_Ts62kYWMFXFWIB',
  tier2: process.env.STRIPE_PRODUCT_TIER2 || 'prod_Ts62IFiGFpNTpK',
  tier3: process.env.STRIPE_PRODUCT_TIER3 || 'prod_Ts62eKD6QBZSTe',
};

interface PricingTier {
  tier: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
  formattedPrice: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return res.status(200).json({
      tiers: [
        { tier: 'tier1', productId: '', name: 'Premium', price: 499, currency: 'usd', formattedPrice: '$4.99' },
        { tier: 'tier2', productId: '', name: 'Premium', price: 399, currency: 'usd', formattedPrice: '$3.99' },
        { tier: 'tier3', productId: '', name: 'Premium', price: 299, currency: 'usd', formattedPrice: '$2.99' },
      ],
      defaultTier: 'tier1',
    });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-04-30.basil',
  });

  try {
    const tiers: PricingTier[] = [];

    for (const [tier, productId] of Object.entries(PRODUCT_IDS)) {
      try {
        const product = await stripe.products.retrieve(productId, {
          expand: ['default_price'],
        });

        if (product.default_price && typeof product.default_price !== 'string') {
          const price = product.default_price;
          const amount = price.unit_amount || 0;
          const currency = price.currency || 'usd';
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
          });

          tiers.push({
            tier,
            productId,
            name: product.name,
            price: amount,
            currency,
            formattedPrice: formatter.format(amount / 100),
          });
        }
      } catch (err) {
        console.error(`Failed to fetch product ${productId}:`, err);
      }
    }

    tiers.sort((a, b) => b.price - a.price);

    return res.status(200).json({ tiers, defaultTier: 'tier1' });
  } catch (error) {
    console.error('Pricing fetch error:', error);
    return res.status(200).json({
      tiers: [
        { tier: 'tier1', productId: '', name: 'Premium', price: 499, currency: 'usd', formattedPrice: '$4.99' },
      ],
      defaultTier: 'tier1',
    });
  }
}
