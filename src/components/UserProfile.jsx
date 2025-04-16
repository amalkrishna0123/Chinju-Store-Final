import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CgProfile } from "react-icons/cg";
import { Search, ChevronDown, ShoppingBag, Heart, MapPin, User, LogOut, ShoppingCart, X, Minus, Plus, Trash, HeadphonesIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MdLogin } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowRoundForward } from "react-icons/io";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase'; 
import apple from '../assets/apple.jpeg';

const UserProfile = () => {
  const { currentUser, logout, signInWithGoogle } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePage, setActivePage] = useState('orders');

  const menuItems = [
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'support', label: 'Customer Support', icon: <HeadphonesIcon size={20} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];
  // Modern cool color scheme
  const colors = {
    primary: "#3B82F6",     // Blue
    secondary: "#6366F1",   // Indigo
    accent: "#8B5CF6",      // Purple
    light: "#F3F4F6",
    dark: "#1F2937",
    white: "#FFFFFF",
    success: "#10B981"      // Green
  };

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Add "All" category at the beginning
        setCategories([{ id: 'all', name: 'All Products', imageBase64: '' }, ...fetched]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowLoginModal(false);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
    setCartItems([]);
  };
  
  // Cart functions
  const addToCart = (product) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
  
  const updateQuantity = (id, quantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Render stars based on rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return <div className="flex text-xs">{stars}</div>;
  };
  
  // Handle cart click
  const handleCartClick = () => {
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      setShowCart(true);
    }
  };

  // User Profile Component for header
  const UserProfileHeader = () => (
    <div className="relative">
      <div 
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        className="flex items-center space-x-2 cursor-pointer group"
      >
        {currentUser?.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
        ) : (
          <CgProfile className="text-2xl text-gray-700 group-hover:text-blue-600 transition-colors" />
        )}
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Hello,</span>
          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
            {currentUser?.displayName || "My Account"}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </div>
      
      {showUserDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold">{currentUser?.displayName}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
          </div>
          <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Profile
          </a>
          <a href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Orders
          </a>
          <a href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Wishlist
          </a>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  // Login Modal Component
  const LoginModal = () => {
    if (!showLoginModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md shadow-xl p-6 transform transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Sign in to Zepto</h2>
            <button 
              onClick={() => setShowLoginModal(false)}
              className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <span className="text-2xl">👤</span>
            </div>
            
            <p className="text-center text-gray-600 mb-6">
              Sign in to access your cart, save favorites, and check out faster!
            </p>
            
            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50 transition duration-200 mb-4"
            >
              <FcGoogle size={24} />
              <span>Continue with Google</span>
            </button>
            
            <button 
              onClick={() => setShowLoginModal(false)}
              className="w-full text-gray-600 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Cart Component
  const Cart = () => {
    if (!showCart) return null;
    
    const calculateTotal = () => {
      return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center md:justify-end">
        <div className="w-full md:w-1/4 h-full md:h-screen bg-white md:shadow-lg transform transition-transform duration-300 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Your Cart {cartItems.length > 0 ? `(${cartItems.length})` : ''}
            </h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2"
            >
              <X size={18} />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <ShoppingCart size={24} />
              </div>
              <p className="text-center text-gray-600 mb-6">
                Your cart is empty
              </p>
              <button 
                onClick={() => setShowCart(false)}
                className="w-full bg-[#1a7e74] text-white py-3 rounded-lg hover:bg-[#145f5a] transition duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-b border-gray-100">
                    <img 
                      src={item.imageBase64 || apple} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg" 
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.weight}</p>
                      <div className="flex items-center mt-2">
                        <span className="font-semibold text-gray-900">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-gray-400 text-xs line-through ml-2">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 mb-2"
                      >
                        <Trash size={16} />
                      </button>
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-gray-500 hover:text-blue-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-2 text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:text-blue-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 p-4">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">₹40</span>
                </div>
                <div className="flex justify-between mb-4 pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-green-600">-₹0</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold">₹{calculateTotal() + 40}</span>
                </div>
                <button className="w-full bg-[#1a7e74] text-white py-3 rounded-lg hover:bg-[#145f5a] transition duration-200">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  // For the main profile page
  if (location.pathname === '/profile') {
    return (
      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Gradient top bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>

        {/* Header - Desktop View */}
        <div className="hidden md:block bg-white py-4 shadow-sm">
          <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-blue-600 text-3xl font-bold flex items-center">
                zepto
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium ml-3">
                  SUPER SAVER
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
              <div className="mr-3">
                <div className="text-blue-600 font-bold">
                  Delivery in 9 mins
                </div>
                <div className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
                  <span>Round North, Kodaly, Kerala</span>
                  <ChevronDown size={16} className="ml-1" />
                </div>
              </div>
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              <div className="text-indigo-500 font-medium flex items-center cursor-pointer hover:text-indigo-600">
                <span>Change</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-1/3">
              <div className="bg-gray-50 flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="bg-transparent outline-none w-full text-gray-700"
                />
              </div>
            </div>

            {/* Login and Cart */}
            <div className="flex items-center space-x-6">
              {/* {currentUser ? (
                <UserProfileHeader />
              ) : (
                <div
                  className="flex items-center space-x-2 cursor-pointer group"
                  onClick={() => setShowLoginModal(true)}
                >
                  <CgProfile className="text-2xl text-gray-700 group-hover:text-blue-600 transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Sign in</span>
                    <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                      My Account
                    </span>
                  </div>
                </div>
              )} */}
              <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={handleCartClick}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md relative">
                  <ShoppingCart className="text-xl text-[#1a7e74]" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Your</span>
                  <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                    Cart
                  </span>
                </div>
              </div>
              {/* <div className="flex items-center space-x-2 cursor-pointer group">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md relative">
                    <MdLogin className="text-xl text-[#1a7e74]" />
                  </div>

                  <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                    Login
                  </span>
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        {/* <div className="md:hidden bg-gradient-to-r from-[#65D2CD] to-[#2CAA9E] p-4"> */}
        {/* Logo Section */}
        {/* <div className="flex justify-between items-center mb-4">
            <div className="bg-white text-[#1a7e74] px-4 py-2 rounded-lg font-bold text-xl shadow-md">
              zepto
            </div>
            <div className="flex space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md"
                onClick={() => !currentUser && setShowLoginModal(true)}
              >
                {currentUser && currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  />
                ) : (
                  <CgProfile className="text-xl text-[#1a7e74]" />
                )}
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md relative"
                onClick={handleCartClick}
              >
                <ShoppingCart className="text-xl text-[#1a7e74]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </div>
          </div> */}

        {/* Mobile User Dropdown */}
        {/* {showUserDropdown && currentUser && (
            <div className="absolute right-4 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold">
                  {currentUser?.displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email}
                </p>
              </div>
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </a>
              <a
                href="/orders"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Orders
              </a>
              <a
                href="/wishlist"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Wishlist
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )} */}

        {/* Delivery Info */}
        {/* <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4 backdrop-blur-sm flex items-center">
            <div className="flex flex-col flex-1">
              <div className="text-white font-bold flex items-center">
                <span className="mr-2">Delivery in 9 mins</span>
                <span className="bg-white text-[#1a7e74] text-xs px-2 py-0.5 rounded-full">
                  FAST
                </span>
              </div>
              <div className="flex items-center text-sm md:text-white text-black">
                <span>Round North, Kodaly, Kerala</span>
                <ChevronDown size={14} className="ml-1" />
              </div>
            </div>
            <div className="bg-white px-3 py-1 rounded-lg text-[#1a7e74] font-medium text-sm">
              Change
            </div>
          </div> */}

        {/* Search Bar */}
        {/* <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for products..."
              className="bg-white w-full pl-10 pr-4 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
            />
          </div> */}
        {/* </div> */}

        {/* Render Modals */}
        <LoginModal />
        <Cart />

        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="hover:text-blue-500">
              <Link to="/">Home</Link>
            </div>
            <div>
              <IoIosArrowRoundForward className="text-lg" />
            </div>
            <div>User Profile</div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="min-h-screen bg-gray-50 p-4 md:flex md:space-x-6">
          {/* Sidebar */}
          <div className="w-full md:w-72 bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex flex-col items-center mb-6">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-purple-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                  <CgProfile className="text-4xl text-purple-600" />
                </div>
              )}
              <h2 className="text-xl font-medium mt-4">
                {currentUser?.displayName || "sona dsilva"}
              </h2>
              <p className="text-sm text-gray-500">
                {currentUser?.email || "example@gmail.com"}
              </p>
            </div>

            {/* Zepto Cash */}
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center justify-between mb-3 cursor-pointer group">
                <span className="text-sm font-medium">
                  Zepto Cash & Gift Card
                </span>
                <ChevronDown
                  size={18}
                  className="text-gray-500 group-hover:text-purple-600"
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  Available Balance:
                </span>
                <span className="font-medium">₹0</span>
              </div>
              <button className="w-full bg-black text-white py-2.5 rounded font-medium hover:bg-gray-800 transition-colors">
                Add Balance
              </button>
            </div>

            {/* Navigation */}
            <nav className="mt-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activePage === item.id
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <span className="mr-3 text-gray-600">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="pt-6 border-t mt-6">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut size={20} className="mr-2" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 mt-6 md:mt-0">
            {activePage === "orders" && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <img
                  src="/api/placeholder/96/96"
                  alt="No orders"
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h3 className="text-xl font-medium mb-4">No orders yet</h3>
                <Link
                  to="/"
                  className="px-8 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  Browse products
                </Link>
              </div>
            )}

            {activePage === "support" && (
              <div className="bg-white p-8 rounded shadow">
                Customer Support Page
              </div>
            )}
            {activePage === "wishlist" && (
              <div className="bg-white p-8 rounded shadow">Wishlist Page</div>
            )}
            {activePage === "addresses" && (
              <div className="bg-white p-8 rounded shadow">Addresses Page</div>
            )}
            {activePage === "profile" && (
              <div className="bg-white p-8 rounded shadow">
                User Profile Page
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // For the header dropdown
  return (
    <div className="relative">
      <div 
        onClick={toggleDropdown}
        className="flex items-center space-x-2 cursor-pointer group"
      >
        {currentUser?.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
        ) : (
          <CgProfile className="text-2xl text-gray-700 group-hover:text-purple-600 transition-colors" />
        )}
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Hello,</span>
          <span className="text-sm font-medium group-hover:text-purple-600 transition-colors">
            {currentUser?.displayName || "My Account"}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </div>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold">{currentUser?.displayName || "sona dsilva"}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser?.email || "user@example.com"}</p>
          </div>
          <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Account
          </Link>
          <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Orders
          </Link>
          <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Wishlist
          </Link>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;