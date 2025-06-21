import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Configurazione Stripe (disattivata per ora)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-05-28.basil',
})

// Flag per attivare/disattivare i pagamenti reali
const PAYMENTS_ENABLED = false

export async function POST(request: NextRequest) {
  if (!PAYMENTS_ENABLED) {
    // Simula un pagamento di successo quando disattivato
    return NextResponse.json({
      success: true,
      clientSecret: 'pi_dummy_secret',
      paymentIntentId: 'pi_dummy_id',
      message: 'Pagamento simulato (modalità test)'
    })
  }

  try {
    const { amount, currency = 'eur' } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Importo non valido' },
        { status: 400 }
      )
    }

    // Crea Payment Intent con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa i centesimi
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Errore durante la creazione del Payment Intent:', error)
    return NextResponse.json(
      { error: 'Errore durante la creazione del pagamento' },
      { status: 500 }
    )
  }
} 