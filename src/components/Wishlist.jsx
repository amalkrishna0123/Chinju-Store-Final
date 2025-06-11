import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Heart, ShoppingCart, Trash, Search, ChevronDown, X } from 'lucide-react';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../Firebase';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FcGoogle } from 'react-icons/fc';
import { VscAccount } from "react-icons/vsc";
import apple from '../assets/apple.jpeg';
import {  useLocation } from 'react-router-dom';
import { MdLogin } from "react-icons/md";

const Wishlist = () => {
  const { currentUser, userId, signInWithGoogle, logout } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [userLocation, setUserLocation] = useState({
    address: 'Select your location',
    deliveryTime: '-- mins'
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setWishlistItems([]);
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setWishlistItems(userDoc.data().wishlist || []);
          setCartItems(userDoc.data().cartItems || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const itemToRemove = wishlistItems.find(item => item.id === itemId);
      if (!itemToRemove) return;
      
      await updateDoc(doc(db, 'users', userId), {
        wishlist: arrayRemove(itemToRemove)
      });
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Remove from wishlist error:', error);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update existing item quantity
        const updatedCartItems = cartItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
        
        await updateDoc(doc(db, 'users', userId), {
          cartItems: updatedCartItems
        });
        
        setCartItems(updatedCartItems);
      } else {
        // Add new item to cart
        const newCartItem = {
          ...item,
          quantity: 1,
          addedAt: new Date().toISOString()
        };
        
        const updatedCartItems = [...cartItems, newCartItem];
        
        await updateDoc(doc(db, 'users', userId), {
          cartItems: updatedCartItems
        });
        
        setCartItems(updatedCartItems);
      }
      
      // Remove from wishlist
      await handleRemoveFromWishlist(item.id);
      
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

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
              Sign in to Chinju Store
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

  // Cart Component
  const Cart = () => {
    if (!showCart) return null;
    
    const calculateTotal = () => {
      return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
                        <span className="font-semibold text-gray-900">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-gray-400 text-xs line-through ml-2">
                            ₹{item.originalPrice}
                          </span>
                        )}
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>

      {/* Header - Desktop View */}
      <div className="hidden md:block bg-white py-4 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-blue-600 text-3xl font-bold flex items-center">
              Chinju Store
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium ml-3">
                SUPER SAVER
              </span>
            </Link>
          </div>

{/* Delivery Info */}
{/* <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4 backdrop-blur-sm flex items-center">
          <div className="flex flex-col flex-1">
            <div className="text-black font-bold flex items-center">
              <span className="mr-2">
                Delivery in {userLocation.deliveryTime}
              </span>
              <span className="bg-white text-[#1a7e74] text-xs px-2 py-0.5 rounded-full">
                FAST
              </span>
            </div>
            <div className="flex items-center text-sm md:text-black text-black">
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
        </div> */}


          {/* Search Bar */}
          {/* <div className="w-1/3">
            <div className="bg-gray-50 flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="bg-transparent outline-none w-full text-gray-700"
              />
            </div>
          </div> */}

          {/* User and Cart */}
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <UserProfile />
            ) : (
              <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => setShowLoginModal(true)}
              >
                <ProfileIcon className="text-2xl text-gray-700 group-hover:text-blue-600 transition-colors" />
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
          <Link
            to="/"
            className="bg-white LogoFont text-[#1a7e74] px-4 py-2 rounded-lg font-bold text-xl shadow-md"
          >
            Chinju Store
          </Link>
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
                <ProfileIcon className="text-xl text-[#1a7e74]" />
              )}
            </div>
            {/* <div
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="text-xl text-[#1a7e74]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div> */}
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
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for products..."
            className="bg-white w-full pl-10 commonFont pr-4 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex items-center gap-2">
          <div className="hover:text-blue-500">
            <Link to="/">Home</Link>
          </div>
          <div>
            <IoIosArrowRoundForward className="text-lg" />
          </div>
          <div>My Wishlist</div>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 commonFont">My Wishlist</h1>
          <p className="text-gray-600">Save items you love to shop later</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Heart className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save your favorite items to shop them later</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="relative">
                  <Link to={`/product/${item.id}`}>
                  <img 
                    src={item.imageBase64 || apple} 
                    alt={item.name}
                    className="w-full h-40 object-contain"
                  />
                  </Link>
                  {item.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
                      {item.discount} OFF
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>

                <div className="p-3">
                  <Link to={`/product/${item.id}`}>
                  <h3 className="font-medium text-gray-800 text-sm clamp-text">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-500 mb-1">{item.weight}</p>
                  <p className="text-xs text-gray-500 mb-1">{item.stock}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-gray-900">₹{item.price || item.salePrice || item.originalPrice}</span>
                    {item.originalPrice && (
                      <span className="text-gray-400 text-xs line-through">₹{item.originalPrice}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-blue-600 text-white rounded-lg py-2 mt-3 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* Modals */}
      <LoginModal />
      <Cart />
    </div>
  );
};

export default Wishlist;


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
      alert("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
    }
  };