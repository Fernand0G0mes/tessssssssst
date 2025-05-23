import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';
    
    // Você precisará definir esta variável de ambiente no Vercel
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      // Corrigindo o erro de tipagem aqui
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Aqui você pode processar o pagamento concluído
      // Por exemplo, atualizar o status do usuário no banco de dados
      
      console.log('Checkout completed:', session);
    }
    
    return NextResponse.json({ received: true });
  } catch (err) {
    // Corrigindo o erro de tipagem aqui também
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
