// src/app/api/menu/[id]/route.js
import mongoose from 'mongoose';

// 1) Connect (cache in dev)
const uri = process.env.MONGODB_URI;
let cached = global._db;
async function connect() {
  if (!cached) {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    cached = true;
  }
}

// 2) Define Menu model
const Menu = mongoose.models.Menu || mongoose.model('Menu', new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
}));

// 3) Handler
export async function GET(req, { params }) {
  await connect();
  const { id } = params;
  const item = await Menu.findById(id).lean();
  return new Response(JSON.stringify(item), {
    status: item ? 200 : 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
