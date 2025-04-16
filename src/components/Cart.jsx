import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Minus, Plus, Trash } from 'lucide-react';
import { useAuth } from './AuthContext';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../Firebase';

const Cart = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch cart items from Firestore
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser?.uid) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setCartItems(userDoc.data().cartItems || []);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen, currentUser]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const updatedItems = cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      
      if (currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          cartItems: updatedItems
        });
      }
      
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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.salePrice * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!currentUser?.uid) return;
    
    setCheckoutLoading(true);
    try {
      // Create order
      const orderData = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: cartItems,
        total: calculateTotal() + 40, // Including delivery
        status: 'Processing'
      };

      // Add to orders and clear cart
      await updateDoc(doc(db, 'users', currentUser.uid), {
        orders: arrayUnion(orderData),
        cartItems: []
      });

      setCartItems([]);
      onClose();
      // You might want to navigate to orders page or show success message
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center md:justify-end">
      <div className="w-full md:w-1/3 h-full md:h-screen bg-white md:shadow-lg transform transition-transform duration-300 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Your Cart {cartItems.length > 0 ? `(${cartItems.length})` : ''}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <ShoppingCart size={24} />
            </div>
            <p className="text-center text-gray-600 mb-6">
              Your cart is empty
            </p>
            <button 
              onClick={onClose}
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
                    src={item.imageBase64 || '/placeholder-product.jpg'} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-lg" 
                  />
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
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-500 hover:text-blue-600"
                        disabled={item.quantity <= 1}
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
              <div className="flex justify-between mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">₹{calculateTotal() + 40}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-[#1a7e74] text-white py-3 rounded-lg hover:bg-[#145f5a] transition duration-200 flex items-center justify-center"
              >
                {checkoutLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;