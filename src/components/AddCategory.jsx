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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const AddCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoryLevel, setCategoryLevel] = useState('main'); // 'main', 'sub', 'subsub'
  const [mainCategory, setMainCategory] = useState(''); // For main category selection
  const [subCategory, setSubCategory] = useState(''); // For subcategory selection
  const [availableMainCategories, setAvailableMainCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);

  // Fetch categories based on the selected level
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (categoryLevel === 'sub') {
          // For subcategories, fetch only main categories
          const q = query(collection(db, 'categories'), where('type', '==', 'main'));
          const querySnapshot = await getDocs(q);
          const categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAvailableMainCategories(categories);
          setAvailableSubCategories([]);
        } else if (categoryLevel === 'subsub') {
          // For sub-subcategories, fetch both main and subcategories
          const mainQuery = query(collection(db, 'categories'), where('type', '==', 'main'));
          const subQuery = query(collection(db, 'categories'), where('type', '==', 'sub'));
          
          const [mainSnapshot, subSnapshot] = await Promise.all([getDocs(mainQuery), getDocs(subQuery)]);
          
          setAvailableMainCategories(mainSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })));
          
          setAvailableSubCategories(subSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })));
        } else {
          // For main categories, clear all parent options
          setAvailableMainCategories([]);
          setAvailableSubCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, [categoryLevel]);

  // When main category changes for sub-subcategories, reset subcategory selection
  useEffect(() => {
    if (categoryLevel === 'subsub') {
      setSubCategory('');
    }
  }, [mainCategory, categoryLevel]);

  const handleNotificationClick = () => {
    navigate('/dashboard/orderdetails');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setCategoryImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!categoryName.trim()) {
        throw new Error('Category name is required');
      }

      // Validate parent selections
      if (categoryLevel === 'sub' && !mainCategory) {
        throw new Error('Main category is required');
      }

      if (categoryLevel === 'subsub' && (!mainCategory || !subCategory)) {
        throw new Error('Both main category and subcategory are required');
      }

      // Convert image to base64 if exists
      let imageBase64 = '';
      if (categoryLevel !== 'main' && categoryImage) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
        reader.readAsDataURL(categoryImage);
        imageBase64 = await base64Promise;
      }

      // Prepare category data
      const categoryData = {
        name: categoryName.trim(),
        type: categoryLevel,
        level: categoryLevel,
        createdAt: new Date().toISOString(),
        ...(categoryLevel !== 'main' && { imageBase64 }),
      };

      // Set parent relationships
      if (categoryLevel === 'sub') {
        categoryData.parentId = mainCategory;
      } else if (categoryLevel === 'subsub') {
        categoryData.parentId = subCategory;
        categoryData.mainCategoryId = mainCategory; // Optional: store main category reference
      }

      await addDoc(collection(db, 'categories'), categoryData);
      navigate('/dashboard/view-category');
    } catch (err) {
      setError('Failed to add category: ' + err.message);
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

  const isActive = (path) => path === '/dashboard/view-category';

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
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

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden md:ml-[300px]">
        <header className="flex items-center justify-between px-4 sm:px-6 h-16 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <h2 className="text-base sm:text-xl font-bold text-gray-800 hidden sm:block">Categories</h2>
          </div>
    
          <div className="flex items-center gap-3 sm:gap-6">
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

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
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
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category name"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Level
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600"
                        name="categoryLevel"
                        value="main"
                        checked={categoryLevel === 'main'}
                        onChange={() => {
                          setCategoryLevel('main');
                          setMainCategory('');
                          setSubCategory('');
                        }}
                        disabled={loading}
                      />
                      <span className="ml-2">Main Category</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600"
                        name="categoryLevel"
                        value="sub"
                        checked={categoryLevel === 'sub'}
                        onChange={() => {
                          setCategoryLevel('sub');
                          setMainCategory('');
                          setSubCategory('');
                        }}
                        disabled={loading}
                      />
                      <span className="ml-2">Subcategory</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600"
                        name="categoryLevel"
                        value="subsub"
                        checked={categoryLevel === 'subsub'}
                        onChange={() => {
                          setCategoryLevel('subsub');
                          setMainCategory('');
                          setSubCategory('');
                        }}
                        disabled={loading}
                      />
                      <span className="ml-2">Sub-subcategory</span>
                    </label>
                  </div>
                </div>

                {categoryLevel === 'sub' && (
                  <div>
                    <label htmlFor="mainCategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Main Category
                    </label>
                    <select
                      id="mainCategory"
                      value={mainCategory}
                      onChange={(e) => setMainCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={loading || availableMainCategories.length === 0}
                    >
                      <option value="">Select a main category</option>
                      {availableMainCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {availableMainCategories.length === 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        No main categories available. Please create a main category first.
                      </p>
                    )}
                  </div>
                )}

                {categoryLevel === 'subsub' && (
                  <>
                    <div>
                      <label htmlFor="mainCategory" className="block text-sm font-medium text-gray-700 mb-1">
                        Main Category
                      </label>
                      <select
                        id="mainCategory"
                        value={mainCategory}
                        onChange={(e) => setMainCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={loading || availableMainCategories.length === 0}
                      >
                        <option value="">Select a main category</option>
                        {availableMainCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {availableMainCategories.length === 0 && (
                        <p className="mt-1 text-sm text-red-600">
                          No main categories available. Please create a main category first.
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategory
                      </label>
                      <select
                        id="subCategory"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={loading || !mainCategory || availableSubCategories.filter(cat => cat.parentId === mainCategory).length === 0}
                      >
                        <option value="">Select a subcategory</option>
                        {availableSubCategories
                          .filter(cat => cat.parentId === mainCategory)
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                      {mainCategory && availableSubCategories.filter(cat => cat.parentId === mainCategory).length === 0 && (
                        <p className="mt-1 text-sm text-red-600">
                          No subcategories available for the selected main category.
                        </p>
                      )}
                    </div>
                  </>
                )}

                {categoryLevel !== 'main' && (
                  <div>
                    <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Category Image
                    </label>
                    <input
                      type="file"
                      id="categoryImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                    
                    {imagePreview ? (
                      <div className="relative border border-gray-200 rounded-lg p-2 mt-2">
                        <div className="flex items-center">
                          <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Image Selected
                            </p>
                            <p className="text-sm text-gray-500">
                              Click below to change or remove the image
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          <button
                            type="button"
                            onClick={() => document.getElementById('categoryImage').click()}
                            className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            disabled={loading}
                          >
                            <FiUpload size={14} className="mr-1" />
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="flex items-center px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                            disabled={loading}
                          >
                            <FiX size={14} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => !loading && document.getElementById('categoryImage').click()}
                        className="mt-2 flex justify-center px-6 py-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="space-y-2 text-center">
                          <FiImage className="mx-auto h-12 w-12 text-gray-300" />
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600 hover:text-blue-700">
                              Click to upload an image
                            </span>{" "}
                            or drag and drop
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Link 
                    to="/dashboard/view-category"
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
                    ) : 'Create Category'}
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

export default AddCategory;