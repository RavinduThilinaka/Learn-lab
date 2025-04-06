import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaCalendarAlt, FaChartLine, FaQuestionCircle, FaSignOutAlt, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../Images/logo1.png';

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 1,
    comments: ''
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const filtered = feedbacks.filter(feedback => 
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comments.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFeedbacks(filtered);
  }, [searchTerm, feedbacks]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/public/allFeedback');
      setFeedbacks(response.data);
      setFilteredFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to load feedbacks');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback._id);
    setFormData({
      name: feedback.name,
      email: feedback.email,
      rating: feedback.rating,
      comments: feedback.comments
    });
  };

  const handleUpdate = async () => {
    if (!editingFeedback) {
      toast.error('No feedback selected for update');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/public/updateFeedback/${editingFeedback}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        toast.success('Feedback updated successfully');
        setEditingFeedback(null);
        fetchFeedbacks();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error(`Failed to update feedback: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`http://localhost:8080/public/deleteFeedback/${id}`);
        toast.success('Feedback deleted successfully');
        fetchFeedbacks();
      } catch (error) {
        console.error('Error deleting feedback:', error);
        toast.error('Failed to delete feedback');
      }
    }
  };

  const cancelEdit = () => {
    setEditingFeedback(null);
    setFormData({
      name: '',
      email: '',
      rating: 1,
      comments: ''
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-900 to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-72 fixed left-0 top-0 h-full bg-gradient-to-b from-purple-800 to-gray-900 text-white p-6 flex flex-col justify-between border-r border-purple-500/20">
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
              to="/feedback-management" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/80 hover:bg-purple-700 transition-all duration-300 group border border-purple-500/30 hover:border-purple-400/50"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-400 rounded-lg group-hover:bg-purple-300 transition-colors">
                <FaChartLine className="text-white" />
              </div>
              <span className="font-medium">Feedback Management</span>
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
        <button className="flex items-center gap-3 p-4 rounded-xl bg-black/80 hover:bg-purple-800 transition-all duration-300 shadow-lg border border-purple-500/20">
          <FaSignOutAlt />
          <span className="font-medium">Sign out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 bg-gradient-to-b from-gray-100 to-white text-gray-800">
        <ToastContainer />
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-purple-800">Feedback Management</h1>
          
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search feedback by name, email or comments..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No matching feedback found' : 'No feedback data available'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFeedbacks.map((feedback) => (
                      <tr key={feedback._id || Math.random().toString(36).substr(2, 9)}>
                        {editingFeedback === feedback._id ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                name="rating"
                                value={formData.rating}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                              >
                                <option value="1">1 - Poor</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4 - Very Good</option>
                                <option value="5">5 - Excellent</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <textarea
                                name="comments"
                                value={formData.comments}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                                rows="2"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={handleUpdate}
                                className="mr-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">{feedback.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{feedback.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {Array.from({ length: feedback.rating }).map((_, i) => (
                                <span key={`star-${i}-${feedback._id}`} className="text-yellow-400">★</span>
                              ))}
                            </td>
                            <td className="px-6 py-4">{feedback.comments}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleEdit(feedback)}
                                className="mr-2 text-blue-500 hover:text-blue-700 transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(feedback._id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}