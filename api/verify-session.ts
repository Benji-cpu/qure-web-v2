import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createHmac } from 'crypto';

function createJWT(payload: object, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const jwtSecret = process.env.JWT_SECRET;

  if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  if (!jwtSecret) {
    console.error('JWT_SECRET is not configured');
    return res.status(500).json({ error: 'JWT is not configured' });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-04-30.basil',
  });

  try {
    const { session_id } = req.body as { session_id?: string };
    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: 'qure-web',
      sub: 'device-purchase',
      tier: 'premium',
      iat: now,
      ref: session.id,
    };

    const token = createJWT(payload, jwtSecret);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Session verification error:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to verify session' });
  }
}
