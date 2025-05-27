import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, Image, Camera, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { optimizeProductData } from '../utils/imageCompression';

const AddProduct = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        const catList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(catList);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError('Failed to fetch categories: ' + err.message);
      }
    };
    
    fetchCategories();
    
    return () => {
      if (productPreview) URL.revokeObjectURL(productPreview);
      subPreviews.forEach((url) => URL.revokeObjectURL(url));
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

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      {/* Header with Back Button and Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/dashboard/view-product" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        </div>
      </div>

      {/* Error Message */}
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

      {/* Main Form Container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Form Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Fill in the details to add a new product
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
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
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
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
    </div>
  );
};

export default AddProduct;