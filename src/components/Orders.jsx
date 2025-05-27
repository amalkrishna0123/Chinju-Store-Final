import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ShoppingBag, Package, Truck, CheckCircle, Search, ChevronDown, ShoppingCart, X } from 'lucide-react';
import { CgProfile } from "react-icons/cg";
import { FcGoogle } from 'react-icons/fc';
import { MdLogin } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase';
import { Link, useLocation } from 'react-router-dom';
import { IoIosArrowRoundForward } from "react-icons/io";

const Orders = () => {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({
    address: 'Select your location',
    deliveryTime: '-- mins'
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const navigate = useNavigate();

  // Fetch orders from Firestore
  // Improved fetchOrders function for Orders.jsx
useEffect(() => {
  const fetchOrders = async () => {
    if (!currentUser?.uid) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create the query but handle the case where indexes might not be ready
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
        
        // Sort the results in memory (less efficient but works without index)
        ordersData.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Sort in descending order
        });
      }

      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [currentUser]);

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

  // Improved location function
  const fetchCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Set a simple location without relying on Google API
            setUserLocation({
              address: `Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              deliveryTime: '9 mins'
            });
            
            // Save location to user's profile if logged in
            if (currentUser?.uid) {
              await updateDoc(doc(db, 'users', currentUser.uid), {
                location: {
                  address: `Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                  coordinates: {
                    lat: latitude,
                    lng: longitude
                  }
                }
              });
            }
          } catch (error) {
            console.error('Error setting location:', error);
            alert("Could not detect your precise location. Using default address.");
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert("Location permission denied. Please allow location access to use this feature.");
          setIsLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
    }
  };

  // Call this in useEffect when user logs in
  useEffect(() => {
    if (currentUser?.location?.address) {
      setUserLocation({
        address: currentUser.location.address,
        deliveryTime: '9 mins'
      });
    }
  }, [currentUser]);

  // Handle cart click
  const handleCartClick = () => {
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      setShowCart(true);
    }
  };

  // User Profile Component
  const UserProfile = () => (
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
              <VscAccount className="text-white text-3xl" />
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

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return <Package className="text-blue-500" size={20} />;
      case 'shipped':
        return <Truck className="text-orange-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <ShoppingBag className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Gradient top bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>

      {/* Header - Desktop View */}
      <div className="hidden md:block bg-white py-4 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
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
          {/* <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
            <div className="mr-3">
              <div className="text-blue-600 font-bold">
                Delivery in {userLocation.deliveryTime}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>{userLocation.address}</span>
                <ChevronDown size={16} className="ml-1" />
              </div>
            </div>
            <div className="h-8 w-px bg-gray-300 mx-2"></div>
            <button
              onClick={fetchCurrentLocation}
              disabled={isLoadingLocation}
              className="text-indigo-500 font-medium flex items-center hover:text-indigo-600"
            >
              {isLoadingLocation ? "Loading..." : "Change"}
            </button>
          </div> */}

          {/* Search Bar */}
          {/* <div className="bg-gray-50 flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              className="bg-transparent outline-none w-full text-gray-700"
            />
          </div> */}

          {/* Login and Cart */}
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <UserProfile />
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
            )}
            {/* <div
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
            </div> */}
            {/* <div className="flex items-center space-x-2 cursor-pointer group">
              <a
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md relative">
                  <MdLogin className="text-xl text-[#1a7e74]" />
                </div>

                <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                  Login
                </span>
              </a>
            </div> */}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-[#65D2CD] to-[#2CAA9E] p-4">
        {/* Logo Section */}
        <div className="flex justify-between items-center mb-4">
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
        </div>

        {/* Mobile User Dropdown */}
        {showUserDropdown && currentUser && (
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
        )}

        {/* Delivery Info */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4 backdrop-blur-sm flex items-center">
          <div className="flex flex-col flex-1">
            <div className="text-white font-bold flex items-center">
              <span className="mr-2">
                Delivery in {userLocation.deliveryTime}
              </span>
              <span className="bg-white text-[#1a7e74] text-xs px-2 py-0.5 rounded-full">
                FAST
              </span>
            </div>
            <div className="flex items-center text-sm md:text-white text-black">
              <span>{userLocation.address}</span>
              <ChevronDown size={14} className="ml-1" />
            </div>
          </div>
          <button
            onClick={fetchCurrentLocation}
            disabled={isLoadingLocation}
            className="bg-white px-3 py-1 rounded-lg text-[#1a7e74] font-medium text-sm"
          >
            {isLoadingLocation ? "Loading..." : "Change"}
          </button>
        </div>
      </div>

      {/* Render Modals */}
      <LoginModal />
      {showCart && (
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
              <div className="p-4 text-center">
                <p className="text-gray-600">Cart functionality would be implemented here</p>
              </div>
            )}
          </div>
        </div>
      )}

<div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="hover:text-blue-500">
              <Link to="/">Home</Link>
            </div>
            <div>
              <IoIosArrowRoundForward className="text-lg" />
            </div>
            <div>Orders</div>
          </div>
        </div>

      {/* Orders Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600">Track and view your order history</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
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
    </div>
  );
};

export default Orders;