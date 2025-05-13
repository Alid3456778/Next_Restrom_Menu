// src/app/api/menu/route.js
import mongoose from 'mongoose';

// 1) Connect (cache in dev)
// const uri = process.env.MONGODB_URI;
// if (!uri) throw new Error('MONGODB_URI not set');

let cached = global._db;
async function connect() {
  if (cached) return;
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  cached = true;
}

// 2) Define model
const Menu = mongoose.models.Menu || mongoose.model('Menu', new mongoose.Schema({
  name: String,
  categories: String,
  description: String,
  price: Number,
}));

// 3) Handler
export async function GET() {
  await connect();
  const items = await Menu.find().lean();
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  await connect();
  const data = await req.json();
  // you can add validation here if needed
  const newItem = await Menu.create(data);
  return new Response(JSON.stringify(newItem), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
