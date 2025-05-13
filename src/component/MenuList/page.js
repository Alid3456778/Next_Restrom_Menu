// src/components/MenuList.jsx
"use client";

import { useState, useEffect } from 'react';

export default function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Fetch menu items
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu data');
        }
        
        const data = await response.json();
        setMenuItems(data);
        setFilteredItems(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    // Listen for category change events from the Header component
    const handleCategoryChange = (event) => {
      const category = event.detail.category;
      setSelectedCategory(category);
      
      if (category === 'all') {
        setFilteredItems(menuItems);
      } else {
        const filtered = menuItems.filter(item => {
          const itemCategories = item.categories.split(',').map(cat => cat.trim());
          return itemCategories.includes(category);
        });
        setFilteredItems(filtered);
      }
    };

    window.addEventListener('categoryChanged', handleCategoryChange);
    
    // Cleanup function
    return () => {
      window.removeEventListener('categoryChanged', handleCategoryChange);
    };
  }, [menuItems]);

  if (isLoading) return <div className="py-20 text-center">Loading menu items...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error: {error}</div>;
  if (filteredItems.length === 0) return <div className="py-20 text-center">No items found in this category.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        {selectedCategory === 'all' ? 'All Menu Items' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Menu`}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  onClick={() => {
                    // This will be implemented in the cart functionality
                    console.log(`Added ${item.name} to cart`);
                    // You can dispatch an event or call a function to add to cart
                  }}
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}