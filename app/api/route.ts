import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Defina os tipos para os planos
type PlanType = 'mensual' | 'semestral' | 'anual';

// Defina o tipo para a requisição
interface CheckoutRequest {
  plan: PlanType;
  email: string;
}

export async function POST(req: Request) {
  try {
    // Parse o corpo da requisição com tipagem
    const { plan, email }: CheckoutRequest = await req.json();
    
    // IDs de exemplo para o build passar
    const prices = {
      mensual: 'price_example_mensual',
      semestral: 'price_example_semestral',
      anual: 'price_example_anual'
    };
    
    // Verifique se o plano é válido
    if (!prices[plan]) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    // Quando estiver pronto para produção, descomente este bloco
    // e substitua os IDs de exemplo pelos reais
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [{ price: prices[plan], quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/selecao-plano/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/selecao-plano`
    } );

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Erro ao criar sessão de checkout' },
      { status: 500 }
    );
  }
}
