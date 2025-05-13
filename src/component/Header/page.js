// src/components/Header.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Fetch menu items to extract unique categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/menu');
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu data');
        }
        
        const menuItems = await response.json();
        
        // Extract all categories and flatten them into a single array
        // Assuming categories are stored as comma-separated strings
        const allCategoriesWithDuplicates = menuItems
          .map(item => item.categories.split(',').map(cat => cat.trim()))
          .flat();
          
        // Remove duplicates using a Set
        const uniqueCategories = [...new Set(allCategoriesWithDuplicates)];
        
        setCategories(uniqueCategories);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    // Emit an event that other components can listen to
    const event = new CustomEvent('categoryChanged', { 
      detail: { category } 
    });
    window.dispatchEvent(event);
  };

  if (isLoading) return <div className="py-4 text-center">Loading categories...</div>;
  if (error) return <div className="py-4 text-center text-red-500">Error: {error}</div>;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Restaurant Menu
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-gray-900">
              My Orders
            </Link>
          </nav>
        </div>
        
        {/* Categories Navigation */}
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-1 min-w-max">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleCategoryClick('all')}
            >
              All Items
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                  activeCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}