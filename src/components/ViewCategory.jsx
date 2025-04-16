import React, { useState, useEffect } from 'react';
import { Edit, Trash, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to fetch categories: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      } catch (err) {
        setError('Failed to delete category: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
          <Link
            to="/dashboard/add-category"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add New Category
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No categories found. Add your first category!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded-lg overflow-hidden">
                      <img src={category.imageBase64} alt={category.name} className="h-full w-full object-cover" />

                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/dashboard/edit-category/${category.id}`}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
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
    </div>
  );
};

export default ViewCategory;