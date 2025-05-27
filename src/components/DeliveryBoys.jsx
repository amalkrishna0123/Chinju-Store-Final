import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { 
  FiEdit2,
  FiTrash2,
  FiArrowLeft,
  FiPlus,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiUser
} from 'react-icons/fi';

const DeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      setIsRefreshing(true);
      const querySnapshot = await getDocs(collection(db, 'deliveryBoys'));
      const deliveryBoysData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDeliveryBoys(deliveryBoysData);
      setError('');
    } catch (err) {
      setError('Failed to fetch delivery boys: ' + err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const deliveryBoyRef = doc(db, 'deliveryBoys', id);
      await updateDoc(deliveryBoyRef, {
        status: currentStatus === 'active' ? 'inactive' : 'active'
      });
      fetchDeliveryBoys(); // Refresh the list
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery boy?')) {
      try {
        await deleteDoc(doc(db, 'deliveryBoys', id));
        fetchDeliveryBoys(); // Refresh the list
      } catch (err) {
        setError('Failed to delete delivery boy: ' + err.message);
      }
    }
  };

  const filteredDeliveryBoys = deliveryBoys.filter(boy => 
    boy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Delivery Boys</h1>
        </div>
        <Link
          to="/dashboard/add-delivery-boy"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus size={16} className="mr-2" />
          Add New Delivery Boy
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex items-center w-full max-w-xs">
              <FiSearch className="absolute left-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search delivery boys..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={fetchDeliveryBoys}
                disabled={isRefreshing}
              >
                <FiRefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none">
                <FiFilter size={16} className="mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredDeliveryBoys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FiUser size={48} className="mb-4 text-gray-300" />
            {searchTerm ? 'No delivery boys found matching your search.' : 'No delivery boys found. Add your first delivery boy!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeliveryBoys.map((boy) => (
                <tr key={boy.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{boy.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{boy.gender}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{boy.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{boy.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(boy.id, boy.status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        boy.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {boy.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link
                        to={`/dashboard/edit-delivery-boy/${boy.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(boy.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredDeliveryBoys.length}</span> of{" "}
            <span className="font-medium">{deliveryBoys.length}</span> delivery boys
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoys;