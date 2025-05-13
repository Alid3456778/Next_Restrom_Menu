'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

export default function MenuPage() {
  // State to store menu items
  const [menuItems, setMenuItems] = useState([]);
  // State to track filtered menu items
  const [filteredItems, setFilteredItems] = useState([]);
  // State to store categories
  const [categories, setCategories] = useState([]);
  // State to track active category
  const [activeCategory, setActiveCategory] = useState('all');
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Fetch menu items when component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        
        // Extract categories from the fetched menu items
        const allCategoriesWithDuplicates = data
          .map(item => item.categories ? item.categories.split(',').map(cat => cat.trim()) : [])
          .flat();
        
        // Remove duplicates using a Set
        const uniqueCategories = [...new Set(allCategoriesWithDuplicates.filter(cat => cat))];
        
        setMenuItems(data);
        setFilteredItems(data);
        setCategories(uniqueCategories);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching menu:', error);
        toast.error('Failed to load menu items');
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Filter items when category changes
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    
    if (category === 'all') {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item => {
        const itemCategories = item.categories ? item.categories.split(',').map(cat => cat.trim()) : [];
        return itemCategories.includes(category);
      });
      setFilteredItems(filtered);
    }
  };

  // Function to add item to order
  const addToOrder = (item) => {
    // Get current selected items from local storage
    const storedItems = localStorage.getItem('selectedMenuItems');
    const currentItems = storedItems ? JSON.parse(storedItems) : [];

    // Check if item is already in the order
    const isItemInOrder = currentItems.some(selectedItem => selectedItem._id === item._id);
    
    if (!isItemInOrder) {
      const updatedItems = [...currentItems, item];
      localStorage.setItem('selectedMenuItems', JSON.stringify(updatedItems));
      toast.success(`${item.name} added to order`);
    } else {
      toast.info(`${item.name} is already in your order`);
    }
  };

  // Navigate to order page
  const goToOrder = () => {
    router.push('/order');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Categories */}
      <header className="bg-white shadow-md mb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <Link href="/" className="text-2xl font-bold text-gray-800">
                Restaurant Menu
              </Link>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={goToOrder}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Order
              </button>
            </div>
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

      {/* Main Content */}
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
        
        <h1 className="text-2xl font-bold mb-6">
          {activeCategory === 'all' ? 'Our Menu' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Menu`}
        </h1>
        
        {isLoading ? (
          <div className="py-20 text-center">Loading menu items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center">No items found in this category.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                {item.description && (
                  <p className="text-gray-600 mb-2">{item.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToOrder(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}