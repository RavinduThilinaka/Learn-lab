import { FaHome, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaUsers, FaChartLine, FaTrophy, FaClock, FaPlus, FaCalendarAlt, FaFileVideo } from "react-icons/fa";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Logo from "../Images/logo1.png";

export default function LearningSessionScheduling() {
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
              to="#" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
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
        <button className="flex items-center gap-3 p-4 rounded-xl bg-black hover:bg-purple-800 transition-all duration-300 shadow-lg">
          <FaSignOutAlt />
          <span className="font-medium">Sign out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 bg-gradient-to-b from-gray-100 to-white text-gray-800">
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
          <form className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
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
              {/* Session Title */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700">Session Title</label>
                <input 
                  type="text" 
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 placeholder-gray-400"
                  placeholder="Advanced React Patterns Workshop" 
                />
              </div>
              
              {/* Date and Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-600" />
                    Start Date
                  </label>
                  <input 
                    type="date" 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
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
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>
                
                {/* Start Time */}
                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <FaClock className="text-purple-600" />
                    Start Time
                  </label>
                  <input 
                    type="time" 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
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
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700">Session Description</label>
                <textarea 
                  rows="4"
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
                      accept="video/*"
                    />
                    <label 
                      htmlFor="video-upload" 
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
                    >
                      Select File
                    </label>
                    <p className="text-xs text-gray-500">Accepted formats: MP4, AVI, MOV (Max 500MB)</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end">
              <button 
                type="submit" 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Schedule Learning Session
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}