import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import OpenAI from 'openai';

/**
 * Smart local response generator — handles user questions
 * using keyword matching against the product database.
 */
function generateLocalResponse(query, products, cart, wishlist) {
  const q = query.toLowerCase().trim();
  const productCount = products.length;

  // Helper: format a product for display
  const fmt = (p) => {
    const name = p.name || 'Unknown Product';
    const brand = p.brand ? ` by **${p.brand}**` : '';
    const price = p.price ? ` — **$${Number(p.price).toFixed(2)}**` : '';
    const action = p.id ? ` [ACTION:VIEW:${p.id}]` : '';
    return `• **${name}**${brand}${price}${action}`;
  };

  // Helper: pick random items
  const pickRandom = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  // Helper: search products by keyword in name, brand, category, description
  const search = (keyword) =>
    products.filter(p =>
      [p.name, p.brand, p.category, p.description]
        .filter(Boolean)
        .some(field => field.toLowerCase().includes(keyword))
    );

  // Unique categories and brands
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  // ── Pattern matchers ──────────────────────────────────────

  // 1. Greeting
  if (/^(hi|hello|hey|howdy|good\s*(morning|evening|afternoon)|sup|yo)\b/.test(q)) {
    const featured = pickRandom(products, 3);
    let res = `Hello! 👋 Welcome to **BeautyVault**! I'm your beauty assistant.\n\nWe currently have **${productCount} products** across categories like ${categories.slice(0, 5).map(c => `*${c}*`).join(', ')}.\n\nHere are some products you might love:\n\n${featured.map(fmt).join('\n')}\n\nHow can I help you today?`;
    res += `\n\n[FOLLOWUP:What are your most popular products?]\n[FOLLOWUP:Show me skincare products]\n[FOLLOWUP:What brands do you carry?]`;
    return res;
  }

  // 2. About BeautyVault
  if (/about\s*beauty\s*vault|what\s*is\s*beauty\s*vault|tell\s*me\s*about\s*beauty/i.test(q)) {
    let res = `## ✨ About BeautyVault\n\n**BeautyVault** is your one-stop online destination for premium beauty products. We curate the best in skincare, makeup, haircare, and wellness from top brands around the world.\n\n**What we offer:**\n- 🛍️ **${productCount}+ curated products** across ${categories.length} categories\n- 💄 **${brands.length} trusted brands** including ${brands.slice(0, 5).join(', ')}${brands.length > 5 ? ' and more' : ''}\n- 🚚 Fast, reliable shipping\n- 💬 AI-powered beauty consultations (that's me!)\n- ⭐ Authentic, quality-guaranteed products\n\nWhether you're building a skincare routine or looking for the perfect lipstick shade, BeautyVault has you covered!`;
    res += `\n\n[FOLLOWUP:Show me your top products]\n[FOLLOWUP:What categories do you have?]\n[FOLLOWUP:Help me build a skincare routine]`;
    return res;
  }

  // 3. Popular / best / top / trending products
  if (/popular|best\s*sell|trending|top\s*product|most\s*loved|fan\s*fav|recommend/i.test(q)) {
    const featured = pickRandom(products, Math.min(5, productCount));
    let res = `## 🔥 Our Most Popular Products\n\nHere are some of our top-selling and customer-favorite picks:\n\n${featured.map(fmt).join('\n')}\n\nThese are flying off the shelves! Would you like me to help you find something specific?`;
    res += `\n\n[FOLLOWUP:Tell me more about skincare]\n[FOLLOWUP:What's good for oily skin?]\n[FOLLOWUP:Show me products under $30]`;
    return res;
  }

  // 4. Skincare routine / help with skincare
  if (/skincare\s*routine|help\s*(me\s*)?(with\s*)?skincare|skin\s*care\s*tip|build\s*(a\s*|my\s*)?routine/i.test(q)) {
    const skincareProducts = search('skincare').length > 0 ? search('skincare') : search('skin');
    const cleanser = products.find(p => /cleanser|wash|foam/i.test(p.name || '') || /cleanser/i.test(p.category || ''));
    const moisturizer = products.find(p => /moistur|cream|hydrat/i.test(p.name || ''));
    const serum = products.find(p => /serum|essence/i.test(p.name || ''));
    const sunscreen = products.find(p => /spf|sunscreen|sun\s*protect/i.test(p.name || ''));

    let res = `## 🧴 Building Your Skincare Routine\n\nHere's a basic skincare routine I'd recommend:\n\n**Morning Routine:**\n1. **Cleanser** — Gently wash your face\n2. **Serum/Essence** — Target specific concerns\n3. **Moisturizer** — Lock in hydration\n4. **Sunscreen (SPF 30+)** — Protect from UV damage\n\n**Evening Routine:**\n1. **Double Cleanse** — Oil cleanser + water-based cleanser\n2. **Treatment** — Retinol, AHA/BHA, or targeted serum\n3. **Moisturizer** — Nourish overnight\n\n**Products from our store that can help:**\n`;
    if (cleanser) res += `\n${fmt(cleanser)}`;
    if (serum) res += `\n${fmt(serum)}`;
    if (moisturizer) res += `\n${fmt(moisturizer)}`;
    if (sunscreen) res += `\n${fmt(sunscreen)}`;
    if (!cleanser && !serum && !moisturizer && !sunscreen && skincareProducts.length > 0) {
      res += `\n${skincareProducts.slice(0, 4).map(fmt).join('\n')}`;
    }
    if (!cleanser && !serum && !moisturizer && !sunscreen && skincareProducts.length === 0) {
      const fallback = pickRandom(products, 3);
      res += `\n${fallback.map(fmt).join('\n')}`;
    }
    res += `\n\n[FOLLOWUP:What's good for dry skin?]\n[FOLLOWUP:Show me anti-aging products]\n[FOLLOWUP:What moisturizers do you have?]`;
    return res;
  }

  // 5. Skin type queries (oily, dry, sensitive, combination)
  if (/oily\s*skin|dry\s*skin|sensitive\s*skin|combination\s*skin|acne/i.test(q)) {
    const skinType = q.match(/(oily|dry|sensitive|combination|acne)/i)?.[1] || 'all';
    const relevant = search(skinType);
    const displayed = relevant.length > 0 ? relevant.slice(0, 5) : pickRandom(products, 4);

    let tips = '';
    if (skinType === 'oily') tips = `**Tips for oily skin:** Look for oil-free, non-comedogenic products. Ingredients like niacinamide, salicylic acid, and hyaluronic acid work great.`;
    else if (skinType === 'dry') tips = `**Tips for dry skin:** Opt for rich, hydrating formulas. Look for hyaluronic acid, ceramides, and squalane.`;
    else if (skinType === 'sensitive') tips = `**Tips for sensitive skin:** Choose fragrance-free, hypoallergenic products. Aloe vera and centella asiatica are soothing ingredients.`;
    else if (skinType === 'acne') tips = `**Tips for acne-prone skin:** Look for salicylic acid, benzoyl peroxide, and tea tree oil. Avoid heavy, comedogenic ingredients.`;
    else tips = `**General tip:** Know your skin type to choose the right products!`;

    let res = `## 💆 Products for ${skinType.charAt(0).toUpperCase() + skinType.slice(1)} Skin\n\n${tips}\n\n**Here are some products that might help:**\n\n${displayed.map(fmt).join('\n')}`;
    res += `\n\n[FOLLOWUP:Build me a skincare routine]\n[FOLLOWUP:What moisturizers do you have?]\n[FOLLOWUP:Show me your bestsellers]`;
    return res;
  }

  // 6. Category browsing
  if (/categor|what\s*(do\s*you|kind|type)/i.test(q) || categories.some(c => q.includes(c.toLowerCase()))) {
    const matchedCat = categories.find(c => q.includes(c.toLowerCase()));
    if (matchedCat) {
      const catProducts = products.filter(p => p.category?.toLowerCase() === matchedCat.toLowerCase());
      const displayed = catProducts.slice(0, 6);
      let res = `## 🏷️ ${matchedCat} Products\n\nWe have **${catProducts.length} products** in the **${matchedCat}** category:\n\n${displayed.map(fmt).join('\n')}${catProducts.length > 6 ? `\n\n...and ${catProducts.length - 6} more! Browse our full collection in the products page.` : ''}`;
      const otherCats = categories.filter(c => c !== matchedCat).slice(0, 3);
      res += `\n\n[FOLLOWUP:Show me ${otherCats[0] || 'more'} products]\n[FOLLOWUP:What are your bestsellers?]\n[FOLLOWUP:Help me build a routine]`;
      return res;
    }
    let res = `## 📂 Our Product Categories\n\nWe organize our **${productCount} products** into these categories:\n\n${categories.map(c => {
      const count = products.filter(p => p.category === c).length;
      return `• **${c}** — ${count} product${count !== 1 ? 's' : ''}`;
    }).join('\n')}\n\nWhich category interests you?`;
    res += `\n\n[FOLLOWUP:Show me ${categories[0] || 'skincare'} products]\n[FOLLOWUP:What are your trending products?]\n[FOLLOWUP:Tell me about BeautyVault]`;
    return res;
  }

  // 7. Brand queries
  if (/brand|who\s*(do\s*you|se)\s*carry/i.test(q) || brands.some(b => q.includes(b.toLowerCase()))) {
    const matchedBrand = brands.find(b => q.includes(b.toLowerCase()));
    if (matchedBrand) {
      const brandProducts = products.filter(p => p.brand?.toLowerCase() === matchedBrand.toLowerCase());
      const displayed = brandProducts.slice(0, 6);
      let res = `## 🏪 ${matchedBrand} Products\n\nWe carry **${brandProducts.length} products** from **${matchedBrand}**:\n\n${displayed.map(fmt).join('\n')}${brandProducts.length > 6 ? `\n\n...and ${brandProducts.length - 6} more!` : ''}`;
      res += `\n\n[FOLLOWUP:Show me all brands]\n[FOLLOWUP:What's popular from ${matchedBrand}?]\n[FOLLOWUP:Compare with other brands]`;
      return res;
    }
    let res = `## 🏪 Brands We Carry\n\nWe're proud to stock products from **${brands.length} trusted brands**:\n\n${brands.map(b => `• **${b}** (${products.filter(p => p.brand === b).length} products)`).join('\n')}\n\nWant to explore a specific brand?`;
    res += `\n\n[FOLLOWUP:Show me ${brands[0] || 'top'} products]\n[FOLLOWUP:What are your bestsellers?]\n[FOLLOWUP:What categories do you have?]`;
    return res;
  }

  // 8. Price queries
  if (/under\s*\$?\d+|cheap|affordable|budget|price|expensive|luxury|premium/i.test(q)) {
    const priceMatch = q.match(/under\s*\$?(\d+)/i);
    let threshold = priceMatch ? parseInt(priceMatch[1]) : null;
    let filtered;

    if (/cheap|affordable|budget/i.test(q)) {
      threshold = threshold || 30;
      filtered = products.filter(p => p.price && p.price <= threshold).sort((a, b) => a.price - b.price);
    } else if (/expensive|luxury|premium/i.test(q)) {
      filtered = [...products].filter(p => p.price).sort((a, b) => b.price - a.price);
    } else if (threshold) {
      filtered = products.filter(p => p.price && p.price <= threshold).sort((a, b) => a.price - b.price);
    } else {
      filtered = [...products].filter(p => p.price).sort((a, b) => a.price - b.price);
    }

    const displayed = filtered.slice(0, 6);
    const label = threshold ? `under $${threshold}` : (/expensive|luxury|premium/i.test(q) ? 'premium' : 'by price');
    let res = `## 💰 Products ${label.charAt(0).toUpperCase() + label.slice(1)}\n\n${displayed.length > 0 ? `Found **${filtered.length} products** ${label}:\n\n${displayed.map(fmt).join('\n')}` : `Sorry, I couldn't find products matching that price range. Our prices range from $${Math.min(...products.filter(p => p.price).map(p => p.price)).toFixed(2)} to $${Math.max(...products.filter(p => p.price).map(p => p.price)).toFixed(2)}.`}`;
    res += `\n\n[FOLLOWUP:Show me products under $20]\n[FOLLOWUP:What are your luxury picks?]\n[FOLLOWUP:What's on sale?]`;
    return res;
  }

  // 9. Cart / wishlist queries
  if (/my\s*cart|what.*in\s*(my\s*)?cart|checkout|wishlist/i.test(q)) {
    if (/wishlist/i.test(q)) {
      let res = wishlist && wishlist.length > 0
        ? `## 💖 Your Wishlist\n\nYou have **${wishlist.length} item${wishlist.length > 1 ? 's' : ''}** in your wishlist. Check your wishlist page to view and manage them!`
        : `## 💖 Your Wishlist\n\nYour wishlist is currently empty! Browse our products and tap the heart icon to save items you love.`;
      res += `\n\n[FOLLOWUP:Show me popular products]\n[FOLLOWUP:What's trending right now?]\n[FOLLOWUP:Help me find a gift]`;
      return res;
    }
    let res = cart && cart.length > 0
      ? `## 🛒 Your Cart\n\nYou have **${cart.length} item${cart.length > 1 ? 's' : ''}** in your cart. Head to checkout when you're ready!\n\nWould you like me to recommend products that go well with what's in your cart?`
      : `## 🛒 Your Cart\n\nYour cart is currently empty! Let me help you find some great products to add.`;
    res += `\n\n[FOLLOWUP:Show me bestsellers]\n[FOLLOWUP:What's new?]\n[FOLLOWUP:Help me build a routine]`;
    return res;
  }

  // 10. Makeup specific
  if (/makeup|lipstick|foundation|mascara|eyeshadow|blush|concealer|primer|contour|highlighter/i.test(q)) {
    const keyword = q.match(/(makeup|lipstick|foundation|mascara|eyeshadow|blush|concealer|primer|contour|highlighter)/i)?.[1] || 'makeup';
    const results = search(keyword);
    const displayed = results.length > 0 ? results.slice(0, 5) : pickRandom(products, 4);

    let res = `## 💄 ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Products\n\n${results.length > 0 ? `Great choice! Here are our **${keyword}** products:\n\n${displayed.map(fmt).join('\n')}` : `I couldn't find specific *${keyword}* products, but here are some beauty products you might love:\n\n${displayed.map(fmt).join('\n')}`}`;
    res += `\n\n[FOLLOWUP:Best foundation for oily skin?]\n[FOLLOWUP:Show me lip products]\n[FOLLOWUP:What's trending in makeup?]`;
    return res;
  }

  // 11. Hair care
  if (/hair|shampoo|conditioner|hair\s*care|hair\s*mask|scalp/i.test(q)) {
    const results = search('hair');
    const displayed = results.length > 0 ? results.slice(0, 5) : pickRandom(products, 3);
    let res = `## 💇 Hair Care Products\n\n${results.length > 0 ? `Here are our hair care products:\n\n${displayed.map(fmt).join('\n')}` : `We don't have specific hair care products listed right now, but check out these beauty essentials:\n\n${displayed.map(fmt).join('\n')}`}`;
    res += `\n\n[FOLLOWUP:Show me skincare products]\n[FOLLOWUP:What brands do you carry?]\n[FOLLOWUP:What's popular right now?]`;
    return res;
  }

  // 12. Vegan / cruelty-free / organic / natural
  if (/vegan|cruelty[\s-]*free|organic|natural|clean\s*beauty/i.test(q)) {
    const keyword = q.match(/(vegan|cruelty[\s-]*free|organic|natural|clean)/i)?.[1] || 'natural';
    const results = search(keyword);
    const displayed = results.length > 0 ? results.slice(0, 5) : pickRandom(products, 4);
    let res = `## 🌿 ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Beauty\n\n${results.length > 0 ? `Here are our ${keyword} products:\n\n${displayed.map(fmt).join('\n')}` : `While we may not have specifically labeled *${keyword}* products at the moment, many of our products are formulated with clean, gentle ingredients. Here are some you might enjoy:\n\n${displayed.map(fmt).join('\n')}`}`;
    res += `\n\n[FOLLOWUP:What skincare products do you have?]\n[FOLLOWUP:Show me organic options]\n[FOLLOWUP:What are your bestsellers?]`;
    return res;
  }

  // 13. Gift / recommendation
  if (/gift|present|for\s*(my|a)\s*(friend|mom|sister|girlfriend|wife|her|him)/i.test(q)) {
    const giftPicks = pickRandom(products, 5);
    let res = `## 🎁 Gift Recommendations\n\nHere are some wonderful gift ideas from BeautyVault:\n\n${giftPicks.map(fmt).join('\n')}\n\nWant me to narrow it down based on their preferences or budget?`;
    res += `\n\n[FOLLOWUP:Gifts under $50]\n[FOLLOWUP:Best skincare gift sets]\n[FOLLOWUP:What's your most luxurious product?]`;
    return res;
  }

  // 14. Thank you / bye
  if (/thank|thanks|bye|goodbye|see\s*you|that's\s*all/i.test(q)) {
    let res = `You're welcome! 😊 It was my pleasure helping you. Don't hesitate to come back anytime you need beauty advice or product recommendations.\n\nHappy shopping! 🛍️✨`;
    res += `\n\n[FOLLOWUP:Show me your bestsellers]\n[FOLLOWUP:What's new?]\n[FOLLOWUP:Help me build a routine]`;
    return res;
  }

  // 15. General product search — try to match any keyword in the query
  const words = q.split(/\s+/).filter(w => w.length > 3 && !/^(what|that|this|with|from|your|have|does|will|show|tell|about|help|find|good|best|some|more|like|want|need|look|make|give)$/i.test(w));
  for (const word of words) {
    const results = search(word);
    if (results.length > 0) {
      const displayed = results.slice(0, 5);
      let res = `Here's what I found for **"${word}"**:\n\n${displayed.map(fmt).join('\n')}${results.length > 5 ? `\n\n...and ${results.length - 5} more! Browse our full catalog for the complete selection.` : ''}`;
      res += `\n\n[FOLLOWUP:Tell me more about ${results[0]?.name || 'this product'}]\n[FOLLOWUP:Show me similar products]\n[FOLLOWUP:What else do you recommend?]`;
      return res;
    }
  }

  // 16. Fallback — nothing matched
  const suggestions = pickRandom(products, 4);
  let res = `I'd love to help! While I'm not sure about that specific query, here's what I can do:\n\n• 🔍 **Search products** — Ask about any product, brand, or category\n• 💄 **Makeup advice** — Foundation, lipstick, eyeshadow recommendations\n• 🧴 **Skincare help** — Build a routine for your skin type\n• 💰 **Budget picks** — Find products in your price range\n• 🎁 **Gift ideas** — Perfect presents for beauty lovers\n\n**Here are some products to get you started:**\n\n${suggestions.map(fmt).join('\n')}`;
  res += `\n\n[FOLLOWUP:What are your bestsellers?]\n[FOLLOWUP:Help me with skincare]\n[FOLLOWUP:Tell me about BeautyVault]`;
  return res;
}



