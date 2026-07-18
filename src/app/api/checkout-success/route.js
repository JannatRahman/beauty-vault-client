import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const order = await db.collection('orders').findOne({ sessionId: session_id });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'completed') {
      return NextResponse.json({ success: true, message: 'Already processed' }, { status: 200 });
    }

    // Update order status
    await db.collection('orders').updateOne(
      { sessionId: session_id },
      { $set: { status: 'completed', completedAt: new Date() } }
    );

    // Reduce stock for each item in the cart
    const bulkOperations = order.cart.map(item => {
      // Ensure we have a valid ObjectId, otherwise we might match nothing
      const filter = ObjectId.isValid(item._id) ? { _id: new ObjectId(item._id) } : null;
      
      if (!filter) return null;

      return {
        updateOne: {
          filter,
          update: {
            $inc: { stock: -Math.abs(item.quantity) } // Ensure we are decrementing
          }
        }
      };
    }).filter(Boolean); // Remove nulls

    if (bulkOperations.length > 0) {
      await db.collection('products').bulkWrite(bulkOperations);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error completing checkout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
