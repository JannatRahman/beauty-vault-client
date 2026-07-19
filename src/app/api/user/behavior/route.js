import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const behavior = await db.collection('user_behavior').findOne({ userId: session.user.id });
    
    return NextResponse.json(behavior || { recentlyViewed: [], viewedCategories: {}, viewedBrands: {} });
  } catch (error) {
    console.error('Error fetching user behavior:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, payload } = body; 
    // action: 'view_product', 'view_category', 'view_brand'
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('user_behavior');

    const currentBehavior = await collection.findOne({ userId: session.user.id }) || {
      userId: session.user.id,
      recentlyViewed: [],
      viewedCategories: {},
      viewedBrands: {}
    };

    if (action === 'view_product' && payload?.id) {
      // Add to recently viewed, max 10
      let recentlyViewed = currentBehavior.recentlyViewed || [];
      recentlyViewed = recentlyViewed.filter(id => id !== payload.id);
      recentlyViewed.unshift(payload.id);
      currentBehavior.recentlyViewed = recentlyViewed.slice(0, 10);
    } 
    
    if (action === 'view_category' && payload?.category) {
      const cat = payload.category;
      currentBehavior.viewedCategories = currentBehavior.viewedCategories || {};
      currentBehavior.viewedCategories[cat] = (currentBehavior.viewedCategories[cat] || 0) + 1;
    }
    
    if (action === 'view_brand' && payload?.brand) {
      const brand = payload.brand;
      currentBehavior.viewedBrands = currentBehavior.viewedBrands || {};
      currentBehavior.viewedBrands[brand] = (currentBehavior.viewedBrands[brand] || 0) + 1;
    }

    await collection.updateOne(
      { userId: session.user.id },
      { $set: currentBehavior },
      { upsert: true }
    );

    return NextResponse.json({ success: true, behavior: currentBehavior });
  } catch (error) {
    console.error('Error updating user behavior:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
