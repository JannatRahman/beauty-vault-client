import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import clientPromise from '@/lib/db'

import { stripe } from '../../../lib/stripe'

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    const body = await request.json();
    const { cart } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const line_items = cart.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title || item.name,
          images: item.image || item.productImage ? [item.image || item.productImage] : [],
          metadata: {
            productId: item._id
          }
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/cart`,
      metadata: {
        cartSummary: JSON.stringify(cart.map(c => ({ id: c._id, q: c.quantity }))).substring(0, 500)
      }
    });

    // Save pending order to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('orders').insertOne({
      sessionId: session.id,
      cart,
      status: 'pending',
      createdAt: new Date()
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}
