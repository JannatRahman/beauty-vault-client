import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const filter = {};
    if (createdBy) {
      filter.createdBy = createdBy;
    }

    const products = await db.collection('products').find(filter).toArray();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
