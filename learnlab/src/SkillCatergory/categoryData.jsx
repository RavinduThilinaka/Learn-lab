// CategoryListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome, FaPlus, FaChartLine, FaQuestionCircle,
  FaSignOutAlt, FaEdit, FaTrash, FaSearch
} from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../Images/logo1.png';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get('http://localhost:8080/public/getAllCategory', {
          headers,
          withCredentials: true,
          timeout: 10000,
        });

        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error.response?.data || error.message);
        setError('Failed to load categories. Please try again later.');
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.delete(`http://localhost:8080/public/deleteCategory/${categoryId}`, {
        headers,
        withCredentials: true,
        timeout: 10000,
      });

      toast.success('Category deleted successfully');
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error.response?.data || error.message);
      toast.error('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-72 fixed left-0 top-0 h-full bg-gradient-to-b from-purple-900 to-gray-900 text-white p-6 flex flex-col justify-between border-r border-purple-500/20">
        <div>
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img src={Logo} alt="Logo" className="w-28 h-28 rounded-full bg-white p-2 transition-transform group-hover:rotate-6 group-hover:scale-105" />
              <div className="absolute inset-0 rounded-full border-4 border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-center bg-gradient-to-r from-purple-300 to-white text-transparent bg-clip-text">
              Admin Dashboard
            </h2>
            <p className="text-sm text-purple-200 mt-1">Skill Challenge Portal</p>
          </div>
          <nav className="space-y-3">
            <NavItem to="/AdminManagementDashboard" icon={<FaHome />} label="Dashboard" />
            <NavItem to="/create-category" icon={<FaPlus />} label="Create Challenge" />
            <NavItem to="#" icon={<FaChartLine />} label="Analytics" />
            <NavItem to="#" icon={<FaQuestionCircle />} label="Help Center" />
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

      <div className="ml-72 flex-1 p-8">
        <ToastContainer />
        <Header />
        <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <CategoryGrid
          loading={loading}
          error={error}
          categories={filteredCategories}
          handleDelete={handleDelete}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group"
  >
    <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </Link>
);

const Header = () => (
  <div className="mb-8">
    <Link to="/AdminManagementDashboard" className="text-purple-300 hover:text-white transition-colors flex items-center gap-2">
      <FaHome /> Back to Dashboard
    </Link>
    <div className="flex justify-between items-center mt-4">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-white text-transparent bg-clip-text">
        Skill Categories
      </h1>
      <Link
        to="/create-category"
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <FaPlus /> Add New Category
      </Link>
    </div>
  </div>
);

const SearchBox = ({ searchTerm, setSearchTerm }) => (
  <div className="mb-6 bg-white p-4 rounded-xl shadow">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  </div>
);

const CategoryGrid = ({ loading, error, categories, handleDelete, searchTerm }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchTerm ? 'No matching categories found' : 'No categories available'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
            {category.categoryImage ? (
              <img
                src={`data:image/jpeg;base64,${category.categoryImage}`}
                alt={category.categoryTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400">No Image</div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{category.categoryTitle}</h3>
            <p className="text-sm text-purple-600 mb-2">{category.categoryName}</p>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
            <div className="flex justify-between items-center">
              <Link to={`/edit-category/${category.id}`} className="text-purple-600 hover:text-purple-800 flex items-center gap-1">
                <FaEdit size={14} /> Edit
              </Link>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <FaTrash size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryListPage;
