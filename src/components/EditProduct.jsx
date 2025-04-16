import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../Firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  
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
      return;
    }

    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, product);
      navigate('/dashboard/view-product');
    } catch (err) {
      setError('Failed to update product: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <Link
            to="/dashboard/view-product"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Product List
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white mt-6 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Product
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
              <label className="block font-medium">Product Name *</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Brand</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
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
              value={product.category || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Main Product Image */}
          <div>
            <label className="block font-medium">Main Product Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1"
            />
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-40 object-cover rounded-md"
                  onClick={() => setPreviewImage(preview)}
                />
              </div>
            )}
          </div>

          {/* Sub Images */}
          <div>
            <label className="block font-medium">Sub Images</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSubImagesChange}
              multiple
              className="mt-1"
            />

            {product.subImagesBase64.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">
                  Current Sub Images:
                </p>
                <div className="w-full relative subimages-container">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={3}
                    modules={[Navigation]}
                    navigation={true}
                    className="subimages-swiper"
                  >
                    {product.subImagesBase64.map((subImg, idx) => (
                      <SwiperSlide key={idx}>
                        <div className="relative h-20 w-20 rounded overflow-hidden">
                          <img
                            src={subImg}
                            alt={`Sub image ${idx + 1}`}
                            className="h-full w-full object-cover cursor-pointer"
                            onClick={() => setPreviewImage(subImg)}
                          />
                          <button
                            type="button"
                            onClick={() => removeSubImage(idx)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium">Original Price *</label>
              <input
                type="number"
                name="originalPrice"
                value={product.originalPrice}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Offer (%)</label>
              <input
                type="number"
                name="offer"
                value={product.offer}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium">Sale Price</label>
              <input
                type="number"
                name="salePrice"
                value={product.salePrice}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium">Packed Date</label>
              <input
                type="date"
                name="packedDate"
                value={product.packedDate}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={product.expiryDate}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium">Shelf Life (days)</label>
              <input
                type="number"
                name="shelfLife"
                value={product.shelfLife}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Checkbox Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="imported"
                name="imported"
                checked={product.imported}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="imported"
                className="ml-2 block text-sm text-gray-900"
              >
                Imported
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="organic"
                name="organic"
                checked={product.organic}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="organic"
                className="ml-2 block text-sm text-gray-900"
              >
                Organic
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              rows={4}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Changes
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