import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updateProduct = await request.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // prevent modifying _id
    delete updateProduct._id;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateProduct }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error editing product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
