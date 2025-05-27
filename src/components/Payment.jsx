// src/Payment.js
import React, { useState } from "react";
import { CheckCircle, Wallet } from "lucide-react";
import { TbCurrencyRupee } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from './AuthContext';
import { db } from '../Firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    navigate('/order-confirm');
    return null;
  }

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_9tCOZuKLhiZdaM",
      amount: orderDetails.total * 100,
      currency: "INR",
      name: "Chinju Store",
      description: "Order Payment",
      handler: async function (response) {
        await createOrder('razorpay', response.razorpay_payment_id);
      },
      prefill: {
        name: orderDetails.shippingDetails.fullName,
        email: currentUser.email,
        contact: orderDetails.shippingDetails.phone,
      },
      theme: {
        color: "#528FF0",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const createOrder = async (paymentMethod, paymentId = null) => {
    try {
      setLoading(true);
      
      const orderData = {
        userId: currentUser.uid,
        items: orderDetails.items,
        shippingDetails: orderDetails.shippingDetails,
        paymentMethod: paymentMethod,
        paymentId: paymentId,
        total: orderDetails.total,
        status: paymentMethod === 'cod' ? 'Pending' : 'Paid',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        cartItems: []
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else if (paymentMethod === 'cod') {
      await createOrder('cod');
    }
  };

  return (
    <div className="py-10 h-auto px-2 w-full flex justify-center items-center bg-gray-100 overflow-hidden ">
      
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Order Confirm
          </button>
        </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
          
          {/* Payment Methods */}
          <div className="space-y-4 mb-6">
            <label className="block relative">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 ${paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-8" />
                <span className="font-medium">Pay with Razorpay</span>
              </div>
            </label>

            <label className="block relative">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <Wallet size={24} />
                <span className="font-medium">Cash on Delivery</span>
              </div>
            </label>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium flex items-center"><TbCurrencyRupee/>{item.salePrice * item.quantity}</p>
                </div>
              ))}
              <div className="flex justify-between pt-4 font-semibold text-lg">
                <span>Total Amount</span>
                <span className="flex items-center"><TbCurrencyRupee/>{orderDetails.total}</span>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button 
            onClick={handlePayment}
            disabled={loading || !paymentMethod}
            className={`w-full mt-6 bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition-colors ${loading || !paymentMethod ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
