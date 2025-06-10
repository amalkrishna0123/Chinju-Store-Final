import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { db } from '../Firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { Phone, MapPin, CreditCard, Wallet, ArrowLeft } from 'lucide-react';
import AddressManager from './AddressManager';

const OrderConfirm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?.cartItems?.length) {
      alert('Your cart is empty!');
      return;
    }

    if (!selectedAddress) {
      alert('Please select a delivery address!');
      return;
    }

    // Calculate total amount
    const total = currentUser.cartItems.reduce((sum, item) => {
      return sum + (item.salePrice * item.quantity);
    }, 0);

    // Navigate to payment page with order details
    navigate('/payment', {
      state: {
        orderDetails: {
          items: currentUser.cartItems,
          shippingDetails: selectedAddress,
          total: total
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 commonFont text-sm hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center commonFont">Order Confirmation</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 space-y-6">
          {/* Shipping Details */}
          <div className="space-y-4">
            <h2 className="commonFont text-gray-900 flex items-center gap-2 font-semibold">
              <MapPin size={20} />
              Shipping Details
            </h2>

            <AddressManager
              onSelectAddress={handleSelectAddress}
              selectedAddressId={selectedAddress?.id}
              hideAddressForm={true}
            />
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 commonFont">Order Summary</h2>
            <div className="space-y-2">
              {currentUser?.cartItems?.length > 0 ? (
                currentUser.cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium commonFont text-sm">{item.name}</p>
                      <p className="text-sm text-gray-500 commonFont">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium commonFont text-[15px]">₹{item.salePrice * item.quantity}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">Your cart is empty</div>
              )}
              <div className="flex justify-between pt-4 font-semibold text-lg commonFont">
                <span>Total Amount</span>
                <span>₹{currentUser?.cartItems?.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0) || 0}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !selectedAddress || !currentUser?.cartItems?.length}
              className={`w-full py-3 px-4 text-white font-medium rounded-lg ${loading || !selectedAddress || !currentUser?.cartItems?.length ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderConfirm;