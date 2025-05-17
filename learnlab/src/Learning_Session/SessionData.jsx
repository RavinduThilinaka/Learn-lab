import { useState, useEffect, useRef } from 'react';
import { FaHome, FaCog, FaQuestionCircle, FaSignOutAlt, FaChartLine, FaPlus, FaCalendarAlt, FaEdit, FaTrash, FaEye, FaVideo, FaFilePdf, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../Images/logo1.png";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ViewAllSessions() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [editFormData, setEditFormData] = useState({
    sessionTitle: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    description: '',
    videoUrl: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/public/getAllSession');
        setSessions(response.data);
        setFilteredSessions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions. Please try again.');
        setLoading(false);
        showErrorToast('Failed to load sessions. Please try again.');
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      if (autoRefresh) {
        fetchData();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [autoRefresh]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter(session =>
        session.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.description && session.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSessions(filtered);
    }
  }, [searchTerm, sessions]);

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored"
    });
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored"
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return 'N/A';
    const date = new Date(`${dateString}T${timeString}`);
    return date.toLocaleString();
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    
    try {
      await axios.delete(`http://localhost:8080/public/deleteSession/${sessionId}`);
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      setSessions(updatedSessions);
      setFilteredSessions(updatedSessions);
      showSuccessToast('Session deleted successfully!');
    } catch (err) {
      console.error('Error deleting session:', err);
      showErrorToast('Failed to delete session. Please try again.');
    }
  };

  const handleEditClick = (session) => {
    setSelectedSession(session);
    setEditFormData({
      sessionTitle: session.sessionTitle,
      startDate: session.startDate,
      endDate: session.endDate || '',
      startTime: session.startTime,
      endTime: session.endTime || '',
      description: session.description || '',
      videoUrl: session.videoUrl || ''
    });
    setShowEditModal(true);
  };

  const handleViewClick = (session) => {
    setSelectedSession(session);
    setShowViewModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate session title
    if (!editFormData.sessionTitle.trim()) {
      errors.sessionTitle = 'Session title is required';
    } else if (editFormData.sessionTitle.length < 3) {
      errors.sessionTitle = 'Session title must be at least 3 characters long';
    }

    // Validate dates and times
    const startDateTime = new Date(`${editFormData.startDate}T${editFormData.startTime}`);
    const endDateTime = editFormData.endDate && editFormData.endTime 
      ? new Date(`${editFormData.endDate}T${editFormData.endTime}`)
      : null;

    if (endDateTime && endDateTime <= startDateTime) {
      errors.endDateTime = 'End date/time must be after start date/time';
    }

    // Validate description length
    if (editFormData.description && editFormData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }

    // Validate video file
    if (videoFile) {
      const maxSize = 100 * 1024 * 1024; // 100MB
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      
      if (videoFile.size > maxSize) {
        errors.videoFile = 'Video file size must be less than 100MB';
      }
      if (!allowedTypes.includes(videoFile.type)) {
        errors.videoFile = 'Only MP4, WebM, and OGG video formats are allowed';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      showErrorToast('Please fix the validation errors before submitting');
      return;
    }
    
    try {
      const formData = new FormData();
      
      formData.append('sessionTitle', editFormData.sessionTitle);
      formData.append('startDate', editFormData.startDate);
      formData.append('startTime', editFormData.startTime);
      formData.append('endDate', editFormData.endDate || '');
      formData.append('endTime', editFormData.endTime || '');
      formData.append('description', editFormData.description || '');
      
      if (videoFile) {
        formData.append('videoFile', videoFile);
      } else if (editFormData.videoUrl) {
        formData.append('videoUrl', editFormData.videoUrl);
      }
      
      const response = await axios.put(
        `http://localhost:8080/public/updateSession/${selectedSession.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      const updatedSessions = sessions.map(session => 
        session.id === selectedSession.id ? response.data : session
      );
      
      setSessions(updatedSessions);
      setFilteredSessions(updatedSessions);
      setShowEditModal(false);
      setVideoFile(null);
      setFormErrors({});
      showSuccessToast('Session updated successfully!');
    } catch (err) {
      console.error('Error updating session:', err);
      showErrorToast('Failed to update session. Please try again.');
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF({
      orientation: 'landscape'
    });

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Learning Session Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, 30, { align: 'center' });
    
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 280, 35);

    const tableData = filteredSessions.map(session => [
      session.sessionTitle,
      formatDateTime(session.startDate, session.startTime),
      session.endDate && session.endTime ? formatDateTime(session.endDate, session.endTime) : 'N/A',
      session.description || 'No description'
    ]);

    autoTable(doc, {
      head: [['Session Title', 'Start Date/Time', 'End Date/Time', 'Description']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [103, 58, 183],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 40 }
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 280, 200, { align: 'right' });
    }

    doc.save('learning-sessions-report.pdf');
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
              to="/LearningSessionScheduling" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaPlus className="text-white" />
              </div>
              <span className="font-medium">Create Session</span>
            </Link>
            <Link 
              to="/ViewAllSessions" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/80 hover:bg-purple-700 transition-all duration-300 group border border-purple-500/30 hover:border-purple-400/50"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-400 rounded-lg group-hover:bg-purple-300 transition-colors">
                <FaCalendarAlt className="text-white" />
              </div>
              <span className="font-medium">View Sessions</span>
            </Link>
            <Link 
              to="/AnalyticsDashboard" 
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
        <button className="flex items-center gap-3 p-4 rounded-xl bg-black/80 hover:bg-purple-800 transition-all duration-300 shadow-lg border border-purple-500/20">
          <FaSignOutAlt />
          <span className="font-medium">Sign out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 bg-gradient-to-b from-gray-100 to-white text-gray-800">
        <ToastContainer />
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 text-transparent bg-clip-text mb-3">
              All Learning Sessions
            </h1>
            <p className="text-lg text-gray-600">View and manage scheduled learning sessions</p>
            <div className="mt-4 flex justify-center items-center gap-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">Auto Refresh</span>
              </label>
              {autoRefresh && (
                <span className="text-sm text-gray-500">(Refreshing every 30 seconds)</span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <FaCalendarAlt className="text-purple-200" />
                      Scheduled Sessions
                    </h2>
                    <p className="text-purple-100 mt-1">{filteredSessions.length} sessions found</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-purple-200" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search sessions..."
                        className="pl-10 pr-4 py-2 bg-white/20 text-white placeholder-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-white/30 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={generatePDFReport}
                      className="px-4 py-2 bg-white text-purple-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md flex items-center gap-2"
                    >
                      <FaFilePdf /> Generate Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Sessions Table */}
              <div className="overflow-x-auto" ref={tableRef}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Session Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date/Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date/Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSessions.length > 0 ? (
                      filteredSessions.map((session) => (
                        <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{session.sessionTitle}</div>
                            {session.description && (
                              <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                {session.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDateTime(session.startDate, session.startTime)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {session.endDate && session.endTime 
                                ? formatDateTime(session.endDate, session.endTime)
                                : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleViewClick(session)}
                              >
                                <FaEye className="inline mr-1" /> View
                              </button>
                              <button
                                className="text-purple-600 hover:text-purple-900"
                                onClick={() => handleEditClick(session)}
                              >
                                <FaEdit className="inline mr-1" /> Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDelete(session.id)}
                              >
                                <FaTrash className="inline mr-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          {searchTerm ? 'No matching sessions found' : 'No sessions found. Create your first session!'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredSessions.length}</span> of{' '}
                  <span className="font-medium">{filteredSessions.length}</span> sessions
                </div>
                <div className="flex space-x-2">
                  <Link
                    to="/learning-session-scheduling"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-md"
                  >
                    <FaPlus className="inline mr-2" /> Create New Session
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Modal */}
        {showViewModal && selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white rounded-t-xl">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaEye className="text-purple-200" />
                  Session Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedSession.sessionTitle}</h3>
                  <p className="text-gray-600">{selectedSession.description || 'No description'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Date/Time</p>
                    <p className="font-medium">
                      {formatDateTime(selectedSession.startDate, selectedSession.startTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date/Time</p>
                    <p className="font-medium">
                      {selectedSession.endDate && selectedSession.endTime
                        ? formatDateTime(selectedSession.endDate, selectedSession.endTime)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                {selectedSession.videoUrl && (
                  <div>
                    <p className="text-sm text-gray-500">Video</p>
                    <div className="mt-2">
                      <video controls className="w-full rounded-lg">
                        <source src={selectedSession.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white rounded-t-xl">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaEdit className="text-purple-200" />
                  Edit Session
                </h2>
              </div>
              <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Title *</label>
                  <input
                    type="text"
                    name="sessionTitle"
                    value={editFormData.sessionTitle}
                    onChange={handleEditFormChange}
                    className={`w-full p-3 border ${formErrors.sessionTitle ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                    required
                  />
                  {formErrors.sessionTitle && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.sessionTitle}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={editFormData.startDate}
                      onChange={handleEditFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                    <input
                      type="time"
                      name="startTime"
                      value={editFormData.startTime}
                      onChange={handleEditFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={editFormData.endDate}
                      onChange={handleEditFormChange}
                      className={`w-full p-3 border ${formErrors.endDateTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={editFormData.endTime}
                      onChange={handleEditFormChange}
                      className={`w-full p-3 border ${formErrors.endDateTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                    />
                  </div>
                </div>
                {formErrors.endDateTime && (
                  <p className="col-span-2 mt-1 text-sm text-red-600">{formErrors.endDateTime}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="3"
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    className={`w-full p-3 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
                  />
                </div>
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        onChange={handleVideoChange}
                        className={`w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-purple-50 file:text-purple-700
                          hover:file:bg-purple-100 ${formErrors.videoFile ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {editFormData.videoUrl && !videoFile && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaVideo className="mr-2 text-purple-600" />
                        <span>Current video attached</span>
                      </div>
                    )}
                  </div>
                  {formErrors.videoFile && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.videoFile}</p>
                  )}
                  {editFormData.videoUrl && !videoFile && (
                    <div className="mt-2">
                      <video controls className="w-full rounded-lg">
                        <source src={editFormData.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setVideoFile(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}