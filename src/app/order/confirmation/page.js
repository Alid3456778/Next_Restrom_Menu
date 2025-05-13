'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Generate a random order number
    const generateOrderNumber = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    setOrderNumber(generateOrderNumber());
  }, []);

  return (
    <div className="container mx-auto p-4 text-center">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* <svg 
          className="w-24 h-24 text-green-500 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg> */}
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
        
        {orderNumber && (
          <p className="text-xl mb-6">
            Your Order Number: 
            <span className="font-bold text-blue-600 ml-2">#{orderNumber}</span>
          </p>
        )}
        
        <p className="text-gray-600 mb-6">
          Thank you for your order. We are preparing your delicious meal and will notify you when it's ready.
        </p>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Menu
          </button>
          <button 
            onClick={() => router.push('/order')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            View Order
          </button>
        </div>
      </div>
    </div>
  );
}