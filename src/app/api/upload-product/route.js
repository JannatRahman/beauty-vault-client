import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, brandName, category, productImage, price, rating, stock, size, description, usage, ingredients, createdBy } = body;

    if (!title || !brandName || !category || !productImage || !price || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const product = {
      title,
      brandName,
      category,
      productImage,
      price,
      rating,
      stock,
      size,
      description,
      usage,
      ingredients,
      createdBy,
      createdAt: new Date(),
    };

    const result = await db.collection('products').insertOne(product);

    return NextResponse.json({ success: true, productId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error uploading product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