export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const body = await request.json();
    const { messages, cart = [], wishlist = [] } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Fetch context (limit fields to save tokens)
    const products = await db.collection('products').find({}).toArray();
    const simplifiedProducts = products.map(p => ({
      id: p._id,
      name: p.productName || p.title || p.name,
      brand: p.brandName || p.brand,
      category: p.category,
      price: p.price,
      description: p.description
    }));

    // Save history (async, fire and forget)
    if (session?.user?.id) {
      db.collection('chat_histories').updateOne(
        { userId: session.user.id },
        { $set: { messages, updatedAt: new Date() } },
        { upsert: true }
      ).catch(console.error);
    }

    if (!process.env.OPENAI_API_KEY) {
      // Smart local fallback — answers questions using the product database
      const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
      const answer = generateLocalResponse(lastUserMsg, simplifiedProducts, cart, wishlist);
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(answer));
          controller.close();
        }
      });
      return new Response(stream, { headers: { 'Content-Type': 'text/plain' } });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const systemPrompt = `You are BeautyVault AI, a professional beauty consultant working for BeautyVault.
Always answer as BeautyVault's shopping assistant. Keep your answers friendly, helpful, concise, and highly accurate.
CRITICAL RULE: You must ONLY recommend or talk about the products provided in the "Available Products" list below. Do not invent, hallucinate, or assume the existence of any other products. If the user asks about something not in the list, tell them you don't have it currently.
When answering a question, provide exact names, prices, and details as they appear in the database. 

Available Products:
${JSON.stringify(simplifiedProducts)}

User Context:
- Cart: ${JSON.stringify(cart)}
- Wishlist: ${JSON.stringify(wishlist)}

Formatting Rules:
- Use markdown formatting where appropriate.
- If you recommend a product or mention a specific product, YOU MUST append a view action marker at the end of the sentence like this: [ACTION:VIEW:product_id]
- You MUST ALWAYS end your response with exactly 3 suggested follow-up questions relevant to the conversation. Format them exactly like this on separate lines at the very end of your response:
[FOLLOWUP:Suggested Question 1]
[FOLLOWUP:Suggested Question 2]
[FOLLOWUP:Suggested Question 3]

If the user asks something unrelated to beauty products, politely respond that your expertise is focused on beauty products and shopping within BeautyVault.`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: apiMessages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (e) {
          console.error(e);
          controller.error(e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/plain' } });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
