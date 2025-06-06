import React, { useState } from 'react';
import { 
  FiArrowLeft, 
  FiSave,
  FiAlertCircle,
  FiImage,
  FiX,
  FiMenu,
  FiLogOut,
  FiUser,
  FiShoppingBag,
  FiLayers,
  FiGrid,
  FiBell,
  FiSearch,
  FiUsers,
  FiShoppingCart,FiStar
} from 'react-icons/fi';
import { MdDeliveryDining, MdReviews } from "react-icons/md";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddDeliveryBoy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    address: '',
    phone: '',
    status: 'active'
  });
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleNotificationClick = () => {
    navigate('/dashboard/orderdetails');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'deliveryBoys'), formData);
      navigate('/dashboard/delivery-boys');
    } catch (err) {
      setError('Failed to add delivery boy: ' + err.message);
    } finally {
      setLoading(false);
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

  const isActive = (path) => path === '/dashboard/delivery-boys';

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Sidebar */}
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
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto " >
          {/* <div className="flex items-center mb-6">
            <Link to="/dashboard/delivery-boys" className="mr-4 text-gray-500 hover:text-gray-700">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Add New Delivery Boy</h1>
          </div> */}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter delivery boy name"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loading}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter delivery boy address"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Link 
                    to="/dashboard/delivery-boys"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : 'Create Delivery Boy'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddDeliveryBoy;