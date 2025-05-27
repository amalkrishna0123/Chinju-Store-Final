import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../Firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, Save, X, Upload, AlertCircle, Image } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { query, where } from "firebase/firestore";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    imageBase64: '',
    subImagesBase64: [],
    originalPrice: '',
    offer: '',
    salePrice: '',
    brand: '',
    description: '',
    packedDate: '',
    expiryDate: '',
    imported: false,
    organic: false,
    shelfLife: '',
    category: '',
  });
  
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, 'categories'));
        const categoryList = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(categoryList);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      }
    };

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            ...data,
            // Set default values for any missing fields
            subImagesBase64: data.subImagesBase64 || [],
            packedDate: data.packedDate || '',
            expiryDate: data.expiryDate || '',
            imported: data.imported || false,
            organic: data.organic === true || data.organic === 'Yes' ? true : false,
            shelfLife: data.shelfLife || ''
          });
          setPreview(data.imageBase64 || null);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Failed to fetch product: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id]);

  const fetchProductsByCategory = async (categoryName) => {
    const q = query(collection(db, 'products'), where('category', '==', categoryName));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return products;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setProduct((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name === 'originalPrice' || name === 'offer') {
      const originalPrice = parseFloat(name === 'originalPrice' ? value : product.originalPrice);
      const offer = parseFloat(name === 'offer' ? value : product.offer);
      if (!isNaN(originalPrice) && !isNaN(offer)) {
        const discounted = originalPrice - (originalPrice * offer / 100);
        setProduct(prev => ({ ...prev, salePrice: discounted.toFixed(2) }));
      }
    }
    
    // Clear any previous error/success messages when user makes changes
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct(prev => ({ ...prev, imageBase64: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({
          ...prev,
          subImagesBase64: [...prev.subImagesBase64, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeSubImage = (index) => {
    setProduct(prev => ({
      ...prev,
      subImagesBase64: prev.subImagesBase64.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.imageBase64 || !product.originalPrice) {
      setError('Please fill all required fields.');
      window.scrollTo(0, 0);
      return;
    }

    try {
      setSaving(true);
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, product);
      setSuccess('Product updated successfully!');
      
      // Show success message briefly before navigating
      setTimeout(() => {
        navigate('/dashboard/view-product');
      }, 1500);
      
    } catch (err) {
      setError('Failed to update product: ' + err.message);
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <div className="text-lg text-gray-600">Loading product...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/dashboard/view-product"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Products
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Edit Product</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`flex items-center px-4 py-2 rounded-md text-white transition-colors ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
            <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start">
            <AlertCircle size={20} className="text-green-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-green-800 font-medium">Success</h3>
              <p className="text-green-700 text-sm mt-1">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Basic Information</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Product Name & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={product.brand}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={product.category || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={4}
                  placeholder="Enter product description..."
                />
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Product Images</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Main Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Main Product Image <span className="text-red-500">*</span>
                </label>
                
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                  {preview ? (
                    <div className="relative mb-4 md:mb-0">
                      <div className="h-48 w-48 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full object-cover cursor-pointer"
                          onClick={() => setPreviewImage(preview)}
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        onClick={() => {
                          setPreview(null);
                          setProduct(prev => ({ ...prev, imageBase64: '' }));
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-48 w-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 md:mb-0">
                      <div className="text-center">
                        <Image size={36} className="mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No image selected</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label 
                      htmlFor="main-image" 
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload size={16} className="mr-2" />
                      {preview ? 'Change Image' : 'Upload Image'}
                    </label>
                    <input
                      id="main-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Recommended size: 800x800 pixels
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Images
                </label>
                
                <div>
                  <label 
                    htmlFor="sub-images" 
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer inline-block"
                  >
                    <Upload size={16} className="mr-2" />
                    Add More Images
                  </label>
                  <input
                    id="sub-images"
                    type="file"
                    accept="image/*"
                    onChange={handleSubImagesChange}
                    multiple
                    className="sr-only"
                  />
                </div>

                {product.subImagesBase64.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Additional Images ({product.subImagesBase64.length}):
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {product.subImagesBase64.map((subImg, idx) => (
                        <div key={idx} className="relative">
                          <div className="h-24 w-24 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                            <img
                              src={subImg}
                              alt={`Sub image ${idx + 1}`}
                              className="h-full w-full object-cover cursor-pointer"
                              onClick={() => setPreviewImage(subImg)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSubImage(idx)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Pricing</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      name="originalPrice"
                      value={product.originalPrice}
                      onChange={handleInputChange}
                      className="w-full pl-7 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="offer"
                      value={product.offer}
                      onChange={handleInputChange}
                      className="w-full pr-9 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      name="salePrice"
                      value={product.salePrice}
                      readOnly
                      className="w-full pl-7 p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Additional Details</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Date Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Packed Date
                  </label>
                  <input
                    type="date"
                    name="packedDate"
                    value={product.packedDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={product.expiryDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shelf Life (days)
                  </label>
                  <input
                    type="number"
                    name="shelfLife"
                    value={product.shelfLife}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
              </div>

              {/* Product Attributes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Attributes
                </label>
                <div className="flex flex-wrap gap-x-6 gap-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="organic"
                      name="organic"
                      checked={product.organic}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="organic"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Organic
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="imported"
                      name="imported"
                      checked={product.imported}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="imported"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Imported
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link 
              to="/dashboard/view-product"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 rounded-md text-white transition-colors ${
                saving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
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
    </div>
  );
};

export default EditProduct;