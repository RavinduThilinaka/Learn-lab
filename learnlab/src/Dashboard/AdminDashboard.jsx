
import { FaHome, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaTasks, FaChartBar, FaCalendarAlt, FaLightbulb, FaClipboardList, FaPhone } from "react-icons/fa";
import Logo from "../Images/logo1.png"; // Adjust the path as needed
import { Link } from "react-router-dom"; 

export default function AdminManagementDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-black text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center mb-6">
            <img
              src={Logo} 
              alt="Logo"
              className="w-24 h-24 rounded-full bg-white p-2"
            />
          </div>
          <nav className="space-y-4">
            <button className="w-full flex items-center gap-2 p-3 bg-white text-black rounded-lg">
              <FaHome /> Dashboard
            </button>
            <button className="w-full flex items-center gap-2 p-3 bg-white text-black rounded-lg">
              <FaUser /> Your Account
            </button>
            <button className="w-full flex items-center gap-2 p-3 bg-white text-black rounded-lg">
              <FaCog /> Settings
            </button>
            <button className="w-full flex items-center gap-2 p-3 bg-white text-black rounded-lg">
              <FaQuestionCircle /> Help
            </button>
          </nav>
        </div>
        <button className="w-full flex items-center gap-2 p-3 bg-black text-white rounded-lg">
          <FaSignOutAlt /> Sign out
        </button>
      </aside>

     
      {/* Main Content */}
      <main className="flex-1 p-10">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-black text-transparent bg-clip-text">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-3 gap-6 mt-10 p-6 rounded-lg">
        {/* Skill Category Management Card */}
        <Link to="/SkillCategoryForm" className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg">
          <FaTasks className="text-white text-3xl" />
          <p className="mt-2 font-semibold text-white">Skill Category Management</p>
        </Link>
        
        {/* Skill Assessment and Feedback Card */}
        <Link to="/FeedbackManagement" className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg">
          <FaChartBar className="text-white text-3xl" />
          <p className="mt-2 font-semibold text-white">Skill Assessment and Feedback</p>
        </Link>
        
        {/* Learning Session Scheduling Card */}
        <Link to="/LearningSessionScheduling" className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg">
          <FaCalendarAlt className="text-white text-3xl" />
          <p className="mt-2 font-semibold text-white">Learning Session Scheduling</p>
        </Link>
        
        {/* Skill Challenge Management Card */}
        <Link to="/skillChallenge" className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg">
          <FaLightbulb className="text-white text-3xl" />
          <p className="mt-2 font-semibold text-white">Skill Challenge Management</p>
        </Link>
        
        {/* Request Details Card */}
        <Link to="/request-details" className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg">
          <FaClipboardList className="text-white text-3xl" />
          <p className="mt-2 font-semibold text-white">Request Details</p>
        </Link>
        
        {/* Contact Details Card */}
        <Link to="/contact-details" className="flex flex-col items-center p-6 h-40 bg-gradient-to-b from-purple-600 to-black shadow-lg rounded-lg">
          <FaPhone className="text-white text-3xl" />
          <p className="mt-2 font-semibold text-white">Contact Details</p>
        </Link>
      </div>
    </main>
    </div>
  );
}
