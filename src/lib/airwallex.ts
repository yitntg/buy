import { createHmac } from 'crypto';

const AIRWALLEX_API_KEY = process.env.AIRWALLEX_API_KEY;
const AIRWALLEX_CLIENT_ID = process.env.AIRWALLEX_CLIENT_ID;
const AIRWALLEX_WEBHOOK_SECRET = process.env.AIRWALLEX_WEBHOOK_SECRET;
const AIRWALLEX_API_URL = process.env.AIRWALLEX_API_URL || 'https://api.airwallex.com/api/v1';

export interface AirwallexPaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export async function createPaymentIntent(amount: number, currency: string = 'USD'): Promise<AirwallexPaymentIntent> {
  const response = await fetch(`${AIRWALLEX_API_URL}/pa/payment_intents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AIRWALLEX_API_KEY}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: ['card'],
      capture_method: 'automatic',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create payment intent: ${response.statusText}`);
  }

  return response.json();
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!AIRWALLEX_WEBHOOK_SECRET) {
    throw new Error('AIRWALLEX_WEBHOOK_SECRET is not configured');
  }

  const hmac = createHmac('sha256', AIRWALLEX_WEBHOOK_SECRET);
  const calculatedSignature = hmac.update(payload).digest('hex');
  return calculatedSignature === signature;
}

export async function getPaymentIntent(paymentIntentId: string): Promise<AirwallexPaymentIntent> {
  const response = await fetch(`${AIRWALLEX_API_URL}/pa/payment_intents/${paymentIntentId}`, {
    headers: {
      'Authorization': `Bearer ${AIRWALLEX_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get payment intent: ${response.statusText}`);
  }

  return response.json();
}

export async function confirmPaymentIntent(paymentIntentId: string, paymentMethod: any): Promise<AirwallexPaymentIntent> {
  const response = await fetch(`${AIRWALLEX_API_URL}/pa/payment_intents/${paymentIntentId}/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AIRWALLEX_API_KEY}`,
    },
    body: JSON.stringify({
      payment_method: paymentMethod
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to confirm payment intent: ${response.statusText}`);
  }

  return response.json();
} 