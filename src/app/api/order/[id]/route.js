// src/app/api/order/[id]/route.js
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || "mongodb+srv://sunbreathing13form:Pimse123@cluster0.ny9by.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
if (!uri) throw new Error('MONGODB_URI not set');

let cached = global._db;
async function connect() {
  if (cached) return;
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  cached = true;
}

// Define Order model if it doesn't exist
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  customerName: String,
  customerContact: String,
  tableNumber: String,
  items: Array,
  specialInstructions: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}));

// Handler for GET request - get a specific order
export async function GET(request, { params }) {
  try {
    await connect();
    const { id } = params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(order), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handler for DELETE request - delete an order
export async function DELETE(request, { params }) {
  try {
    await connect();
    const { id } = params;
    
    const deletedOrder = await Order.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ message: 'Order deleted successfully' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}