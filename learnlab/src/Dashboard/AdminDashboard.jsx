import { FaHome, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaTasks, FaChartBar, FaCalendarAlt, FaLightbulb, FaClipboardList, FaPhone } from "react-icons/fa";
import { useState } from "react";
import Logo from "../Images/logo1.png"; // Adjust the path as needed
import { Link, useNavigate } from "react-router-dom"; 

export default function AdminManagementDashboard() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutProgress, setLogoutProgress] = useState(0);

  const handleSignOut = () => {
    setIsLoggingOut(true);
    
    // Simulate a progress bar animation
    const interval = setInterval(() => {
      setLogoutProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Clear all stored authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('name');
          localStorage.removeItem('email');
          
          // Redirect to login page after animation completes
          setTimeout(() => navigate('/Login'), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Full-screen logout overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <div className="text-center">
            <FaSignOutAlt className="text-white text-6xl mb-6 animate-bounce mx-auto" />
            <h2 className="text-3xl font-bold text-white mb-4">Securing your session...</h2>
            <p className="text-xl text-purple-300 mb-8">We're logging you out safely</p>
            
            <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto mb-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100 ease-linear"
                style={{ width: `${logoutProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{logoutProgress}% complete</p>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-black text-white p-6 flex flex-col justify-between transition-all duration-300 ease-in-out transform hover:shadow-2xl">
        <div>
          <div className="flex flex-col items-center mb-6">
            <img
              src={Logo} 
              alt="Logo"
              className="w-24 h-24 rounded-full bg-white p-2 transform hover:scale-110 transition-transform duration-300"
            />
          </div>
          <nav className="space-y-4">
            <button className="w-full flex items-center gap-2 p-3 bg-white text-black rounded-lg hover:bg-purple-100 transition-all duration-300 hover:shadow-md">
              <FaHome className="text-purple-600" /> Dashboard
            </button>
            <button className="w-full flex items-center gap-2 p-3 hover:bg-white hover:text-black rounded-lg transition-all duration-300 hover:shadow-md">
              <FaUser /> Your Account
            </button>
            <button className="w-full flex items-center gap-2 p-3 hover:bg-white hover:text-black rounded-lg transition-all duration-300 hover:shadow-md">
              <FaCog /> Settings
            </button>
            <button className="w-full flex items-center gap-2 p-3 hover:bg-white hover:text-black rounded-lg transition-all duration-300 hover:shadow-md">
              <FaQuestionCircle /> Help
            </button>
          </nav>
        </div>
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 p-3 bg-black text-white rounded-lg hover:bg-red-600 transition-all duration-300 hover:shadow-lg group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <FaSignOutAlt className="transform group-hover:rotate-180 transition-transform duration-300" /> 
            Sign out
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-black text-transparent bg-clip-text animate-pulse">
          Admin Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 p-6 rounded-lg">
          {/* Skill Category Management Card */}
          <Link 
            to="/SkillCategoryForm" 
            className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
          >
            <FaTasks className="text-white text-3xl mb-3 animate-pulse" />
            <p className="mt-2 font-semibold text-white text-center">Skill Category Management</p>
          </Link>
          
          {/* Skill Assessment and Feedback Card */}
          <Link 
            to="/FeedbackManagement" 
            className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
          >
            <FaChartBar className="text-white text-3xl mb-3 animate-pulse" />
            <p className="mt-2 font-semibold text-white text-center">Skill Assessment and Feedback</p>
          </Link>
          
          {/* Learning Session Scheduling Card */}
          <Link 
            to="/LearningSessionScheduling" 
            className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
          >
            <FaCalendarAlt className="text-white text-3xl mb-3 animate-pulse" />
            <p className="mt-2 font-semibold text-white text-center">Learning Session Scheduling</p>
          </Link>
          
          {/* Skill Challenge Management Card */}
          <Link 
            to="/skillChallenge" 
            className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
          >
            <FaLightbulb className="text-white text-3xl mb-3 animate-pulse" />
            <p className="mt-2 font-semibold text-white text-center">Skill Challenge Management</p>
          </Link>
          
          {/* Request Details Card */}
          <Link 
            to="/request-details" 
            className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
          >
            <FaClipboardList className="text-white text-3xl mb-3 animate-pulse" />
            <p className="mt-2 font-semibold text-white text-center">Request Details</p>
          </Link>
          
          {/* Contact Details Card */}
          <Link 
            to="/Contact" 
            className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
          >
            <FaPhone className="text-white text-3xl mb-3 animate-pulse" />
            <p className="mt-2 font-semibold text-white text-center">Contact Details</p>
          </Link>
        </div>
      </main>
    </div>
  );
}