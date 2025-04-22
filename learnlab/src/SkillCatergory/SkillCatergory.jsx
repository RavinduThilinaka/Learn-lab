import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaChartLine, 
  FaQuestionCircle, 
  FaSignOutAlt 
} from 'react-icons/fa';
import Logo from '../Images/logo1.png'; // Update with your actual logo path

const SkillCategoryForm = () => {
  const [formData, setFormData] = useState({
    categoryTitle: '',
    categoryName: '',
    description: '',
    categoryImage: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        categoryImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('categoryTitle', formData.categoryTitle);
      formDataToSend.append('categoryName', formData.categoryName);
      formDataToSend.append('description', formData.description);
      if (formData.categoryImage) {
        formDataToSend.append('categoryImage', formData.categoryImage);
      }

      const response = await axios.post('http://localhost:8080/public/addCategory', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMessage('Category added successfully!');
      // Reset form
      setFormData({
        categoryTitle: '',
        categoryName: '',
        description: '',
        categoryImage: null
      });
      setPreviewImage(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Sidebar - Purple Only */}
      <aside className="w-72 fixed left-0 top-0 h-full bg-purple-800 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={Logo}
                alt="Logo"
                className="w-28 h-28 rounded-full bg-white p-2 transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full border-4 border-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-center text-white">
              Admin Dashboard
            </h2>
            <p className="text-sm text-purple-200 mt-1">Skill Challenge Portal</p>
          </div>
          <nav className="space-y-3">
            <Link 
              to="/AdminManagementDashboard" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-700 hover:bg-purple-600 transition-all duration-300 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaHome className="text-white" />
              </div>
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link 
              to="/ViewAllSessions" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-900 hover:bg-purple-700 transition-all duration-300 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-400 rounded-lg group-hover:bg-purple-300 transition-colors">
                <FaCalendarAlt className="text-white" />
              </div>
              <span className="font-medium">View Sessions</span>
            </Link>
            
            <Link 
              to="/SkillCategoryForm" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-700 hover:bg-purple-600 transition-all duration-300 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaChartLine className="text-white" />
              </div>
              <span className="font-medium">Add Category</span>
            </Link>
            
            <Link 
              to="/AnalyticsDashboard" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-700 hover:bg-purple-600 transition-all duration-300 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaChartLine className="text-white" />
              </div>
              <span className="font-medium">Analytics</span>
            </Link>
            
            <Link 
              to="#" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-700 hover:bg-purple-600 transition-all duration-300 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaQuestionCircle className="text-white" />
              </div>
              <span className="font-medium">Help Center</span>
            </Link>
          </nav>
        </div>
        <button className="flex items-center gap-3 p-4 rounded-xl bg-purple-900 hover:bg-purple-700 transition-all duration-300">
          <FaSignOutAlt />
          <span className="font-medium">Sign out</span>
        </button>
      </aside>

      {/* Main Content - White Background */}
      <main className="flex-1 ml-72 p-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Skill Category</h1>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200">
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="categoryTitle">
                  Category Title
                </label>
                <input
                  type="text"
                  id="categoryTitle"
                  name="categoryTitle"
                  value={formData.categoryTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="categoryName">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                  rows="4"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="categoryImage">
                  Category Image
                </label>
                <input
                  type="file"
                  id="categoryImage"
                  name="categoryImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                />
                {previewImage && (
                  <div className="mt-4">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="h-40 object-contain border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isSubmitting 
                    ? 'bg-purple-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkillCategoryForm;