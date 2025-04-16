import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', // Changed from productName to name for consistency with EditProduct
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

    if (!productImage || !formData.originalPrice || !formData.name) {
      setError('Product name, image, and original price are required.');
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

      await addDoc(collection(db, 'products'), {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice),
        offer: parseFloat(formData.offer),
        salePrice: parseFloat(formData.salePrice),
        imageBase64,
        subImagesBase64,
        createdAt: new Date().toISOString(),
      });

      navigate('/dashboard/view-product');
    } catch (err) {
      setError('Failed to add product: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <Link
            to="/dashboard/view-product"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add New Product
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=""
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="brand" className="block font-medium mb-1">
                Brand
              </label>
              <input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder=""
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block font-medium mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Image Section */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Product Image (required)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
              id="mainImage"
            />
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
              onClick={() => document.getElementById("mainImage").click()}
            >
              <div className="text-center">
                {productPreview ? (
                  <img
                    src={productPreview}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="mx-auto h-32 w-32 flex items-center justify-center bg-gray-100 rounded-md">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Click to upload product image
                </div>
              </div>
            </div>
          </div>

          {/* Sub Images */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Sub Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleSubImagesChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {subPreviews.map((img, idx) => (
                <img key={idx} src={img} alt="sub" className="h-24 rounded" />
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="originalPrice" className="block font-medium mb-1">
                Original Price *
              </label>
              <input
                id="originalPrice"
                name="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={handleChange}
                required
                placeholder=""
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="offer" className="block font-medium mb-1">
                Offer (%)
              </label>
              <input
                id="offer"
                name="offer"
                type="number"
                value={formData.offer || 0}
                onChange={handleChange}
                placeholder="0"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="salePrice" className="block font-medium mb-1">
                Sale Price
              </label>
              <input
                id="salePrice"
                name="salePrice"
                type="number"
                value={formData.salePrice}
                readOnly
                placeholder=""
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="packedDate" className="block font-medium mb-1">
                Packed Date
              </label>
              <input
                id="packedDate"
                name="packedDate"
                type="date"
                value={formData.packedDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="expiryDate" className="block font-medium mb-1">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="shelfLife" className="block font-medium mb-1">
                Shelf Life (days)
              </label>
              <input
                id="shelfLife"
                name="shelfLife"
                type="number"
                value={formData.shelfLife}
                onChange={handleChange}
                placeholder=""
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Product Status Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="imported" className="block font-medium mb-1">
                Imported
              </label>
              <select
                id="imported"
                name="imported"
                value={formData.imported}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label htmlFor="organic" className="block font-medium mb-1">
                Organic
              </label>
              <select
                id="organic"
                name="organic"
                value={formData.organic}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product Description"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;