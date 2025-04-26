import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaTimes, FaSearch, FaFilePdf } from 'react-icons/fa';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaChartLine, 
  FaQuestionCircle, 
  FaSignOutAlt,
  FaPlusCircle,
  FaListAlt
} from 'react-icons/fa';
import Logo from '../Images/logo1.png';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: '',
    categoryTitle: '',
    categoryName: '',
    description: '',
    active: true,
    categoryImage: null,
    imagePreview: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/public/getAllCategory');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      
      // Convert byte array to image URLs for display
      const categoriesWithImages = data.map(category => ({
        ...category,
        imagePreview: category.categoryImage 
          ? `data:image/jpeg;base64,${arrayBufferToBase64(category.categoryImage)}`
          : ''
      }));
      
      setCategories(categoriesWithImages);
      setFilteredCategories(categoriesWithImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert byte array to base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Search functionality
  useEffect(() => {
    const results = categories.filter(category =>
      category.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:8080/public/deleteCategory/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete category');
        }
        
        fetchCategories();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUpdateClick = (category) => {
    setCurrentCategory({
      ...category,
      imagePreview: category.imagePreview || ''
    });
    setShowUpdateModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentCategory(prev => ({
          ...prev,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('categoryTitle', currentCategory.categoryTitle);
    formData.append('categoryName', currentCategory.categoryName);
    formData.append('description', currentCategory.description);
    formData.append('active', currentCategory.active);
    if (imageFile) {
      formData.append('categoryImage', imageFile);
    }

    try {
      const response = await fetch(`http://localhost:8080/public/updateCategory/${currentCategory.id}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      setShowUpdateModal(false);
      setImageFile(null);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCategory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePDF = () => {
    // Import jsPDF and autoTable dynamically to ensure proper initialization
    import('jspdf').then((jsPDFModule) => {
      import('jspdf-autotable').then((autoTableModule) => {
        const { jsPDF } = jsPDFModule;
        const autoTable = autoTableModule.default;
        
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.setFont('helvetica', 'bold');
        doc.text('Category List Report', 105, 20, { align: 'center' });
        
        // Date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 27, { align: 'center' });
        
        // Table data
        const tableData = filteredCategories.map(category => [
          category.categoryTitle || 'N/A',
          category.categoryName || 'N/A',
          category.description ? category.description.substring(0, 50) + (category.description.length > 50 ? '...' : '') : 'N/A',
          category.active ? 'Active' : 'Inactive'
        ]);
        
        // AutoTable
        autoTable(doc, {
          startY: 35,
          head: [['Title', 'Name', 'Description', 'Status']],
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [128, 0, 128], // Purple color
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          },
          styles: {
            fontSize: 9,
            cellPadding: 2,
            overflow: 'linebreak',
            valign: 'middle'
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 30 },
            2: { cellWidth: 80 },
            3: { cellWidth: 20 }
          },
          margin: { top: 40 }
        });
        
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `Page ${i} of ${pageCount}`,
            200,
            290,
            { align: 'right' }
          );
        }
        
        doc.save('categories_report.pdf');
      });
    }).catch(error => {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    });
  };

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
    <div className="flex h-screen">
      {/* Sidebar */}
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
              to="/SkillCategoryForm" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-700 hover:bg-purple-600 transition-all duration-300 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaPlusCircle className="text-white" />
              </div>
              <span className="font-medium">Add Category</span>
            </Link>
            
            <Link 
              to="/CategoryListPage" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-700 hover:bg-purple-600 transition-all duration-300 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaListAlt className="text-white" />
              </div>
              <span className="font-medium">View Categories</span>
            </Link>
          </nav>
        </div>
        <button className="flex items-center gap-3 p-4 rounded-xl bg-purple-900 hover:bg-purple-700 transition-all duration-300">
          <FaSignOutAlt />
          <span className="font-medium">Sign out</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Category List</h1>
          <div className="flex space-x-4">
            <button 
              onClick={generatePDF}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <FaFilePdf className="mr-2" />
              Generate PDF
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden" ref={tableRef}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.imagePreview ? (
                        <img 
                          src={category.imagePreview} 
                          alt={category.categoryTitle} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.categoryTitle || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {category.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleUpdateClick(category)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <FaEye className="inline mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'No matching categories found' : 'No categories found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Category Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">Update Category</h3>
              <button 
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryTitle">
                  Category Title
                </label>
                <input
                  type="text"
                  id="categoryTitle"
                  name="categoryTitle"
                  value={currentCategory.categoryTitle || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={currentCategory.categoryName}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={currentCategory.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryImage">
                  Category Image
                </label>
                {currentCategory.imagePreview && (
                  <div className="mb-2">
                    <img 
                      src={currentCategory.imagePreview} 
                      alt="Current" 
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="categoryImage"
                  name="categoryImage"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  accept="image/*"
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="active"
                    checked={currentCategory.active}
                    onChange={handleInputChange}
                    className="form-checkbox h-5 w-5 text-purple-600"
                  />
                  <span className="text-gray-700">Active</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryListPage;