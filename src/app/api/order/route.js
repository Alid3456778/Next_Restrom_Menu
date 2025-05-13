// src/app/api/orders/route.js
import mongoose from 'mongoose';

// — Connect helper (cached) —
const uri = process.env.MONGODB_URI;
let _conn;
async function connect() {
  if (_conn) return;
  _conn = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await _conn;
}

// — Order model —
const Order = mongoose.models.Order || mongoose.model(
  'Order',
  new mongoose.Schema({
    items: Array,               // e.g. [{ id, name, price, quantity }, …]
    createdAt: { type: Date, default: Date.now },
    Isorder:Boolean
  })
);

// — GET all & POST new —
export async function GET() {
  await connect();
  const all = await Order.find().lean();
  return new Response(JSON.stringify(all), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  await connect();
  const data = await req.json();    // expect { items: […] }
  const created = await Order.create(data);
  return new Response(JSON.stringify(created), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
