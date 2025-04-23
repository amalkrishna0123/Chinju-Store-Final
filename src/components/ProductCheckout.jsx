import { useState } from 'react';
import { ShoppingCart, CreditCard, Truck, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

export default function ProductCheckout() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Midnight Black');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const productPrice = 129.99;
  const shippingPrice = 4.99;
  const discount = promoApplied ? 15 : 0;
  const subtotal = productPrice * quantity;
  const total = subtotal + shippingPrice - discount;

  const colors = [
    { name: 'Midnight Black', hex: 'bg-gray-900' },
    { name: 'Ocean Blue', hex: 'bg-blue-600' },
    { name: 'Forest Green', hex: 'bg-green-700' },
    { name: 'Ruby Red', hex: 'bg-red-600' },
  ];

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save15') {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Product Details Section */}
          <div className="lg:col-span-7 mb-10 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Product */}
              <div className="p-6 sm:p-8 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 w-full sm:w-32 h-32 mb-4 sm:mb-0">
                    <div className="bg-gray-100 rounded-lg w-full h-full flex items-center justify-center">
                      <ShoppingCart size={48} className="text-gray-500" />
                    </div>
                  </div>
                  <div className="sm:ml-6 flex-1">
                    <div className="flex justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Premium Wireless Headphones</h2>
                      <p className="text-lg font-semibold text-gray-900">${productPrice}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Premium audio experience with noise cancellation</p>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900">Color</h3>
                      <div className="flex items-center space-x-3 mt-2">
                        {colors.map(color => (
                          <button
                            key={color.name}
                            className={`relative w-8 h-8 rounded-full ${color.hex} focus:outline-none ring-2 ${
                              selectedColor === color.name ? 'ring-blue-500' : 'ring-transparent'
                            }`}
                            onClick={() => setSelectedColor(color.name)}
                            title={color.name}
                          >
                            {selectedColor === color.name && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <Check size={16} className="text-white" />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{selectedColor}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                      <div className="flex items-center mt-2">
                        <button 
                          onClick={decrementQuantity}
                          className="text-gray-500 focus:outline-none focus:text-gray-600 p-1 border border-gray-300 rounded-l-md"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <input
                          type="text"
                          value={quantity}
                          readOnly
                          className="w-12 text-center border-t border-b border-gray-300 py-1"
                        />
                        <button 
                          onClick={incrementQuantity}
                          className="text-gray-500 focus:outline-none focus:text-gray-600 p-1 border border-gray-300 rounded-r-md"
                        >
                          <ChevronUp size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Information */}
              <div className="p-6 sm:p-8 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-4">
                  <div 
                    className={`flex items-center p-4 border ${paymentMethod === 'credit-card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg cursor-pointer`}
                    onClick={() => setPaymentMethod('credit-card')}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'credit-card' ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
                      {paymentMethod === 'credit-card' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </div>
                    <div className="ml-3 flex items-center">
                      <CreditCard size={20} className="text-gray-500" />
                      <span className="ml-2 font-medium">Credit Card</span>
                    </div>
                  </div>
                  <div 
                    className={`flex items-center p-4 border ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg cursor-pointer`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'paypal' ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
                      {paymentMethod === 'paypal' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </div>
                    <div className="ml-3">
                      <span className="font-medium">PayPal</span>
                    </div>
                  </div>
                </div>
                
                {paymentMethod === 'credit-card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                        <input type="text" placeholder="XXX" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Summary Section */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="hidden lg:block">
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</p>
                    <p className="font-medium">${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium">${shippingPrice.toFixed(2)}</p>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between py-2 text-green-600">
                      <p>Discount (SAVE15)</p>
                      <p className="font-medium">-${discount.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-lg font-semibold">${total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="lg:hidden">
                  <button 
                    className="w-full flex justify-between items-center py-2"
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                  >
                    <span className="font-medium">
                      {showOrderSummary ? 'Hide order summary' : 'Show order summary'}
                    </span>
                    <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                    {showOrderSummary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  {showOrderSummary && (
                    <div className="mt-4">
                      <div className="flex justify-between py-2">
                        <p className="text-gray-600">Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</p>
                        <p className="font-medium">${subtotal.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between py-2">
                        <p className="text-gray-600">Shipping</p>
                        <p className="font-medium">${shippingPrice.toFixed(2)}</p>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between py-2 text-green-600">
                          <p>Discount (SAVE15)</p>
                          <p className="font-medium">-${discount.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center mb-4">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="px-4 text-sm text-gray-500">OR</span>
                    <div className="h-px flex-1 bg-gray-200"></div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Promo code" 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button 
                      className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                      onClick={applyPromoCode}
                    >
                      Apply
                    </button>
                  </div>
                  
                  {promoError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <X size={16} className="mr-1" /> Invalid promo code
                    </p>
                  )}
                  
                  {promoApplied && (
                    <p className="mt-2 text-sm text-green-600 flex items-center">
                      <Check size={16} className="mr-1" /> Promo code applied!
                    </p>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Try code: <span className="font-medium">SAVE15</span> for 15% off
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center font-medium">
                    <Truck size={20} className="mr-2" />
                    Complete Purchase
                  </button>
                </div>
                
                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>Estimated delivery: 3-5 business days</p>
                  <p className="mt-1">Free returns within 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}