import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Image,
  ArrowLeft
} from 'lucide-react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiArrowLeft, 
  FiPlus,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiImage,
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiUser, 
  FiShoppingBag, 
  FiLayers, 
  FiGrid,
  FiBell,
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
  FiStar
} from 'react-icons/fi';
import { MdDeliveryDining, MdReviews } from "react-icons/md";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, getDocs, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const ViewProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    setupUnreadOrdersListener();
  }, []);


 // Update the fetchCategories function to include main categories too
const fetchCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    const allCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Include both main and sub categories in the state
    setCategories(allCategories);
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};

// Then update how you display the category in the table

    

  // Real-time listener for unread orders
  const setupUnreadOrdersListener = () => {
    const unreadQuery = query(
      collection(db, 'orders'),
      where('isRead', '==', false)
    );
    
    return onSnapshot(unreadQuery, (snapshot) => {
      setUnreadOrderCount(snapshot.docs.length);
    });
  };

  const fetchProducts = async () => {
    try {
      setIsRefreshing(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const offer = data.offer || '';
        const salePrice = offer ? data.salePrice : data.originalPrice;

        return {
          id: doc.id,
          ...data,
          offer,
          salePrice,
        };
      });
      setProducts(productData);
      setError('');
    } catch (err) {
      setError('Failed to fetch products: ' + err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(prev => prev.filter(product => product.id !== id));
      } catch (err) {
        setError('Failed to delete product: ' + err.message);
      }
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNotificationClick = () => {
    navigate('/dashboard/orderdetails');
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

  const filteredProducts = products.filter(product => 
    (product.name || product.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="text-base sm:text-xl font-bold text-gray-800 hidden sm:block">Products</h2>
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

        {/* Main content area */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            {/* <div className="flex items-center">
              <Link
                to="/dashboard"
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <FiArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                Products Management
              </h1>
            </div> */}
            <Link
              to="/dashboard/add-product"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiPlus size={16} className="mr-2" />
              Add New Product
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
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
                  <FiSearch
                    className="absolute left-3 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={fetchProducts}
                    disabled={isRefreshing}
                  >
                    <FiRefreshCw
                      size={16}
                      className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                    />
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FiImage size={48} className="mb-4 text-gray-300" />
                {searchTerm
                  ? "No products found matching your search."
                  : "No products found. Add your first product!"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sub Images
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="h-16 w-16 rounded-lg overflow-hidden">
                            <img
                              src={product.imageBase64}
                              alt={product.name || product.productName}
                              className="h-full w-full object-cover cursor-pointer"
                              onClick={() =>
                                setPreviewImage(product.imageBase64)
                              }
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {Array.isArray(product.subImagesBase64) &&
                          product.subImagesBase64.length > 0 ? (
                            <div className="w-32 relative">
                              <Swiper
                                spaceBetween={5}
                                slidesPerView={2}
                                modules={[Navigation]}
                                navigation={true}
                                className="subimages-swiper"
                              >
                                {product.subImagesBase64.map((subImg, idx) => (
                                  <SwiperSlide key={idx}>
                                    <div className="h-12 w-12 rounded overflow-hidden">
                                      <img
                                        src={subImg}
                                        alt={`${
                                          product.name || product.productName
                                        }-${idx + 1}`}
                                        className="h-full w-full object-cover cursor-pointer"
                                        onClick={() => setPreviewImage(subImg)}
                                      />
                                    </div>
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {product.name || product.productName}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
  {(() => {
    // Since product.category contains the category name, not ID
    const category = categories.find(
      (cat) => cat.name === product.category
    );
    
    if (!category) return product.category || "—";

    if (category.type === "sub") {
      const parent = categories.find(
        (cat) => cat.id === category.parentId
      );
      return parent
        ? `${parent.name} → ${category.name}`
        : category.name;
    }
    return category.name;
  })()}
</td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {product.brand || "—"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            ₹{product.originalPrice}
                          </div>
                          {product.offer && (
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-green-600 font-medium mr-1">
                                {product.offer}% OFF
                              </span>
                              <span className="text-xs text-gray-500">
                                ₹{product.salePrice}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-500">
                            {product.organic === "Yes" ||
                            product.organic === true ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-1">
                                Organic
                              </span>
                            ) : null}
                            {product.imported === "Yes" ||
                            product.imported === true ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Imported
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <Link
                              to={`/dashboard/edit-product/${product.id}`}
                              className="flex items-center text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="flex items-center text-red-600 hover:text-red-900"
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
                Showing{" "}
                <span className="font-medium">{filteredProducts.length}</span>{" "}
                of <span className="font-medium">{products.length}</span>{" "}
                products
              </div>
            </div>
          </div>

          {/* Image Preview Modal */}
          {previewImage && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
              onClick={() => setPreviewImage(null)}
            >
              <div
                className="relative bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg font-bold"
                >
                  ✕
                </button>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewProduct;