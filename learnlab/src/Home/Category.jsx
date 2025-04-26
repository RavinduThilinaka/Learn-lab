import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaPlus } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faLinkedinIn, 
  faInstagram, 
  faGithub, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons';
import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Logo from '../Images/logo1.png';
import Navbar from '../Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryCardsPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/public/getAllCategory');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      
      const categoriesWithImages = data.map(category => {
        let imageUrl = '';
        if (category.categoryImage) {
          if (typeof category.categoryImage === 'string') {
            imageUrl = category.categoryImage.startsWith('data:image') 
              ? category.categoryImage 
              : `data:image/jpeg;base64,${category.categoryImage}`;
          } else if (category.categoryImage.data) {
            const base64String = btoa(
              String.fromCharCode.apply(null, new Uint8Array(category.categoryImage.data))
            );
            imageUrl = `data:image/jpeg;base64,${base64String}`;
          }
        }
        
        return {
          ...category,
          imagePreview: imageUrl || ''
        };
      });
      
      setCategories(categoriesWithImages);
      setFilteredCategories(categoriesWithImages);
    } catch (err) {
      setError(err.message);
      toast.error(`Error loading categories: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let results = categories;
    
    // Apply active/inactive filter
    if (activeFilter !== 'all') {
      results = results.filter(category => 
        activeFilter === 'active' ? category.active : !category.active
      );
    }
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(category =>
        category.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredCategories(results);
  }, [searchTerm, categories, activeFilter]);

  const handleStatusFilter = (status) => {
    setActiveFilter(status);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
          <p className="font-bold">Error Loading Categories</p>
          <p>{error}</p>
          <button 
            onClick={fetchCategories}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        
            
         

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories by title, name or description..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-gray-700 font-medium">Status:</span>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => handleStatusFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('active')}
                className={`px-4 py-2 text-sm font-medium ${activeFilter === 'active' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusFilter('inactive')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeFilter === 'inactive' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Inactive
              </button>
            </div>
          </div>

          <Link 
            to="/add-category"
            className="flex items-center justify-center w-full md:w-auto px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            <FaPlus className="mr-2" />
            Add New Category
          </Link>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => (
              <div 
                key={category.id} 
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${!category.active ? 'opacity-80' : ''}`}
              >
                <div className="h-48 overflow-hidden bg-purple-50 flex items-center justify-center relative">
                  {category.imagePreview ? (
                    <img 
                      src={category.imagePreview} 
                      alt={category.categoryTitle} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '';
                        e.target.parentElement.classList.add('bg-purple-100');
                        const span = document.createElement('span');
                        span.className = 'text-gray-500';
                        span.textContent = 'Image not available';
                        e.target.parentElement.innerHTML = '';
                        e.target.parentElement.appendChild(span);
                      }}
                    />
                  ) : (
                    <span className="text-gray-500">No image available</span>
                  )}
                  {!category.active && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <span className="text-white font-bold text-lg bg-red-500 px-3 py-1 rounded">
                        Inactive
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{category.categoryTitle}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description || 'No description available'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-600 font-medium">#{category.categoryName}</span>
                    <Link 
                      to={`/category/${category.id}`} 
                      className="text-purple-600 hover:text-purple-800 flex items-center transition-colors font-medium"
                    >
                      View Challenges <FaArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-medium text-gray-700">
              {searchTerm || activeFilter !== 'all' 
                ? 'No matching categories found' 
                : 'No categories available yet'}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search or filter criteria'
                : activeFilter !== 'all'
                  ? `No ${activeFilter} categories found`
                  : 'Check back later or create a new category'}
            </p>
            {(!searchTerm && activeFilter === 'all') && (
              <Link 
                to="/add-category"
                className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Create First Category
              </Link>
            )}
          </div>
        )}

        {/* Pagination would go here */}
        {filteredCategories.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-black text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={Logo} alt="Logo" className="h-10 w-10 mr-2" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-white text-transparent bg-clip-text">
                  SkillShare
                </span>
              </div>
              <p className="text-gray-300 mb-4">
                Empowering individuals through skill development and challenge-based learning.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-purple-300 transition duration-300">Home</Link></li>
                <li><Link to="/categories" className="hover:text-purple-300 transition duration-300">Categories</Link></li>
                <li><Link to="/challenges" className="hover:text-purple-300 transition duration-300">Challenges</Link></li>
                <li><Link to="/leaderboard" className="hover:text-purple-300 transition duration-300">Leaderboard</Link></li>
                <li><Link to="/about" className="hover:text-purple-300 transition duration-300">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="hover:text-purple-300 transition duration-300">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-purple-300 transition duration-300">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-purple-300 transition duration-300">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-purple-300 transition duration-300">Terms of Service</Link></li>
                <li><Link to="/feedback" className="hover:text-purple-300 transition duration-300">Feedback</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Newsletter</h3>
              <p className="text-gray-300 mb-4">
                Subscribe to our newsletter for the latest updates and challenges.
              </p>
              <form className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} SkillShare. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-300 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition duration-300 text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition duration-300 text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoryCardsPage;