// src/Payment.js
import React, { useState, useEffect } from "react";
import { CheckCircle, Wallet } from "lucide-react";
import { TbCurrencyRupee } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from './AuthContext';
import { db } from '../Firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp, getDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

// Haversine Distance Formula
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(40);
  // Add delivery charge constant at the top
  // const DELIVERY_CHARGE = 40;


  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      if (!currentUser?.uid) return;

      try {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        const storeLat = 10.52700579443476;
        const storeLng = 76.08863395142001;

        const userCoords = docSnap.data()?.location?.coordinates;
        if (userCoords) {
          const distance = getDistanceFromLatLonInKm(
            storeLat,
            storeLng,
            userCoords.lat,
            userCoords.lng
          );

          setDeliveryCharge(distance <= 5 ? 0 : 40);
        }
      } catch (error) {
        // console.error("Error fetching location:", error);
      }
    };

    fetchDeliveryCharge();
  }, [currentUser]);
  
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
    try {
      setLoading(true);

      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        alert("Failed to load Razorpay SDK. Check your internet connection.");
        setLoading(false);
        return;
      }

      // Calculate total with delivery
      const totalWithDelivery = orderDetails.total + deliveryCharge;

      const options = {
        key: "rzp_live_6D2pAOoOcVdAop",
        amount: Math.round(totalWithDelivery * 100), // Include delivery in amount
        currency: "INR",
        name: "Your Store Name",
        description: "Order Payment",
        order_id: undefined,
        handler: async function (response) {
          try {
            // console.log("Payment successful:", response);
            await createOrder("razorpay", response.razorpay_payment_id);
          } catch (error) {
            // console.error("Error in payment handler:", error);
            alert(
              "Payment completed but order creation failed. Please contact support."
            );
          }
        },
        prefill: {
          name: orderDetails.shippingDetails?.fullName || "",
          email: currentUser?.email || "",
          contact: orderDetails.shippingDetails?.phone || "",
        },
        notes: {
          deliveryCharge: deliveryCharge.toString(),
          subtotal: orderDetails.total.toString(),
        },
        theme: {
          color: "#528FF0",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      // console.error("Error in handleRazorpayPayment:", error);
      alert("Failed to initialize payment. Please try again.");
      setLoading(false);
    }
  };

  const createOrder = async (paymentMethod, paymentId = null) => {
    try {
      setLoading(true);
      
      // Validate required data
      if (!currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      if (!orderDetails.items || orderDetails.items.length === 0) {
        throw new Error("No items in order");
      }

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

      // console.log("Creating order with data:", orderData);

      await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart
      await updateDoc(doc(db, 'users', currentUser.uid), {
        cartItems: []
      });

      // console.log("Order created successfully");
      navigate('/orders');
      
    } catch (error) {
      // console.error('Error creating order:', error);
      alert(`Failed to create order: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // console.log("Processing payment with method:", paymentMethod);

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
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-gray-900 commonFont text-sm"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Order Confirm
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 commonFont text-center md:text-start">
            Payment Method
          </h2>

          {/* Payment Methods */}
          <div className="space-y-4 mb-6">
            <label className="block relative">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div
                className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 ${
                  paymentMethod === "razorpay"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <img
                  src="https://razorpay.com/assets/razorpay-glyph.svg"
                  alt="Razorpay"
                  className="h-8"
                />
                <span className="font-medium commonFont">
                  Pay with Razorpay
                </span>
              </div>
            </label>

            <label className="block relative">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div
                className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 ${
                  paymentMethod === "cod"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <Wallet size={24} />
                <span className="font-medium commonFont">Cash on Delivery</span>
              </div>
            </label>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-4 commonFont">
              Order Summary
            </h3>
            <div className="space-y-2">
              {orderDetails.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between py-2 border-b"
                >
                  <div>
                    <p className="font-medium commonFont">{item.name}</p>
                    <p className="text-sm text-gray-500 commonFont">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium flex items-center commonFont text-[15px]">
                    <TbCurrencyRupee />
                    {item.salePrice * item.quantity}
                  </p>
                  {/* Add this before the total amount */}
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-medium flex items-center">
                      {deliveryCharge === 0 ? (
                        "Free"
                      ) : (
                        <>
                          <TbCurrencyRupee />
                          {deliveryCharge}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-4 font-semibold text-lg commonFont">
                <span>Total Amount</span>
                <span className="flex items-center">
                  <TbCurrencyRupee />
                  {orderDetails.total + deliveryCharge}
                </span>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading || !paymentMethod}
            className={`w-full mt-6 bg-green-500 text-white py-3 rounded commonFont font-medium hover:bg-green-600 transition-colors ${
              loading || !paymentMethod ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;