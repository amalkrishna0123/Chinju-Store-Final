import React, { useState, useEffect } from 'react';
import { 
  FiArrowLeft, 
  FiImage, 
  FiUpload, 
  FiX,
  FiAlertCircle,
  FiMenu,
  FiLogOut,
  FiUser,
  FiShoppingBag,
  FiLayers,
  FiGrid,
  FiBell,
  FiSearch,
  FiUsers,
  FiShoppingCart,
  FiStar
} from 'react-icons/fi';
import { MdDeliveryDining, MdReviews } from "react-icons/md";
import { ArrowLeft, Plus, Save, Image, Camera, Upload } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../Firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { optimizeProductData } from '../utils/imageCompression';

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    offer: 0,
    salePrice: '',
    description: '',
    packedDate: '',
    expiryDate: '',
    imported: 'No',
    organic: 'No',
    stock: 'Available',
    weight: '',
    brand: '',
    shelfLife: '',
    category: '',
  });

  const [productImage, setProductImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [productPreview, setProductPreview] = useState(null);
  const [subPreviews, setSubPreviews] = useState([]);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);

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

  const isActive = (path) => path === '/dashboard/view-product';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        const allCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        const subCats = allCategories.filter(cat => cat.type === 'sub');
        const mainCats = allCategories.filter(cat => cat.type === 'main');
  
        // Join subcategory with main category name
        const subWithParent = subCats.map(sub => {
          const parent = mainCats.find(main => main.id === sub.parentId);
          return {
            ...sub,
            label: parent ? `${parent.name} → ${sub.name}` : sub.name,
          };
        });
  
        setCategories(subWithParent);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError('Failed to fetch categories: ' + err.message);
      }
    };
  
    fetchCategories();
  
    return () => {
      if (productPreview) URL.revokeObjectURL(productPreview);
      subPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [productPreview, subPreviews]);
  

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setProductPreview(URL.createObjectURL(file));
    }
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setSubImages(files);
    setSubPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === 'offer' || name === 'originalPrice') {
      const price = parseFloat(updatedData.originalPrice);
      const offer = parseFloat(updatedData.offer);
      if (!isNaN(price) && !isNaN(offer)) {
        updatedData.salePrice = (price - (price * offer) / 100).toFixed(2);
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!productImage || !formData.originalPrice || !formData.name) {
      setError('Product name, image, and original price are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      const imageBase64 = await getBase64(productImage);
      const subImagesBase64 = await Promise.all(subImages.map(getBase64));

      // Create product data object
      const productData = {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice),
        offer: parseFloat(formData.offer),
        salePrice: parseFloat(formData.salePrice),
        imageBase64,
        subImagesBase64,
        createdAt: new Date().toISOString(),
      };
      
      // Optimize product data by compressing images before storing
      const optimizedData = await optimizeProductData(productData);
      
      await addDoc(collection(db, 'products'), optimizedData);

      navigate('/dashboard/view-product');
    } catch (err) {
      setError('Failed to add product: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNotificationClick = () => {
    navigate('/dashboard/orderdetails');
  };
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

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {/* Header with Back Button and Title */}
          {/* <div className="flex items-center mb-6">
            <Link to="/dashboard/view-product" className="mr-4 text-gray-500 hover:text-gray-700">
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          </div> */}

          {/* Error Message */}
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

          {/* Main Form Container */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Form Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Fill in the details to add a new product
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Save size={16} className="mr-2" />
                      {isSubmitting ? 'Saving...' : 'Save Product'}
                    </button>
                  </div> */}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 grid gap-6">
                {/* Product Images Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Product Image */}
                  <div className="md:col-span-1">
                    <label className="block font-medium text-gray-700 mb-2">
                      Product Image *
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                        id="mainImage"
                      />
                      <div
                        className="flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => document.getElementById("mainImage").click()}
                      >
                        {productPreview ? (
                          <div className="relative w-full aspect-square mb-2">
                            <img
                              src={productPreview}
                              alt="Product preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-md mb-2">
                            <Camera size={40} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex items-center justify-center w-full">
                          <button
                            type="button"
                            className="flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                          >
                            <Upload size={14} className="mr-1" />
                            {productPreview ? "Change Image" : "Upload Image"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub Images */}
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-2">
                      Additional Images
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {subPreviews.map((img, idx) => (
                          <div key={idx} className="w-16 h-16 relative">
                            <img
                              src={img}
                              alt={`Sub image ${idx + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        ))}
                        {subPreviews.length === 0 && (
                          <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded-md">
                            <Image size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-center w-full">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          id="subImages"
                          className="hidden"
                          onChange={handleSubImagesChange}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById("subImages").click()}
                          className="flex items-center text-sm px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                        >
                          <Plus size={14} className="mr-1" />
                          Add More Images
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter product name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="brand" className="block font-medium text-gray-700 mb-1">
                        Brand
                      </label>
                      <input
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Enter brand name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
  <label htmlFor="category" className="block font-medium text-gray-700 mb-1">
    Subcategory *
  </label>
  <select
    id="category"
    name="category"
    required
    value={formData.category}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
  >
    <option value="">Select Subcategory</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.name}> {/* Save the name instead of ID */}
      {cat.label}
    </option>
    ))}
  </select>
</div>


                {/* Pricing Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="originalPrice" className="block font-medium text-gray-700 mb-1">
                        Original Price *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          id="originalPrice"
                          name="originalPrice"
                          type="number"
                          value={formData.originalPrice}
                          onChange={handleChange}
                          required
                          placeholder="0.00"
                          className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="offer" className="block font-medium text-gray-700 mb-1">
                        Offer (%)
                      </label>
                      <div className="relative">
                        <input
                          id="offer"
                          name="offer"
                          type="number"
                          value={formData.offer || 0}
                          onChange={handleChange}
                          placeholder="0"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="salePrice" className="block font-medium text-gray-700 mb-1">
                        Sale Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          id="salePrice"
                          name="salePrice"
                          type="number"
                          value={formData.salePrice}
                          readOnly
                          placeholder="0.00"
                          className="w-full pl-8 p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Dates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="packedDate" className="block font-medium text-gray-700 mb-1">
                        Packed Date
                      </label>
                      <input
                        id="packedDate"
                        name="packedDate"
                        type="date"
                        value={formData.packedDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="expiryDate" className="block font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="shelfLife" className="block font-medium text-gray-700 mb-1">
                        Shelf Life (days)
                      </label>
                      <input
                        id="shelfLife"
                        name="shelfLife"
                        type="number"
                        value={formData.shelfLife}
                        onChange={handleChange}
                        placeholder="Enter shelf life in days"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Status Options */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Status</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="imported" className="block font-medium text-gray-700 mb-1">
                        Imported
                      </label>
                      <select
                        id="imported"
                        name="imported"
                        value={formData.imported}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="organic" className="block font-medium text-gray-700 mb-1">
                        Organic
                      </label>
                      <select
                        id="organic"
                        name="organic"
                        value={formData.organic}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="weight" className="block font-medium text-gray-700 mb-1">
                        Weight / No.
                      </label>
                      <input
                        id="weight"
                        name="weight"
                        type="number"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Enter weight / No."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="stock" className="block font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <select
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Available">Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter detailed product description"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Form Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <div className="flex gap-3">
                  <Link
                    to="/dashboard/view-product"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      "Add Product"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
