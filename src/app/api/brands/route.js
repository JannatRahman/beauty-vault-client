import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const brands = await db.collection('brands').find({}).toArray();
    
    if (brands.length === 0) {
      const pipeline = [
        {
          $group: {
            _id: "$brandName",
            totalProducts: { $sum: 1 },
            brandLogo: { $first: "$productImage" }
          }
        }
      ];
      const aggregated = await db.collection('products').aggregate(pipeline).toArray();
      const formatted = aggregated.map(item => ({
        brandName: item._id || 'Unknown Brand',
        totalProducts: item.totalProducts,
        brandLogo: item.brandLogo || 'https://images.unsplash.com/photo-1522337788-75e7a9f7e8ba?auto=format&fit=crop&q=80&w=200&h=200'
      }));
      return NextResponse.json(formatted, { status: 200 });
    }
    
    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
