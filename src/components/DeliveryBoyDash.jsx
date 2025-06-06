import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase/'; // Make sure you have firebase configured
import { Check, X, Truck, Package, Clock, Menu, User, LogOut } from 'lucide-react';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const deliveryName = localStorage.getItem('deliveryName');

  const cancelReasons = [
    'Customer not available',
    'Wrong address',
    'Bad weather conditions',
    'Vehicle breakdown',
    'Customer requested cancellation',
    'Other'
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Only fetch orders that have been accepted by admin and either unassigned or assigned to current delivery boy
        const q = query(
          collection(db, 'orders'),
          where('status', 'in', ['Accept', 'accept']),
          where('deliveryBoy', '==', null)
        );
        
        // Get orders assigned to current delivery boy
        const assignedQuery = query(
          collection(db, 'orders'),
          where('status', 'in', ['Accept', 'accept']),
          where('deliveryBoy', '==', deliveryName)
        );
        // Fetch both unassigned and assigned orders
        const [unassignedSnapshot, assignedSnapshot] = await Promise.all([
          getDocs(q),
          getDocs(assignedQuery)
        ]);

        // Combine and process the orders
        const unassignedOrders = unassignedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const assignedOrders = assignedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Combine both sets of orders
        setOrders([...unassignedOrders, ...assignedOrders]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'Accept',
        deliveryStatus: 'pending',
        deliveryBoy: deliveryName
      });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'Accept', deliveryStatus: 'pending', deliveryBoy: deliveryName } : order
      ));
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'Reject',
        deliveryBoy: deliveryName
      });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'Reject', deliveryBoy: deliveryName } : order
      ));
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  const handleDeliveryStatusChange = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (order.deliveryStatus === 'delivered') {
        return; // Prevent changes if already delivered
      }
      
      await updateDoc(doc(db, 'orders', orderId), {
        deliveryStatus: newStatus
      });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, deliveryStatus: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const handleCancelDelivery = async () => {
    if (!selectedOrderId || !cancelReason) return;

    try {
      await updateDoc(doc(db, 'orders', selectedOrderId), {
        deliveryStatus: 'cancelled',
        cancelReason: cancelReason
      });
      setOrders(orders.map(order => 
        order.id === selectedOrderId ? { ...order, deliveryStatus: 'cancelled', cancelReason: cancelReason } : order
      ));
      setShowCancelModal(false);
      setSelectedOrderId(null);
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling delivery:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'on the way': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Truck className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">Delivery Dashboard</h1>
          </div>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="mt-3 border-t pt-3">
            <div className="flex items-center space-x-3 mb-3">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Welcome, {deliveryName}</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('deliveryName');
                window.location.href = '/login';
              }}
              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-5 w-5" />
              <span>Welcome, <span className="font-medium text-gray-900">{deliveryName}</span></span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('deliveryName');
                window.location.href = '/login';
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders available</h3>
              <p className="text-gray-500">Check back later for new delivery assignments.</p>
            </div>
          ) : (
            <div className="space-y-4 lg:space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="px-4 py-4 lg:px-6 lg:py-5 border-b border-gray-200">
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h2 className="text-lg font-semibold text-gray-900 truncate">
                            Order #{order.id.slice(0, 8)}
                          </h2>
                          <Clock className="h-4 w-4 text-gray-400 hidden sm:block" />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="font-medium">{order.shippingDetails?.fullName}</p>
                          <p className="line-clamp-2">{order.shippingDetails?.address}</p>
                          <p className="text-xs">
                            Ordered: {new Date(order.createdAt?.toDate()).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-3">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-4 py-4 lg:px-6 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 flex-1 min-w-0 pr-4">
                            <span className="truncate block">{item.name}</span>
                          </span>
                          <span className="text-gray-900 font-medium whitespace-nowrap">
                            {item.quantity} × ₹{item.salePrice}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total Amount</span>
                        <span className="text-lg font-bold text-gray-900">₹{order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-4 py-4 lg:px-6 bg-gray-50">
                    {!order.deliveryBoy && order.status === 'Accept' ? (
                      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1 sm:flex-none"
                        >
                          <Check size={16} className="mr-2" /> 
                          Accept Order
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1 sm:flex-none"
                        >
                          <X size={16} className="mr-2" /> 
                          Reject Order
                        </button>
                      </div>
                    ) : order.deliveryBoy === deliveryName ? (
                      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                          <label className="text-sm font-medium text-gray-700 sm:whitespace-nowrap">
                            Delivery Status:
                          </label>
                          <select
                            value={order.deliveryStatus || 'pending'}
                            onChange={(e) => handleDeliveryStatusChange(order.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0 flex-1 sm:flex-none sm:min-w-[140px]"
                            disabled={order.deliveryStatus === 'delivered' ||order.deliveryStatus === 'cancelled'}
                          >
                            <option value="pending">Pending</option>
                            <option value="departed">Departed</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        {order.deliveryStatus !== 'delivered' && order.deliveryStatus !== 'cancelled' && (
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setShowCancelModal(true);
                            }}
                            className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Cancel Delivery
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        This order is assigned to another delivery person.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Delivery Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Delivery</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please select a reason for cancelling this delivery:
              </p>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a reason</option>
                {cancelReasons.map((reason, index) => (
                  <option key={index} value={reason}>{reason}</option>
                ))}
              </select>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 sm:justify-end">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedOrderId(null);
                    setCancelReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelDelivery}
                  disabled={!cancelReason}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;