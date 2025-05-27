import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  FiDollarSign
} from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb";
import { MdDeliveryDining } from "react-icons/md";

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
      console.error('Error marking orders as read:', err);
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
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} flex flex-col`}>
        {/* Brand logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          {sidebarOpen && (
            <div className="text-xl font-bold text-blue-600">AdminPanel</div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              {sidebarOpen && <span className="ml-4">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-md text-red-500 hover:bg-red-50 transition-colors ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="w-64 px-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            {/* Notification icon */}
            <div className="relative">
              <button onClick={handleNotificationClick} className="relative">
                <FiBell size={20} className="text-gray-600 cursor-pointer" />
                {unreadOrderCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full transform translate-x-1 -translate-y-1">
                    {unreadOrderCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* User profile */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <FiUser />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </header>
        {/* Dashboard content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
            <p className="text-gray-500">Welcome back, here's what's happening today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4 sm:grid-cols-2">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Total Sales</div>
                <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                  <TbCurrencyRupee size={18} />
                </div>
              </div>
              <div className="flex items-center">
                <div><TbCurrencyRupee/></div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalSales.toFixed(2)}</div>
              </div>
              {/* <div className="flex items-center mt-2 text-sm text-green-500">
                <FiTrendingUp className="mr-1" />
                <span>+{stats.salesGrowth}% from last month</span>
              </div> */}
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Orders</div>
                <div className="p-2 bg-purple-100 rounded-md text-purple-600">
                  <FiShoppingCart size={18} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalOrders}</div>
              {/* <div className="flex items-center mt-2 text-sm text-green-500">
                <FiTrendingUp className="mr-1" />
                <span>+{stats.ordersGrowth}% from last month</span>
              </div> */}
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Products</div>
                <div className="p-2 bg-yellow-100 rounded-md text-yellow-600">
                  <FiShoppingBag size={18} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalProducts}</div>
              {/* <div className="flex items-center mt-2 text-sm text-green-500">
                <FiTrendingUp className="mr-1" />
                <span>+{stats.productsGrowth}% from last month</span>
              </div> */}
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Customers</div>
                <div className="p-2 bg-green-100 rounded-md text-green-600">
                  <FiUsers size={18} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</div>
              {/* <div className="flex items-center mt-2 text-sm text-green-500">
                <FiTrendingUp className="mr-1" />
                <span>+{stats.customersGrowth}% from last month</span>
              </div> */}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Sales Overview</h3>
                <select className="px-3 py-1 text-sm border rounded-md focus:outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center">
                {/* Placeholder for chart */}
                <div className="flex flex-col items-center text-gray-400">
                  <FiBarChart2 size={48} />
                  <p className="mt-2">Sales chart visualization</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Top Products</h3>
                <select className="px-3 py-1 text-sm border rounded-md focus:outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center">
                {/* Placeholder for chart */}
                <div className="flex flex-col items-center text-gray-400">
                  <FiShoppingBag size={48} />
                  <p className="mt-2">Product performance chart</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
              <Link to="/dashboard/orderdetails" className="text-sm text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No orders found
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 3).map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">#{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                              <FiUser size={14} />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{order.shippingDetails?.fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.items?.[0]?.name}
                            {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{(order.total + 40 || 0).toFixed(2)}/-</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium ${getStatusColor(order.status)} rounded-full`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'accept':
      return 'bg-emerald-100 text-emerald-800';
    case 'reject':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};