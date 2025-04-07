import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaPlus, FaChartLine, FaQuestionCircle, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../Images/logo1.png";

const SkillCategoryForm = () => {
  const [formData, setFormData] = useState({
    categoryTitle: '',
    categoryName: '',
    description: '',
    categoryImage: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (!formData.categoryTitle.trim()) {
      errors.categoryTitle = 'Category title is required';
    } else if (formData.categoryTitle.length > 100) {
      errors.categoryTitle = 'Title must be less than 100 characters';
    }
    
    if (!formData.categoryName.trim()) {
      errors.categoryName = 'Category name is required';
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.categoryName)) {
      errors.categoryName = 'Only alphanumeric characters and spaces allowed';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
    
    if (formData.categoryImage) {
      if (formData.categoryImage.size > 5 * 1024 * 1024) {
        errors.categoryImage = 'Image size must be less than 5MB';
      }
      if (!formData.categoryImage.type.match('image.*')) {
        errors.categoryImage = 'Only image files are allowed';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file immediately
      if (!file.type.match('image.*')) {
        setValidationErrors(prev => ({
          ...prev,
          categoryImage: 'Only image files are allowed'
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          categoryImage: 'Image size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        categoryImage: file
      }));
      
      // Clear any previous errors
      setValidationErrors(prev => ({
        ...prev,
        categoryImage: null
      }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('categoryTitle', formData.categoryTitle);
      formDataToSend.append('categoryName', formData.categoryName);
      formDataToSend.append('description', formData.description);
      
      if (formData.categoryImage) {
        formDataToSend.append('categoryImage', formData.categoryImage);
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'multipart/form-data'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post(
        'http://localhost:8080/public/addCategory',
        formDataToSend,
        {
          headers,
          withCredentials: true,
          timeout: 10000 // 10 seconds timeout
        }
      );

      console.log('Server response:', response.data);

      if (response.status === 201) {
        toast.success('Category created successfully!');
        setTimeout(() => {
          navigate('/AdminManagementDashboard');
        }, 1500);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      
      let errorMessage = 'Failed to create category';
      
      if (error.response) {
        // Handle specific HTTP error codes
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid data: ' + 
              (error.response.data?.message || 'Please check your input');
            break;
          case 401:
            errorMessage = 'Authentication required. Please login again.';
            // Optionally redirect to login
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action';
            break;
          case 413:
            errorMessage = 'File size too large. Maximum 5MB allowed.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message || 
              `Server responded with status ${error.response.status}`;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.request) {
        errorMessage = 'No response from server. Check your network connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 fixed left-0 top-0 h-full bg-gradient-to-b from-purple-900 to-gray-900 text-white p-6 flex flex-col justify-between border-r border-purple-500/20">
        <div>
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={Logo}
                alt="Logo"
                className="w-28 h-28 rounded-full bg-white p-2 transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full border-4 border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-center bg-gradient-to-r from-purple-300 to-white text-transparent bg-clip-text">
              Admin Dashboard
            </h2>
            <p className="text-sm text-purple-200 mt-1">Skill Challenge Portal</p>
          </div>
          <nav className="space-y-3">
            <Link 
              to="/AdminManagementDashboard" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaHome className="text-white" />
              </div>
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/80 hover:bg-purple-700 transition-all duration-300 group border border-purple-500/30 hover:border-purple-400/50"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-400 rounded-lg group-hover:bg-purple-300 transition-colors">
                <FaPlus className="text-white" />
              </div>
              <span className="font-medium">Create Challenge</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaChartLine className="text-white" />
              </div>
              <span className="font-medium">Analytics</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaQuestionCircle className="text-white" />
              </div>
              <span className="font-medium">Help Center</span>
            </Link>
          </nav>
        </div>
        <button 
          className="flex items-center gap-3 p-4 rounded-xl bg-black/80 hover:bg-purple-800 transition-all duration-300 shadow-lg border border-purple-500/20"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          <FaSignOutAlt />
          <span className="font-medium">Sign out</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="ml-72 flex-1 p-8">
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/AdminManagementDashboard" 
            className="text-purple-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <FaHome /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-center mt-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">
              Create New Skill Category
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Category Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Title *
                </label>
                <input
                  type="text"
                  name="categoryTitle"
                  value={formData.categoryTitle}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border ${validationErrors.categoryTitle ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="e.g. Advanced React Patterns Workshop"
                />
                {validationErrors.categoryTitle && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.categoryTitle}</p>
                )}
              </div>

              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border ${validationErrors.categoryName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="e.g. React"
                />
                {validationErrors.categoryName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.categoryName}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-3 bg-gray-50 border ${validationErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Detailed description of the skill category"
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <span className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                      Choose File
                    </span>
                    <input
                      type="file"
                      name="categoryImage"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  {formData.categoryImage && (
                    <span className="text-sm text-gray-600">{formData.categoryImage.name}</span>
                  )}
                </div>
                {validationErrors.categoryImage && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.categoryImage}</p>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Category Preview" 
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 text-white font-semibold rounded-lg flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700 transition-colors'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Create Category</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SkillCategoryForm;