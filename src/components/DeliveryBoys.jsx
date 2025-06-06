import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiImage,
  FiShoppingBag,
  FiLayers,
  FiGrid,
  FiBell,
  FiUsers,
  FiShoppingCart,
  FiStar
} from 'react-icons/fi';
import { MdDeliveryDining, MdReviews } from "react-icons/md";

const DeliveryBoys = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);

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

  const handleLogout = () => {
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FiGrid /> },
    { label: "Categories", path: "/dashboard/view-category", icon: <FiLayers /> },
    { label: "Products", path: "/dashboard/view-product", icon: <FiShoppingBag /> },
    { label: "Banners", path: "/dashboard/view-banner", icon: <FiImage /> },
    { label: "Orders", path: "/dashboard/orderdetails", icon: <FiShoppingCart /> },
    { label: "Users", path: "/dashboard/users", icon: <FiUsers /> },
    { label: "Delivery Boys", path: "/dashboard/delivery-boys", icon: <MdDeliveryDining /> },
    { label: "Reviews", path: "/dashboard/reviewmanagement", icon: <FiStar /> },
  ];

  const isActive = (path) => {
    return location.pathname === path ;
  };

  const filteredDeliveryBoys = deliveryBoys.filter(boy => 
    boy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleNotificationClick = () => {
    navigate('/dashboard/orderdetails');
  };
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      
        {/* Sidebar - Now a slide-out menu */}
        <div
        className={`fixed top-0 left-0 h-[calc(100vh-4rem)] bg-white shadow-xl border-r border-slate-200 overflow-auto transition-all duration-300 ease-in-out z-20 ${
          sidebarOpen  ? "translate-x-0 w-80 sm:w-80" : "-translate-x-full w-0"
        } lg:translate-x-0 lg:w-80 lg:top-0 lg:h-screen lg:block`}
      >
      {/* Brand Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="text-xl font-bold text-white">AdminPanel</div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>
  
      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
              isActive(item.path)
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className={`text-lg ${isActive(item.path) ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`}>
              {item.icon}
            </div>
            <span className="ml-3 text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
  
      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <FiLogOut size={18} />
          <span className="ml-3 text-sm">Logout</span>
        </button>
      </div>
    </div>

      {/* Enhanced Main content */}
      <div className="flex flex-col flex-1 overflow-hidden md:ml-[300px]">
        
        {/* Enhanced Top header */}
        <header className="flex items-center justify-between px-4 sm:px-6 h-16 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-4">
          {/* Menu Button - Now always visible to open the sidebar */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <FiMenu size={20} />
          </button>
          <h2 className="text-base sm:text-xl font-bold text-gray-800 hidden sm:block">Delivery Boys</h2>
        </div>
  
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Search input */}
      {/* <div className="relative w-full sm:w-80">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search anything..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
      </div> */}
  
          {/* Notifications */}
          <div className="relative">
            <button onClick={handleNotificationClick} className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <FiBell size={20} className="text-gray-600" />
              {unreadOrderCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                  {unreadOrderCount}
                </span>
              )}
            </button>
          </div>
  
          {/* Profile */}
          <div className="hidden sm:flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <FiUser size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">Admin User</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>
        </div>
      </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            {/* <div className="flex items-center">
              <Link to="/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
                <FiArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Delivery Boys</h1>
            </div> */}
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
        </main>
      </div>
    </div>
  );
};

export default DeliveryBoys;