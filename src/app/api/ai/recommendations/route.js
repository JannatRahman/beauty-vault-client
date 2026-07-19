import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const body = await request.json();
    const { cart, wishlist, recentlyViewed, favoriteBrands, mostViewedCategories } = body;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Fetch all products to pass to OpenAI
    const products = await db.collection('products').find({}).toArray();

    // Limit products info sent to AI to save tokens
    const simplifiedProducts = products.map(p => ({
      id: p._id,
      name: p.productName || p.title || p.name,
      brand: p.brandName || p.brand,
      category: p.category,
      price: p.price,
      rating: p.rating
    }));

    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY is not set. Falling back to mock recommendations.');
      // Fallback if no API key
      return getFallbackRecommendations(products);
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const systemPrompt = `You are an expert beauty advisor working for BeautyVault.
Analyze the user's shopping behavior and recommend products that match their interests.
Only recommend products that exist inside BeautyVault's database.
Explain briefly why each product is recommended.
Return the response as JSON only.`;

    const userPrompt = `User Shopping Data:
Wishlist:
${JSON.stringify(wishlist || [])}
Cart:
${JSON.stringify(cart || [])}
Recently Viewed:
${JSON.stringify(recentlyViewed || [])}
Favorite Brands:
${JSON.stringify(favoriteBrands || [])}
Most Viewed Categories:
${JSON.stringify(mostViewedCategories || [])}
Available Products:
${JSON.stringify(simplifiedProducts)}
Request Context: ${new Date().toISOString()} (Provide a fresh, varied set of products on each request if data hasn't changed)

Recommend exactly 6 products.
Each recommendation should contain:
- productId
- productName
- brand
- reason (Short Recommendation Reason 20-40 words)
- confidence (Confidence Score 0-100)

Return valid JSON in this format:
{
  "recommendations": [
    {
      "productId": "...",
      "productName": "...",
      "brand": "...",
      "reason": "...",
      "confidence": 95
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // use gpt-4o or gpt-4-turbo
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    // Return fallback on error
    return NextResponse.json({ error: 'AI service unavailable', fallback: true }, { status: 500 });
  }
}

function getFallbackRecommendations(products) {
  // Shuffle products for variety
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  // Prefer highly rated if possible but keep it random
  shuffled.sort((a, b) => (b.rating || 0) - (a.rating || 0) + (Math.random() * 2 - 1));
  const sorted = shuffled.slice(0, 6);
  const recommendations = sorted.map(p => ({
    productId: p._id,
    productName: p.productName || p.title || p.name,
    brand: p.brandName || p.brand,
    reason: "A highly rated favorite from our community.",
    confidence: Math.floor(Math.random() * 20) + 75 // Random confidence between 75-95
  }));
  return NextResponse.json({ recommendations, isFallback: true });
}
