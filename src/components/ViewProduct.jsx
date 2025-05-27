import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash, Plus, Search, Filter, RefreshCw, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const filteredProducts = products.filter(product => 
    (product.name || product.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        </div>
        <Link
          to="/dashboard/add-product"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add New Product
        </Link>
      </div>

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

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex items-center w-full max-w-xs">
              <Search className="absolute left-3 text-gray-400" size={16} />
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
                <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none">
                <Filter size={16} className="mr-2" />
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
            <Image size={48} className="mb-4 text-gray-300" />
            {searchTerm ? 'No products found matching your search.' : 'No products found. Add your first product!'}
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
                          onClick={() => setPreviewImage(product.imageBase64)}
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
                                    alt={`${product.name || product.productName}-${idx + 1}`}
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
                      {product.category || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.brand || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">₹{product.originalPrice}</div>
                      {product.offer && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-green-600 font-medium mr-1">
                            {product.offer}% OFF
                          </span>
                          <span className="text-xs text-gray-500">₹{product.salePrice}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500">
                        {product.organic === "Yes" || product.organic === true ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-1">
                            Organic
                          </span>
                        ) : null}
                        {product.imported === "Yes" || product.imported === true ? (
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
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash size={18} />
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
            Showing <span className="font-medium">{filteredProducts.length}</span> of{" "}
            <span className="font-medium">{products.length}</span> products
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
    </div>
  );
};

export default ViewProduct;