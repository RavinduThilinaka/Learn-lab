import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
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

const CategoryCardsPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/public/getAllCategory');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      
      // Convert image data to displayable format
      const categoriesWithImages = data.map(category => {
        let imageUrl = '';
        if (category.categoryImage) {
          // Check if the image is already in base64 format
          if (typeof category.categoryImage === 'string') {
            imageUrl = category.categoryImage.startsWith('data:image') 
              ? category.categoryImage 
              : `data:image/jpeg;base64,${category.categoryImage}`;
          } else if (category.categoryImage.data) {
            // Handle Buffer data from MongoDB
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Search functionality
  useEffect(() => {
    const results = categories.filter(category =>
      category.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="h-12 w-12" />
            <h1 className="text-2xl font-bold">Skill Challenge Portal</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-purple-200 transition-colors">Home</Link>
            <Link to="/CategoryListPage" className="hover:text-purple-200 transition-colors">Admin View</Link>
            <Link to="/about" className="hover:text-purple-200 transition-colors">About</Link>
          </nav>
          <button className="bg-white text-purple-800 px-4 py-2 rounded-md font-medium hover:bg-purple-100 transition-colors">
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Explore Our Skill Categories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our diverse range of skill categories and find challenges that match your interests.
          </p>
        </section>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden bg-purple-50 flex items-center justify-center">
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
                    <span className="text-sm text-purple-600 font-medium">{category.categoryName}</span>
                    <Link 
                      to={`/category/${category.id}`} 
                      className="text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                    >
                      View Challenges <FaArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">
              {searchTerm ? 'No matching categories found' : 'No categories available'}
            </h3>
            {!searchTerm && (
              <p className="mt-2 text-gray-500">
                Check back later or contact support if you believe this is an error.
              </p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-purple-300 transition duration-300 ease-in-out">Home</Link></li>
                <li><Link to="/services" className="hover:text-purple-300 transition duration-300 ease-in-out">Services</Link></li>
                <li><Link to="/about" className="hover:text-purple-300 transition duration-300 ease-in-out">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-purple-300 transition duration-300 ease-in-out">Contact</Link></li>
              </ul>
            </div>
    
            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Contact Us</h3>
              <ul className="space-y-2">
                <li><FontAwesomeIcon icon={faPhoneAlt} className="mr-2" /> +1 (123) 456-7890</li>
                <li><FontAwesomeIcon icon={faEnvelope} className="mr-2" /> info@skillshare.com</li>
                <li>123 Skillshare St.</li>
                <li>City, State, ZIP</li>
              </ul>
            </div>
    
            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Follow Us</h3>
              <ul className="flex space-x-4">
                <li>
                  <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faFacebookF} className="w-6 h-6" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faLinkedinIn} className="w-6 h-6" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
                  </a>
                </li>
              </ul>
            </div>
    
            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Subscribe</h3>
              <p className="mb-4">Stay updated with the latest classes, offers, and news from Skillshare.</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="p-2 rounded-l-lg focus:outline-none text-black"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700 transition duration-300 ease-in-out"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
    
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Skillshare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoryCardsPage;