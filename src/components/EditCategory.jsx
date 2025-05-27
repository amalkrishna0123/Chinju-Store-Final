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

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const docRef = doc(db, 'categories', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCategoryName(data.name);
          setImagePreview(data.imageBase64);
        } else {
          setError('Category not found');
        }
      } catch (err) {
        setError('Failed to fetch category: ' + err.message);
      }
    };

    fetchCategory();
  }, [id]);

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

      let imageBase64 = imagePreview;
      
      if (categoryImage) {
        // Convert image to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
        reader.readAsDataURL(categoryImage);
        imageBase64 = await base64Promise;
      }

      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, {
        name: categoryName.trim(),
        imageBase64,
        updatedAt: new Date().toISOString()
      });
      
      // Navigate back to categories view
      navigate('/dashboard/view-category');
    } catch (err) {
      setError('Failed to update category: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (imagePreview && categoryImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, categoryImage]);

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="flex items-center mb-6">
        <Link to="/dashboard/view-category" className="mr-4 text-gray-500 hover:text-gray-700">
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
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
                    Updating...
                  </>
                ) : 'Update Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;