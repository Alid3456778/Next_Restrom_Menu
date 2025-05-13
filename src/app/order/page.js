'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OrderPage() {
  // State to store selected order items
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();

  // Load selected items from local storage when component mounts
  useEffect(() => {
    const storedItems = localStorage.getItem('selectedMenuItems');
    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems));
    }
  }, []);

  // Function to remove item from order
  const removeFromOrder = (itemId) => {
    const updatedItems = selectedItems.filter(item => item._id !== itemId);
    setSelectedItems(updatedItems);
    localStorage.setItem('selectedMenuItems', JSON.stringify(updatedItems));
    toast.info('Item removed from order');
  };

  // Function to submit order
  const submitOrder = async () => {
    if (selectedItems.length === 0) {
      toast.error('Your order is empty');
      return;
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedItems,
          totalPrice: selectedItems.reduce((total, item) => total + item.price, 0),
          timestamp: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const result = await response.json();
      toast.success('Order submitted successfully!');
      
      // Clear selected items from local storage and state
      localStorage.removeItem('selectedMenuItems');
      setSelectedItems([]);

      // Redirect to a confirmation page or back to menu
      router.push('/order/confirmation');
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to submit order');
    }
  };

  // Clear entire order
  const clearOrder = () => {
    setSelectedItems([]);
    localStorage.removeItem('selectedMenuItems');
    toast.info('Order cleared');
  };

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
        <h1 className="text-2xl font-bold">Your Order</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Back to Menu
        </button>
      </div>

      {selectedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Your order is empty</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Add Items to Order
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {selectedItems.map((item) => (
              <div 
                key={item._id} 
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <div>
                  <span className="font-semibold text-lg">{item.name}</span>
                  <span className="ml-4 text-green-600 font-bold">${item.price.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => removeFromOrder(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div>
              <span className="text-xl font-bold mr-4">
                Total: ${selectedItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
              </span>
              <button 
                onClick={clearOrder}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Clear Order
              </button>
            </div>
            <button 
              onClick={submitOrder}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-lg font-bold"
            >
              Submit Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}