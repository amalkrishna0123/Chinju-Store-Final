import { useState, useEffect } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { Link } from 'react-router-dom';
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
  FiArrowUpRight,
  FiArrowDownLeft,
  FiMoreVertical,
  FiEye,
  FiFilter,
  FiCalendar
} from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb";
import { MdDeliveryDining } from "react-icons/md";

const DashboardContent = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const customersSnapshot = await getDocs(collection(db, 'users'));

        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        setStats({
          totalSales,
          totalOrders: ordersSnapshot.size,
          totalProducts: productsSnapshot.size,
          totalCustomers: customersSnapshot.size
        });

        setOrders(orders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const ordersData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentOrders(ordersData);
      } catch (err) {
        console.error('Error fetching recent orders:', err);
      }
    };

    fetchRecentOrders();
  }, []);
  const [timeFilter, setTimeFilter] = useState('7d');
  const [hoveredCard, setHoveredCard] = useState(null);

  const mockChartData = [
    { day: 'Mon', sales: 2400, orders: 24 },
    { day: 'Tue', sales: 1398, orders: 13 },
    { day: 'Wed', sales: 9800, orders: 98 },
    { day: 'Thu', sales: 3908, orders: 39 },
    { day: 'Fri', sales: 4800, orders: 48 },
    { day: 'Sat', sales: 3800, orders: 38 },
    { day: 'Sun', sales: 4300, orders: 43 }
  ];

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const activitiesArr = [];
        
        // Fetch recent orders
        const recentOrdersSnapshot = await getDocs(collection(db, 'orders'));
        recentOrdersSnapshot.docs.slice(0, 2).forEach(doc => {
          const order = doc.data();
          activitiesArr.push({
            type: 'order',
            message: `New order #${doc.id.slice(0, 8)} received`,
            time: new Date(order.createdAt).toLocaleString(),
            color: 'bg-blue-500'
          });
        });

        // Fetch recent products
        const recentProductsSnapshot = await getDocs(collection(db, 'products'));
        recentProductsSnapshot.docs.slice(0, 1).forEach(doc => {
          const product = doc.data();
          activitiesArr.push({
            type: 'product',
            message: `Product "${product.name}" updated`,
            time: new Date().toLocaleString(),
            color: 'bg-green-500'
          });
        });

        // Fetch recent users
        const recentUsersSnapshot = await getDocs(collection(db, 'users'));
        recentUsersSnapshot.docs.slice(0, 1).forEach(doc => {
          activitiesArr.push({
            type: 'user',
            message: 'New user registered',
            time: new Date().toLocaleString(),
            color: 'bg-purple-500'
          });
        });

        // Sort activities by time
        activitiesArr.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivities(activitiesArr);
      } catch (err) {
        console.error('Error fetching recent activities:', err);
      }
    };

    fetchRecentActivities();
  }, []);


  const StatCard = ({ title, value, icon, change, changeType, color, index }) => (
    <div 
      className={`group relative overflow-hidden bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer`}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            {icon}
          </div>
          <div className={`flex items-center text-sm font-medium ${changeType === 'up' ? 'text-green-200' : 'text-red-200'}`}>
            {changeType === 'up' ? <FiArrowUpRight className="mr-1" /> : <FiArrowDownLeft className="mr-1" />}
            {change}%
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-2">{value}</div>
        <div className="text-white/80 text-sm font-medium">{title}</div>
      </div>
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10 transition-transform duration-500 ${hoveredCard === index ? 'scale-150' : 'scale-100'}`} />
    </div>
  );

  const MiniChart = ({ data, color = '#3B82F6' }) => (
    <div className="h-16 flex items-end space-x-1">
      {data.map((value, index) => (
        <div
          key={index}
          className="flex-1 bg-gradient-to-t from-blue-500/60 to-blue-500/20 rounded-t-sm transition-all duration-300 hover:from-blue-500 hover:to-blue-400"
          style={{ height: `${(value / Math.max(...data)) * 100}%` }}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
          <Link to="/orders" className="text-blue-500 hover:text-blue-600 font-medium flex items-center">
            View All <FiArrowUpRight className="ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Products</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-4">
                    <span className="font-medium text-gray-900">#{order.id.slice(0, 8)}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiUser className="text-gray-500" />
                      </div>
                      <span className="ml-2 font-medium text-gray-900">{order.customerName || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-gray-500">{order.items?.length || 0} items</span>
                  </td>
                  <td className="py-4">
                    <span className="font-medium text-gray-900">₹{order.totalAmount || 0}</span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                      {order.status || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Good Morning, Admin! 👋
          </h1>
          <p className="text-gray-600 text-lg">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center">
            <FiCalendar className="mr-2" size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalSales.toLocaleString()}`}
          icon={<TbCurrencyRupee size={24} className="text-white" />}
          change="12.5"
          changeType="up"
          color="from-blue-600 to-blue-800"
          index={0}
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={<FiShoppingCart size={24} className="text-white" />}
          change="8.2"
          changeType="up"
          color="from-purple-600 to-purple-800"
          index={1}
        />
        <StatCard
          title="Products"
          value={stats.totalProducts.toLocaleString()}
          icon={<FiShoppingBag size={24} className="text-white" />}
          change="5.7"
          changeType="up"
          color="from-green-600 to-green-800"
          index={2}
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={<FiUsers size={24} className="text-white" />}
          change="14.2"
          changeType="up"
          color="from-orange-600 to-orange-800"
          index={3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Sales Analytics</h3>
              <p className="text-gray-500 text-sm">Track your revenue growth</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiFilter size={16} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiMoreVertical size={16} />
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline space-x-4 mb-4">
              <span className="text-3xl font-bold text-gray-900">₹{stats.totalSales.toLocaleString()}</span>
              <span className="flex items-center text-green-500 font-medium">
                <FiTrendingUp className="mr-1" size={16} />
                +12.5%
              </span>
            </div>
            <div className="flex space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">This Period</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                <span className="text-gray-600">Previous Period</span>
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between space-x-2">
            {mockChartData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg mb-2 transition-all duration-300 hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                  style={{ height: `${(item.sales / 10000) * 100}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded-md absolute -top-8 left-1/2 transform -translate-x-1/2">
                    ₹{item.sales.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Live Activity</h3>
            <button className="text-blue-600 hover:text-blue-800 transition-colors">
              <FiEye size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                <div className={`w-3 h-3 ${activity.color} rounded-full mt-2 group-hover:scale-125 transition-transform`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
            View All Activities
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <p className="text-gray-500 text-sm">Latest customer orders</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center">
              <FiEye className="mr-2" size={16} />
              View All
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {orders.slice(0, 5).map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        #{order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg">
                          {order.shippingDetails?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{order.shippingDetails?.fullName}</div>
                          <div className="text-xs text-gray-500">Customer</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {order.items?.[0]?.name}
                        {order.items?.length > 1 && (
                          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{order.items.length - 1} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ₹{((order.total || 0) + 40).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
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
    </div>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [unreadOrderCount, setUnreadOrderCount] = useState(3);
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      shippingDetails: { fullName: 'John Doe' },
      items: [{ name: 'iPhone 15 Pro' }, { name: 'AirPods Pro' }],
      total: 1299,
      status: 'processing'
    },
    {
      id: 'ORD002',
      shippingDetails: { fullName: 'Jane Smith' },
      items: [{ name: 'MacBook Air' }],
      total: 999,
      status: 'completed'
    },
    {
      id: 'ORD003',
      shippingDetails: { fullName: 'Mike Johnson' },
      items: [{ name: 'iPad Pro' }],
      total: 799,
      status: 'shipped'
    }
  ]);
  const [stats, setStats] = useState({
    totalSales: 45230,
    totalOrders: 1,
    totalProducts: 156,
    totalCustomers: 1247
  });

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
  };

  const menuItems = [
    { label: "Dashboard", path: "dashboard", icon: <FiGrid />, active: true },
    { label: "Categories", path: "categories", icon: <FiLayers /> },
    { label: "Products", path: "products", icon: <FiShoppingBag /> },
    { label: "Banners", path: "banners", icon: <FiImage /> },
    { label: "Orders", path: "orders", icon: <FiShoppingCart /> },
    { label: "Users", path: "users", icon: <FiUsers /> },
    { label: "Delivery", path: "delivery", icon: <MdDeliveryDining /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-2xl transition-all duration-300 ${sidebarOpen ? "w-72" : "w-20"} flex flex-col border-r border-gray-100`}>
        {/* Brand */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
          {sidebarOpen && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                A
              </div>
              <div className="ml-3">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AdminHub
                </div>
                <div className="text-xs text-gray-500">Control Panel</div>
              </div>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            {sidebarOpen ? 
              <FiX size={20} className="text-gray-600 group-hover:text-gray-900" /> : 
              <FiMenu size={20} className="text-gray-600 group-hover:text-gray-900" />
            }
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentRoute(item.path)}
              className={`flex items-center w-full p-4 rounded-xl transition-all duration-200 group ${
                currentRoute === item.path
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className={`text-xl ${currentRoute === item.path ? 'text-white' : 'group-hover:scale-110'} transition-transform`}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <span className="ml-4 font-medium">{item.label}</span>
              )}
              {currentRoute === item.path && sidebarOpen && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center ${sidebarOpen ? 'mb-4' : 'justify-center mb-2'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1">
                <div className="text-sm font-semibold text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">Super Admin</div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors group ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <FiLogOut size={18} className="group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-20 px-8 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-900">Dashboard</div>
            <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Live
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search anything..."
                className="w-80 px-4 py-3 pl-12 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={18} />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={handleNotificationClick} 
                className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors group"
              >
                <FiBell size={20} className="text-gray-600 group-hover:text-gray-900" />
                {unreadOrderCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                    {unreadOrderCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Profile */}
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Admin</div>
                <div className="text-gray-500">Online</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          {currentRoute === 'dashboard' && (
            <DashboardContent stats={stats} loading={loading} error={error} orders={orders} />
          )}
          {currentRoute !== 'dashboard' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-2xl">
                  {menuItems.find(item => item.path === currentRoute)?.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {menuItems.find(item => item.path === currentRoute)?.label} Page
                </h2>
                <p className="text-gray-500">This section is under development</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border border-red-200';
    case 'accept':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'reject':
      return 'bg-rose-100 text-rose-800 border border-rose-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

export default Dashboard;