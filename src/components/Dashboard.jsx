import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Routes, Route } from "react-router-dom";
import { db } from '../Firebase';
import { collection, getDocs, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { 
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiUser, 
  FiShoppingBag, 
  FiLayers, 
  FiGrid, 
  FiImage,
  FiBell,
  FiSearch,
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
  FiBarChart2,
  FiDollarSign,
  FiStar
} from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb";
import { MdDeliveryDining } from "react-icons/md";
import { MdReviews } from "react-icons/md";

// Import all the components that will be rendered within the dashboard
import Categories from '../components/ViewCategory';
import Products from '../components/ViewProduct';
import Banners from '../components/ViewBanner';
import Orders from '../components/Orders';
import UsersList from '../components/Usersdash';
import DeliveryBoys from '../components/DeliveryBoys';

const DashboardContent = ({ stats, loading, error, orders }) => {
  return (
    <>
      {/* Hero Section */}
      {/* <div className="mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-2 py-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Admin!</h1>
                <p className="text-blue-100 text-lg">Here's what's happening with your business today.</p>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FiTrendingUp size={48} className="text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>
      </div> */}

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
  {/* Card 1 - Total Sales */}
  <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 group-hover:opacity-70 transition-opacity"></div>
    <div className="relative p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Total Sales
        </div>
        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
          <TbCurrencyRupee size={18} />
        </div>
      </div>
      <div className="flex items-center mb-2">
        <TbCurrencyRupee className="text-xl sm:text-2xl text-gray-700" />
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 ml-1">
          {stats.totalSales.toFixed(2)}
        </div>
      </div>
      <div className="flex items-center text-xs sm:text-sm text-emerald-600">
        <FiTrendingUp className="mr-1" />
        <span className="font-medium">Revenue Growth</span>
      </div>
    </div>
  </div>

  {/* Card 2 - Orders */}
  <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50 group-hover:opacity-70 transition-opacity"></div>
    <div className="relative p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Orders
        </div>
        <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
          <FiShoppingCart size={18} />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        {stats.totalOrders}
      </div>
      <div className="flex items-center text-xs sm:text-sm text-emerald-600">
        <FiTrendingUp className="mr-1" />
        <span className="font-medium">Active Orders</span>
      </div>
    </div>
  </div>

  {/* Card 3 - Products */}
  <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-50 opacity-50 group-hover:opacity-70 transition-opacity"></div>
    <div className="relative p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Products
        </div>
        <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl text-white shadow-lg">
          <FiShoppingBag size={18} />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        {stats.totalProducts}
      </div>
      <div className="flex items-center text-xs sm:text-sm text-emerald-600">
        <FiTrendingUp className="mr-1" />
        <span className="font-medium">In Inventory</span>
      </div>
    </div>
  </div>

  {/* Card 4 - Customers */}
  <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-50 group-hover:opacity-70 transition-opacity"></div>
    <div className="relative p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Customers
        </div>
        <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl text-white shadow-lg">
          <FiUsers size={18} />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        {stats.totalCustomers}
      </div>
      <div className="flex items-center text-xs sm:text-sm text-emerald-600">
        <FiTrendingUp className="mr-1" />
        <span className="font-medium">Total Users</span>
      </div>
    </div>
  </div>
</div>


      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-8 lg:grid-cols-2">
  {/* Sales Overview Card */}
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          Sales Overview
        </h3>
        <select className="w-full sm:w-auto px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
    </div>
    <div className="p-4 sm:p-6">
      <div className="h-64 flex items-center justify-center">
        <div className="flex flex-col items-center text-center text-gray-400">
          <div className="p-5 sm:p-6 bg-blue-50 rounded-full mb-4">
            <FiBarChart2 size={44} className="text-blue-500" />
          </div>
          <p className="text-base sm:text-lg font-medium">Sales Analytics</p>
          <p className="text-sm text-gray-500">Chart visualization coming soon</p>
        </div>
      </div>
    </div>
  </div>

  {/* Top Products Card */}
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          Top Products
        </h3>
        <select className="w-full sm:w-auto px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
    </div>
    <div className="p-4 sm:p-6">
      <div className="h-64 flex items-center justify-center">
        <div className="flex flex-col items-center text-center text-gray-400">
          <div className="p-5 sm:p-6 bg-purple-50 rounded-full mb-4">
            <FiShoppingBag size={44} className="text-purple-500" />
          </div>
          <p className="text-base sm:text-lg font-medium">Product Performance</p>
          <p className="text-sm text-gray-500">Analytics dashboard coming soon</p>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Enhanced Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
  {/* Header */}
  <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Activity</h3>
        <p className="text-sm text-gray-600 mt-1">Latest orders and transactions</p>
      </div>
      <Link 
        to="/dashboard/orderdetails" 
        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        View All Orders
      </Link>
    </div>
  </div>

  {/* Content */}
  <div className="p-4 sm:p-6">
    {/* Error message */}
    {error && (
      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="ml-3 text-sm font-medium">{error}</p>
        </div>
      </div>
    )}

    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="absolute inset-0 rounded-full border-2 border-blue-100"></div>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-6 bg-gray-50 rounded-full inline-block mb-4">
            <FiShoppingCart size={48} className="text-gray-400" />
          </div>
          <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">No orders found</p>
          <p className="text-sm text-gray-500">Orders will appear here when customers make purchases</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-x-auto border border-gray-100">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-semibold tracking-wider text-left text-xs text-gray-600 uppercase">Order ID</th>
                <th className="px-4 sm:px-6 py-4 font-semibold tracking-wider text-left text-xs text-gray-600 uppercase">Customer</th>
                <th className="px-4 sm:px-6 py-4 font-semibold tracking-wider text-left text-xs text-gray-600 uppercase">Product</th>
                <th className="px-4 sm:px-6 py-4 font-semibold tracking-wider text-left text-xs text-gray-600 uppercase">Amount</th>
                <th className="px-4 sm:px-6 py-4 font-semibold tracking-wider text-left text-xs text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.slice(0, 3).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                        <FiUser size={16} />
                      </div>
                      <span className="text-gray-900">{order.shippingDetails?.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-medium">
                      {order.items?.[0]?.name}
                      {order.items?.length > 1 && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{order.items.length - 1} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    ₹{(order.total + 40 || 0).toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)} rounded-full shadow-sm`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
</div>

    </>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);
  const [unreadOrders, setUnreadOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesGrowth: 0,
    ordersGrowth: 8.2,
    productsGrowth: 5.7,
    customersGrowth: 14.2
  });

  // Fetch initial data
  useEffect(() => {
    fetchData();
    setupUnreadOrdersListener();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch orders
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);

      // Calculate statistics
      const currentDate = new Date();
      const lastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

      const currentMonthOrders = ordersData.filter(order => 
        new Date(order.createdAt?.toDate()) > lastMonthDate
      );

      const totalSales = ordersData.reduce((acc, order) => acc + (order.total || 0), 0);
      const lastMonthSales = currentMonthOrders.reduce((acc, order) => acc + (order.total || 0), 0);
      const salesGrowth = ((totalSales - lastMonthSales) / lastMonthSales * 100).toFixed(1);

      setStats({
        totalSales,
        totalOrders: ordersData.length,
        totalProducts: productsData.length,
        totalCustomers: usersData.length,
        salesGrowth: parseFloat(salesGrowth) || 0,
        ordersGrowth: 8.2,
        productsGrowth: 5.7,
        customersGrowth: 14.2
      });

      setError('');
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Real-time listener for unread orders
  const setupUnreadOrdersListener = () => {
    const unreadQuery = query(
      collection(db, 'orders'),
      where('isRead', '==', false)
    );
    
    return onSnapshot(unreadQuery, (snapshot) => {
      const newUnreadOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUnreadOrders(newUnreadOrders);
      setUnreadOrderCount(snapshot.docs.length);
    });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNotificationClick = async () => {
    try {
      // Mark all unread orders as read
      const updatePromises = unreadOrders.map(order => 
        updateDoc(doc(db, 'orders', order.id), { isRead: true })
      );
      
      await Promise.all(updatePromises);
      navigate('/dashboard/orderdetails');
    } catch (err) {
      // console.error('Error marking orders as read:', err);
    }
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
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Sidebar - Now a slide-out menu */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl border-r border-slate-200 overflow-auto transition-all duration-300 ease-in-out z-20 
          ${sidebarOpen  ? "translate-x-0 w-80 sm:w-80" : "-translate-x-full w-0"
        } lg:translate-x-0 lg:w-80 lg:top-0 lg:h-screen lg:block`}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="text-xl font-bold text-white">AdminPanel</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white transition-colors md:hidden"
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
              <div
                className={`text-lg ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden md:ml-[300px]">
        {/* Topbar */}
        <header className="flex items-center justify-between px-4 sm:px-6 h-16 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center gap-4">
            {/* Menu Button - Now always visible to open the sidebar */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <h2 className="text-base sm:text-xl font-bold text-gray-800 hidden sm:block">
              Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Search */}
            {/* <div className="relative w-40 sm:w-64 md:w-80">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search anything..."
              className="w-full px-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div> */}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
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
                <span className="text-sm font-semibold text-gray-800">
                  Admin User
                </span>
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardContent
                  stats={stats}
                  loading={loading}
                  error={error}
                  orders={orders}
                />
              }
            />
            <Route path="/view-category" element={<Categories />} />
            <Route path="/view-product" element={<Products />} />
            <Route path="/view-banner" element={<Banners />} />
            <Route path="/orderdetails" element={<Orders />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/delivery-boys" element={<DeliveryBoys />} />
          </Routes>
        </main>
      </div>

      {/* Overlay for when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm md:backdrop-blur-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'processing':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'shipped':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'cancelled': 
      return 'bg-red-100 text-red-700 border border-red-200';
    case 'accept':
      return 'bg-green-100 text-green-700 border border-green-200';
    case 'reject':
      return 'bg-rose-100 text-rose-700 border border-rose-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};