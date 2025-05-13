'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  // Fetch all orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/order');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      toast.error(`Error: ${err.message}`);
    }
  };

  // Function to toggle order details visibility
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Function to delete an order
  const deleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to complete and remove this order?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/order/${orderId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      // Remove the order from state
      setOrders(orders.filter(order => order._id !== orderId));
      toast.success('Order completed and removed successfully');
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // Calculate total price for an order
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price || 0), 0).toFixed(2);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  if (isLoading) return <div className="py-20 text-center">Loading orders...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error: {error}</div>;
  if (orders.length === 0) return <div className="py-20 text-center">No orders found.</div>;

  return (
    <div className="container mx-auto p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Orders
        </button>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="border rounded-lg p-4 shadow-md bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  Order #{order._id.substring(order._id.length - 6)}
                </h2>
                <p className="text-gray-600">
                  {order.customerName || 'Customer'} • {formatDate(order.createdAt || new Date())}
                </p>
                {order.customerContact && (
                  <p className="text-gray-600">Contact: {order.customerContact}</p>
                )}
                {order.tableNumber && (
                  <p className="text-gray-600">Table: {order.tableNumber}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="font-bold text-green-600">
                  ${calculateTotal(order.items || [])}
                </span>
                <button
                  onClick={() => toggleOrderDetails(order._id)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
                >
                  {expandedOrders[order._id] ? 'Hide Details' : 'View Details'}
                </button>
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                >
                  Complete Order
                </button>
              </div>
            </div>
            
            {expandedOrders[order._id] && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium mb-2">Order Items:</h3>
                <ul className="space-y-2">
                  {(order.items || []).map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price?.toFixed(2) || '0.00'}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 pt-2 border-t flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal(order.items || [])}</span>
                </div>
                
                {order.specialInstructions && (
                  <div className="mt-4 pt-2 border-t">
                    <h3 className="font-medium mb-2">Special Instructions:</h3>
                    <p className="text-gray-700 bg-gray-50 p-2 rounded">{order.specialInstructions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}