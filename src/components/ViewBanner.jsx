import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash, Plus, Search, Filter, RefreshCw, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ViewBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setIsRefreshing(true);
      const querySnapshot = await getDocs(collection(db, 'banners'));
      const bannerData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBanners(bannerData);
      setError('');
    } catch (err) {
      setError('Failed to fetch banners: ' + err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const filteredBanners = banners.filter(banner => 
    (banner.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteDoc(doc(db, 'banners', id));
        setBanners(prev => prev.filter(banner => banner.id !== id));
      } catch (err) {
        setError('Failed to delete banner: ' + err.message);
      }
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
        </div>
        <Link
          to="/dashboard/add-banner"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add New Banner
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
                placeholder="Search banners..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={fetchBanners}
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Image size={48} className="mb-4 text-gray-300" />
            {searchTerm ? 'No banners found matching your search.' : 'No banners found. Add your first banner!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBanners.map((banner) => (
                  <tr key={banner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-20 w-80 rounded-lg overflow-hidden">
                        <img
                          src={banner.imageBase64}
                          alt="Banner"
                          className="h-full w-full object-cover cursor-pointer"
                          onClick={() => setPreviewImage(banner.imageBase64)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/dashboard/edit-banner/${banner.id}`}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(banner.id)}
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
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredBanners.length}</span> of{" "}
            <span className="font-medium">{banners.length}</span> banners
          </div>
        </div>
      </div>

      {previewImage && (
  <div
    className="fixed inset-0 z-50 bg-transparent bg-opacity-50 flex items-center justify-center"
    onClick={() => setPreviewImage(null)}
  >
    <div
      className="relative bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setPreviewImage(null)}
        className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg font-bold"
      >
        ✕
      </button>

      {/* Image */}
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

export default ViewBanner;
