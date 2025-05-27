import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase/'; // Make sure you have firebase configured
import { Check, X, Truck, Package, Clock } from 'lucide-react';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Welcome,</span>
            <span className="font-medium">{deliveryName}</span>
            <button
              onClick={() => {
                localStorage.removeItem('deliveryName');
                window.location.href = '/login';
              }}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
         ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow p-6">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No New Orders</h3>
            <p className="text-gray-500">There are currently no orders available for delivery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h2>
                    <p className="text-gray-600">{order.shippingDetails?.fullName}</p>
                    <p className="text-gray-600">{order.shippingDetails?.address}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">Items:</h3>
                  <ul className="space-y-1">
                    {order.items?.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>{item.quantity} x ₹{item.salePrice}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Total: ₹{order.total}</p>
                    <p className="text-sm text-gray-500">Ordered at: {new Date(order.createdAt?.toDate()).toLocaleString()}</p>
                  </div>

                  {!order.deliveryBoy && order.status === 'Accept' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Check size={16} className="mr-1" /> Accept
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X size={16} className="mr-1" /> Reject
                      </button>
                    </div>
                  ) : order.deliveryBoy === deliveryName ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={order.deliveryStatus || 'pending'}
                        onChange={(e) => handleDeliveryStatusChange(order.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={order.deliveryStatus === 'cancelled'}
                      >
                        <option value="pending">Pending</option>
                        <option value="departed">Departed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {order.deliveryStatus !== 'cancelled' && (
                        <button
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setShowCancelModal(true);
                          }}
                          className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Cancel Delivery
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Delivery Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Cancel Delivery</h3>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a reason</option>
              {cancelReasons.map((reason, index) => (
                <option key={index} value={reason}>{reason}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedOrderId(null);
                  setCancelReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelDelivery}
                disabled={!cancelReason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;