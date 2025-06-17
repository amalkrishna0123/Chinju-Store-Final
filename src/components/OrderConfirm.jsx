import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { db } from '../Firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp, arrayUnion, onSnapshot } from 'firebase/firestore';
import { Phone, MapPin, CreditCard, Wallet, ArrowLeft } from 'lucide-react';
import AddressManager from './AddressManager';

const OrderConfirm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Fetch cart items with real-time listener (same as BottomNav)
  useEffect(() => {
    if (!currentUser?.uid) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    console.log('Setting up real-time listener for user:', currentUser.uid);

    // Set up real-time listener for the user document
    const unsubscribe = onSnapshot(
      doc(db, "users", currentUser.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          console.log('Real-time data received:', userData);
          console.log('Cart items from Firestore:', userData.cartItems);
          setCartItems(userData.cartItems || []);
        } else {
          console.log('User document does not exist');
          setCartItems([]);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error listening to cart changes:", error);
        // Fallback to currentUser.cartItems if listener fails
        setCartItems(currentUser.cartItems || []);
        setIsLoading(false);
      }
    );

    // Initial load from currentUser if available
    if (currentUser.cartItems) {
      console.log('Initial load from currentUser:', currentUser.cartItems);
      setCartItems(currentUser.cartItems);
    }

    // Cleanup listener on unmount
    return () => {
      console.log('Cleaning up listener');
      unsubscribe();
    };
  }, [currentUser?.uid]);


  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems?.length) {
      alert('Your cart is empty!');
      return;
    }

    if (!selectedAddress) {
      alert('Please select a delivery address!');
      return;
    }

    // Calculate total amount
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.salePrice * item.quantity);
    }, 0);

    // Navigate to payment page with order details
    navigate('/payment', {
      state: {
        orderDetails: {
          items: cartItems,
          shippingDetails: selectedAddress,
          total: total
        }
      }
    });
  };


  // Navigate Profile -> Address
  const navigateAddress = () => {
    navigate("/addresses")
  }

  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

  // Show loading while fetching cart data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 commonFont">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering with cart items:', cartItems);
  console.log('Cart items count:', cartItems.length);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 commonFont text-sm hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center commonFont">
          Order Confirmation
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 space-y-6"
        >
          {/* Shipping Details */}
          <div className="space-y-4">
            <h2 className="commonFont text-gray-900 flex items-center gap-2 font-semibold">
              <MapPin size={20} />
              Shipping Details
            </h2>

            {showAddressForm ? (
              <div className="border rounded-lg p-4">
                <AddressManager
                  onSelectAddress={handleSelectAddress}
                  selectedAddressId={selectedAddress?.id}
                  hideAddressForm={false}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* <AddressManager
                  onSelectAddress={handleSelectAddress}
                  selectedAddressId={selectedAddress?.id}
                  hideAddressForm={false}
                  onAddressAdded={(newAddress) => {
                    setSelectedAddress(newAddress);
                    setShowAddressForm(false);
                  }}
                /> */}
                {!selectedAddress && (
                  <button
                    type="button"
                    onClick={navigateAddress}
                    className="w-full py-2 px-4 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:text-blue-700 hover:border-blue-300"
                  >
                    + Add New Address
                  </button>
                )}
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 commonFont">
              Order Summary
            </h2>
            <div className="space-y-2">
              {cartItems?.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b"
                  >
                    <div>
                      <p className="font-medium commonFont text-sm">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 commonFont">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium commonFont text-[15px]">
                      ₹{item.salePrice * item.quantity}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Your cart is empty
                </div>
              )}
              <div className="flex justify-between pt-4 font-semibold text-lg commonFont">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !selectedAddress || !cartItems?.length}
              className={`w-full py-3 px-4 text-white font-medium rounded-lg ${
                loading || !selectedAddress || !cartItems?.length
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderConfirm;