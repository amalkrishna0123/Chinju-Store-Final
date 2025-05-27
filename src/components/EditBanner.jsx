import React, { useEffect, useState } from 'react';
import { 
  FiArrowLeft, 
  FiImage, 
  FiUpload, 
  FiX,
  FiAlertCircle
} from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerImage, setBannerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const docRef = doc(db, 'banners', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBannerTitle(data.title);
          setImagePreview(data.imageBase64);
        } else {
          setError('Banner not found');
        }
      } catch (err) {
        setError('Failed to fetch banner: ' + err.message);
      }
    };

    fetchBanner();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setBannerImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!bannerTitle.trim()) {
        throw new Error('Banner title is required');
      }

      let imageBase64 = imagePreview;
      
      if (bannerImage) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
        reader.readAsDataURL(bannerImage);
        imageBase64 = await base64Promise;
      }

      const bannerRef = doc(db, 'banners', id);
      await updateDoc(bannerRef, {
        title: bannerTitle.trim(),
        imageBase64,
        updatedAt: new Date().toISOString()
      });
      
      navigate('/dashboard/view-banner');
    } catch (err) {
      setError('Failed to update banner: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (imagePreview && bannerImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, bannerImage]);

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="flex items-center mb-6">
        <Link to="/dashboard/view-banner" className="mr-4 text-gray-500 hover:text-gray-700">
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Banner</h1>
      </div>

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
              <label htmlFor="bannerTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Banner Title
              </label>
              <input
                type="text"
                id="bannerTitle"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter banner title"
                required
                disabled={loading}
              />
            </div>

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
                      onClick={() => document.getElementById('bannerImage').click()}
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
                  onClick={() => !loading && document.getElementById('bannerImage').click()}
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

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Link 
                to="/dashboard/view-banner"
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
                    Updating...
                  </>
                ) : 'Update Banner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBanner;
