import React, { useState, useEffect } from 'react';
import { Edit, Trash, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
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
      console.log("Products fetched:", productData); // Debug log
    } catch (err) {
      setError('Failed to fetch products: ' + err.message);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <Link
            to="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
          <Link
            to="/dashboard/add-product"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Product
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products found. Add your first product!
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
                    Original Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Packed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imported
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organic
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shelf Life
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-4">
                      <div className="h-20 w-20 rounded-lg overflow-hidden">
                        <img
                          src={product.imageBase64}
                          alt={product.name}
                          className="h-full w-full object-cover cursor-pointer"
                          onClick={() => setPreviewImage(product.imageBase64)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {Array.isArray(product.subImagesBase64) &&
                      product.subImagesBase64.length > 0 ? (
                        <div className="w-48 relative">
                          <Swiper
                            spaceBetween={5}
                            slidesPerView={1}
                            modules={[Navigation]}
                            navigation={{
                              nextEl: ".swiper-button-next",
                              prevEl: ".swiper-button-prev",
                            }}
                            className="subimages-swiper"
                          >
                            {product.subImagesBase64.map((subImg, idx) => (
                              <SwiperSlide key={idx}>
                                <div className="h-16 w-16 rounded overflow-hidden mx-auto">
                                  <img
                                    src={subImg}
                                    alt={`${product.name}-${idx + 1}`}
                                    className="h-full w-full object-cover cursor-pointer"
                                    onClick={() => setPreviewImage(subImg)}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                            <div className="swiper-button-prev !text-blue-600 !w-6 !h-6 absolute top-1/2 left-0 -translate-y-1/2"></div>
                            <div className="swiper-button-next !text-blue-600 !w-6 !h-6 absolute top-1/2 right-0 -translate-y-1/2"></div>
                          </Swiper>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.name || product.productName}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.category || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.brand || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      ₹{product.originalPrice}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.offer || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      ₹{product.salePrice || product.originalPrice}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.description || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.packedDate || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.expiryDate || "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.imported ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.organic === "Yes" || product.organic === true
                        ? "Yes"
                        : "No"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.shelfLife || "—"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/dashboard/edit-product/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash size={16} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-transparent bg-opacity-50 flex items-center justify-center"
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