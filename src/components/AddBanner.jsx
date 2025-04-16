import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddBanner = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageBase64 = '';

      if (bannerImage) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
        reader.readAsDataURL(bannerImage);
        imageBase64 = await base64Promise;
      }

      const bannerData = {
        imageBase64,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'banners'), bannerData);
      navigate('/dashboard/view-banner');
    } catch (err) {
      setError('Failed to add banner: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-green-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <Link to="/dashboard/view-banner" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-2" />
            Back to Banners
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Banner</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">
              Banner Image
            </label>
            <input
              type="file"
              id="bannerImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={loading}
            />
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
              onClick={() => !loading && document.getElementById('bannerImage').click()}
            >
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                ) : (
                  <div className="mx-auto h-32 w-32 flex items-center justify-center bg-gray-100 rounded-md">
                    <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <div className="flex text-sm text-gray-600">
                  <span>{loading ? 'Uploading...' : 'Click to upload an image'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Adding Banner...' : 'Add Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBanner;
