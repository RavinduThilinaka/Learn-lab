import { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaUser, FaReply, FaTrash, FaHome, FaCalendarAlt, FaChartLine, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo from '../Images/logo1.png';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyModal, setReplyModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/public/allContact');
      setContacts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch contacts');
      setLoading(false);
    }
  };

  const handleReply = (contact) => {
    setSelectedContact(contact);
    setReplyModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/public/deleteContact/${id}`);
      fetchContacts();
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically send the reply via email
      // For now, we'll just close the modal
      setReplyModal(false);
      setReplyMessage('');
      alert('Reply sent successfully!');
    } catch (err) {
      setError('Failed to send reply');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex">
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
            <p className="text-sm text-purple-200 mt-1">Contact Management</p>
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
              to="/CategoryListPage" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-900 hover:bg-purple-700 transition-all duration-300 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-400 rounded-lg group-hover:bg-purple-300 transition-colors">
                <FaCalendarAlt className="text-white" />
              </div>
              <span className="font-medium">View Messages</span>
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

      {/* Main Content */}
      <main className="ml-72 p-8 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Contact Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(contact.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope />
                  <span>{contact.email}</span>
                </div>
                {contact.mobile && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaPhone />
                    <span>{contact.mobile}</span>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Subject:</h4>
                  <p className="text-gray-600">{contact.subject}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Message:</h4>
                  <p className="text-gray-600">{contact.message}</p>
                </div>
              </div>

              <button
                onClick={() => handleReply(contact)}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaReply />
                <span>Reply</span>
              </button>
            </div>
          ))}
        </div>

        {/* Reply Modal */}
        {replyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Reply to {selectedContact?.name}</h2>
              <form onSubmit={handleSubmitReply}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReplyModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Contact;
