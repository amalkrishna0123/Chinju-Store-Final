import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CgProfile } from "react-icons/cg";
import { Search, ChevronDown, ShoppingBag, Heart, MapPin, User, LogOut, ShoppingCart, X, Minus, Plus, Trash, HeadphonesIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MdLogin } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowRoundForward } from "react-icons/io";
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../Firebase'; 
import apple from '../assets/apple.jpeg';
import { query, where, orderBy } from 'firebase/firestore';
import AddressManager from './AddressManager';

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
  const [activePage, setActivePage] = useState('profile');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  
  // Load cart and wishlist when user changes
  useEffect(() => {
    if (currentUser?.cartItems) {
      setCartItems(currentUser.cartItems);
    } else {
      setCartItems([]);
    }
    if (currentUser?.wishlist) {
      setWishlistItems(currentUser.wishlist);
    } else {
      setWishlistItems([]);
    }
  }, [currentUser]);

  // Cart functions - Updated to match ProductViewAll.jsx
  const addToCart = async (product) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    
    try {
      const updatedItems = [...cartItems];
      const existingItemIndex = updatedItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems.push({
          ...product,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
      }
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        cartItems: updatedItems
      });
      
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const cartItems = userDoc.data().cartItems || [];
        const updatedItems = cartItems.filter(item => item.id !== productId);
        
        await updateDoc(doc(db, 'users', currentUser.uid), {
          cartItems: updatedItems
        });

        setCartItems(updatedItems);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!currentUser?.uid) return;
    
    try {
      const updatedItems = cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        cartItems: updatedItems
      });
      
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== id);
      
      if (currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          cartItems: updatedItems
        });
      }
      
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Fetch wishlist items when component mounts or user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser?.uid) return;
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setWishlistItems(userDoc.data().wishlist || []);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.uid) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }
  
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        
        const ordersRef = collection(db, 'orders');
        let ordersData = [];
        
        try {
          // Try the compound query first (requires index)
          const q = query(
            ordersRef,
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
          }));
        } catch (indexError) {
          console.log("Index not yet ready, falling back to basic query");
          
          // Fallback to a simpler query without ordering
          const basicQuery = query(
            ordersRef,
            where('userId', '==', currentUser.uid)
          );
          
          const querySnapshot = await getDocs(basicQuery);
          ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
          }));
          
          // Sort the results in memory
          ordersData.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
        }
  
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrdersError('Failed to load orders. Please try again.');
      } finally {
        setOrdersLoading(false);
      }
    };
  
    fetchOrders();
  }, [currentUser]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const itemToRemove = wishlistItems.find(item => item.id === itemId);
      if (!itemToRemove) return;
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        wishlist: arrayRemove(itemToRemove)
      });
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Remove from wishlist error:', error);
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        const updatedCartItems = cartItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
        
        await updateDoc(doc(db, 'users', currentUser.uid), {
          cartItems: updatedCartItems
        });
        
        setCartItems(updatedCartItems);
      } else {
        const newCartItem = {
          ...item,
          quantity: 1,
          addedAt: new Date().toISOString()
        };
        
        await updateDoc(doc(db, 'users', currentUser.uid), {
          cartItems: arrayUnion(newCartItem)
        });
        
        setCartItems(prev => [...prev, newCartItem]);
      }
      
      // Remove from wishlist
      await handleRemoveFromWishlist(item.id);
      
    } catch (error) {
      console.error('Move to cart error:', error);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'support', label: 'Customer Support', icon: <HeadphonesIcon size={20} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={20} /> },
  ];

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
    setWishlistItems([]);
  };
  
  // Handle cart click
  const handleCartClick = () => {
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      setShowCart(true);
    }
  };

  // Cart Component - Updated to match ProductViewAll.jsx
  const Cart = () => {
    if (!showCart) return null;
    
    const calculateTotal = () => {
      return cartItems.reduce((total, item) => total + (item.salePrice * item.quantity), 0);
    };
    
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex items-center justify-center md:justify-end">
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
                    <img src={item.imageBase64 || apple} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.weight}</p>
                      <div className="flex items-center mt-2">
                        <span className="font-semibold text-gray-900">₹{item.salePrice || item.originalPrice}</span>
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

  // Login Modal Component - Updated to match ProductViewAll.jsx
  const LoginModal = () => {
    if (!showLoginModal) return null;

    return (
      <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4">
        <div className="bg-[#39B2A7] bg-opacity-50 rounded-xl w-full max-w-md shadow-xl p-6 transform transition-all border-t-4 border-[#2e978e]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Sign in to Zepto
            </h2>
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-white hover:text-gray-700 bg-gray-100 rounded-full p-2 w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✖
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#65D2CD] flex items-center justify-center mb-4">
              <User size={24} className="text-white" />
            </div>

            <p className="text-center text-white mb-6">
              Sign in to access your cart, save favorites, and check out faster!
            </p>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 border hover:text-black border-white rounded-lg py-3.5 px-4 text-white hover:bg-[#fff] transition duration-200 mb-4 shadow-sm"
            >
              <FcGoogle size={24} />
              <span className="font-medium">Continue with Google</span>
            </button>

            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full text-[#fff] border border-[#fff] py-3 rounded-lg hover:bg-[#fff] hover:text-black hover:bg-opacity-10 hover:border-[#fff] transition duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Female',
    mobile: '',
    address: '',
    place: '',
    pincode: '',
    landmark: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.uid) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            gender: data.gender || 'Female',
            mobile: data.mobile || '',
            address: data.address || '',
            place: data.place || '',
            pincode: data.pincode || '',
            landmark: data.landmark || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, [currentUser]);

  const handleProfileUpdate = async () => {
    if (!currentUser?.uid) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...profileData,
        updatedAt: new Date()
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
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

            {/* Login and Cart */}
            <div className="flex items-center space-x-6">
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
            </div>
          </div>
        </div>

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
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
                <p className="text-gray-600 mb-6">Track and view your order history</p>

                {ordersLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : ordersError ? (
                  <div className="text-center text-red-600 py-8">{ordersError}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                    <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
                    <Link
                      to="/"
                      className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h2 className="text-lg font-medium text-gray-900">Order #{order.id}</h2>
                              <p className="text-sm text-gray-500">{order.createdAt}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center py-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">₹{item.salePrice * item.quantity}</p>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">Total Amount</p>
                              <p className="text-sm font-medium text-gray-900">₹{order.total}</p>
                            </div>
                          </div>

                          {order.shippingDetails && (
                            <div className="border-t border-gray-200 pt-4 mt-4">
                              <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Details</h3>
                              <p className="text-sm text-gray-500">{order.shippingDetails.fullName}</p>
                              <p className="text-sm text-gray-500">{order.shippingDetails.address}</p>
                              <p className="text-sm text-gray-500">{order.shippingDetails.city}, {order.shippingDetails.pincode}</p>
                              <p className="text-sm text-gray-500">{order.shippingDetails.phone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activePage === "support" && (
              <div className="bg-white p-8 rounded shadow">
                Customer Support Page
              </div>
            )}

            {activePage === "wishlist" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>
                
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                    <Link
                      to="/"
                      className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-w-1 aspect-h-1">
                          <img
                            src={item.imageBase64}
                            alt={item.name}
                            className="w-full h-52 object-contain"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900">₹{item.salePrice}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <ShoppingCart size={16} />
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="p-2 text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg transition-colors"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activePage === "addresses" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <AddressManager />
              </div>
            )}

            {activePage === 'profile' && (
              <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Personal Information</h2>
                  <button
                    onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={profileData.gender === 'Male'}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mr-2"
                        />
                        Male
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={profileData.gender === 'Female'}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mr-2"
                        />
                        Female
                      </label>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={profileData.mobile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place</label>
                    <input
                      type="text"
                      name="place"
                      value={profileData.place}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={profileData.pincode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={profileData.landmark}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
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
