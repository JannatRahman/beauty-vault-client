require('dotenv').config({path: '.env.local'});
const { MongoClient } = require('mongodb');

async function run() {
  const client = new MongoClient(process.env.MONGODB_URL);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const products = await db.collection('products').find({}).limit(5).toArray();
  products.forEach(p => console.log(`ID: ${p._id}, Image: ${p.productImage || p.image || p.imageUrl}`));
  await client.close();
}
run().catch(console.error);
