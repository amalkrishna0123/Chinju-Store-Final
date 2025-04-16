import React from 'react';
import { useAuth } from './AuthContext';
import { ShoppingBag, Package, Truck, CheckCircle } from 'lucide-react';

const Orders = () => {
  const { currentUser } = useAuth();

  // Mock orders data (in a real app, this would come from your backend)
  const orders = [
    {
      id: "ORD001",
      date: "2024-01-15",
      total: 299,
      status: "Delivered",
      items: [
        { name: "Organic Red Apple", quantity: 2, price: 67 },
        { name: "Fresh Strawberries", quantity: 1, price: 87 },
      ]
    },
    {
      id: "ORD002",
      date: "2024-01-10",
      total: 458,
      status: "Processing",
      items: [
        { name: "Alphonso Mango", quantity: 2, price: 135 },
        { name: "Sweet Banana", quantity: 3, price: 45 },
      ]
    }
  ];

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-600">Track and view your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-500">When you place an order, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className={`text-sm font-medium ${
                    order.status.toLowerCase() === 'delivered' ? 'text-green-600' :
                    order.status.toLowerCase() === 'processing' ? 'text-blue-600' :
                    'text-orange-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800">{item.name}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">₹{order.total}</span>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  View Details
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;