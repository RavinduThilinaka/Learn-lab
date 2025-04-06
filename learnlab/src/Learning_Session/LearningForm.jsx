import { useState } from 'react';
import { FaHome, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaUsers, FaChartLine, FaTrophy, FaClock, FaPlus, FaCalendarAlt, FaFileVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../Images/logo1.png";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LearningSessionScheduling() {
  const [videoFile, setVideoFile] = useState(null);
  const [formData, setFormData] = useState({
    sessionTitle: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload MP4, AVI, or MOV.');
      return;
    }

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      setError('File size exceeds 500MB limit.');
      return;
    }

    setVideoFile(file);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
      }
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.sessionTitle || !formData.startDate || !formData.startTime) {
      setError('Please fill in all required fields');
      showErrorToast('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (formData.endDate && formData.endTime && 
        new Date(`${formData.endDate}T${formData.endTime}`) <= new Date(`${formData.startDate}T${formData.startTime}`)) {
      setError('End time must be after start time');
      showErrorToast('End time must be after start time');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare form data
      const data = new FormData();
      data.append('sessionTitle', formData.sessionTitle);
      data.append('startDate', formData.startDate);
      data.append('endDate', formData.endDate || '');
      data.append('startTime', formData.startTime);
      data.append('endTime', formData.endTime || '');
      data.append('description', formData.description || '');
      if (videoFile) {
        data.append('sessionVideo', videoFile);
      }

      // Send to backend
      const response = await axios.post('http://localhost:8080/public/addSession', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form after successful submission
      setFormData({
        sessionTitle: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: ''
      });
      setVideoFile(null);
      setError('');
      
      // Show advanced success message
      showSuccessToast(
        <div>
          <h3 className="font-bold text-lg">Session Scheduled Successfully!</h3>
          <p className="text-sm">"{formData.sessionTitle}" has been added to the learning program.</p>
          <div className="mt-2 text-xs">
            <p>Start: {new Date(`${formData.startDate}T${formData.startTime}`).toLocaleString()}</p>
            {formData.endDate && <p>End: {new Date(`${formData.endDate}T${formData.endTime}`).toLocaleString()}</p>}
          </div>
        </div>
      );
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || 'Failed to schedule session. Please try again.';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-900 to-gray-900 text-white">
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
        {/* Toast Container */}
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
          theme="colored"
        />
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 text-transparent bg-clip-text mb-3">
              Schedule Learning Session
            </h1>
            <p className="text-lg text-gray-600">Create engaging learning experiences for your participants</p>
          </div>
          
           {/* Dashboard Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Card 1 - Total Sessions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition-all duration-300 hover:scale-105">
              <div className="p-6 flex items-center">
                <div className="p-4 rounded-full bg-purple-100 mr-4">
                  <FaCalendarAlt className="text-purple-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Sessions</p>
                  <h3 className="text-2xl font-bold text-gray-800">24</h3>
                  <p className="text-green-500 text-sm mt-1">+5 this month</p>
                </div>
              </div>
            </div>
            
            {/* Card 2 - Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition-all duration-300 hover:scale-105">
              <div className="p-6 flex items-center">
                <div className="p-4 rounded-full bg-blue-100 mr-4">
                  <FaClock className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Upcoming</p>
                  <h3 className="text-2xl font-bold text-gray-800">8</h3>
                  <p className="text-purple-500 text-sm mt-1">Next in 2 days</p>
                </div>
              </div>
            </div>
            
            {/* Card 3 - Participants */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition-all duration-300 hover:scale-105">
              <div className="p-6 flex items-center">
                <div className="p-4 rounded-full bg-green-100 mr-4">
                  <FaUsers className="text-green-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Participants</p>
                  <h3 className="text-2xl font-bold text-gray-800">143</h3>
                  <p className="text-blue-500 text-sm mt-1">+12 new</p>
                </div>
              </div>
            </div>
            
            {/* Card 4 - Completion Rate */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition-all duration-300 hover:scale-105">
              <div className="p-6 flex items-center">
                <div className="p-4 rounded-full bg-orange-100 mr-4">
                  <FaTrophy className="text-orange-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completion Rate</p>
                  <h3 className="text-2xl font-bold text-gray-800">89%</h3>
                  <p className="text-green-500 text-sm mt-1">+7% this month</p>
                </div>
              </div>
            </div>
          </div>

          
          {/* Session Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <FaCalendarAlt className="text-purple-200" />
                Session Details
              </h2>
              <p className="text-purple-100 mt-1">Fill in the information below to schedule a new learning session</p>
            </div>
            
            {/* Form Body */}
            <div className="p-8 space-y-8">
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                  <p>{error}</p>
                </div>
              )}
              
              {/* Session Title */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700">Session Title *</label>
                <input 
                  type="text" 
                  name="sessionTitle"
                  value={formData.sessionTitle}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder-gray-400"
                  placeholder="Advanced React Patterns Workshop" 
                  required
                />
              </div>
              
              {/* Date and Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-600" />
                    Start Date *
                  </label>
                  <input 
                    type="date" 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                    required
                  />
                </div>
                
                {/* End Date */}
                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-600" />
                    End Date
                  </label>
                  <input 
                    type="date" 
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>
                
                {/* Start Time */}
                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <FaClock className="text-purple-600" />
                    Start Time *
                  </label>
                  <input 
                    type="time" 
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                    required
                  />
                </div>
                
                {/* End Time */}
                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <FaClock className="text-purple-600" />
                    End Time
                  </label>
                  <input 
                    type="time" 
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700">Session Description</label>
                <textarea 
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder-gray-400"
                  placeholder="Describe what participants will learn in this session..."
                ></textarea>
              </div>
              
              {/* Video Upload */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <FaFileVideo className="text-purple-600" />
                  Upload Session Video
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-300 hover:border-purple-400 hover:bg-purple-50">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <FaFileVideo className="text-4xl text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-700">Drag and drop your video file here</p>
                      <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      id="video-upload"
                      accept="video/mp4,video/avi,video/quicktime"
                      onChange={handleVideoChange}
                    />
                    <label 
                      htmlFor="video-upload" 
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
                    >
                      Select File
                    </label>
                    {videoFile && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">
                          Selected: {videoFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">Accepted formats: MP4, AVI, MOV (Max 500MB)</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end">
              <button 
                type="submit" 
                className={`px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scheduling...
                  </span>
                ) : 'Schedule Learning Session'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}