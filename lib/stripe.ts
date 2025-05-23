// lib/stripe.ts
import Stripe from 'stripe';

// **APENAS PARA PASSAR O BUILD TEMPORARIAMENTE NO VERCEL**
// Esta chave é inválida e não funcionará para transações reais.
// VOCÊ DEVE SUBSTITUIR ISSO POR process.env.STRIPE_SECRET_KEY COM A CHAVE CORRETA NO VERCEL!
const PALIATIVE_STRIPE_KEY = 'sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX0001'; // Uma chave de teste inválida

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || PALIATIVE_STRIPE_KEY, {
  apiVersion: '2025-04-30.basil',
});

export { stripe };