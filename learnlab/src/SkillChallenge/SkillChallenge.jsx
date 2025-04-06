import { FaHome, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaUsers, FaChartLine, FaTrophy, FaClock, FaPlus, FaCheck, FaCheckCircle } from "react-icons/fa";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Logo from "../Images/logo1.png";
import { useState } from "react";

export default function SkillChallenge() {
  // Sample data for the stats cards
  const dashboardStats = [
    { title: "Total Users", value: "1,248", icon: <FaUsers className="text-3xl" />, color: "bg-blue-500" },
    { title: "Active Challenges", value: "24", icon: <FaTrophy className="text-3xl" />, color: "bg-purple-500" },
    { title: "Avg. Score", value: "78%", icon: <FaChartLine className="text-3xl" />, color: "bg-green-500" },
    { title: "Avg. Time", value: "4.2m", icon: <FaClock className="text-3xl" />, color: "bg-yellow-500" }
  ];

  // State for form data and submission
  const [formData, setFormData] = useState({
    questionText: "",
    deadLine: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('http://localhost:8080/public/addChallenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionText: formData.questionText,
          deadLine: `PT${formData.deadLine}M`,
          optionA: formData.optionA,
          optionB: formData.optionB,
          optionC: formData.optionC,
          optionD: formData.optionD,
          correctAnswer: formData.correctAnswer
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShowSuccessPopup(true);
      setFormData({
        questionText: "",
        deadLine: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: ""
      });
      
      setTimeout(() => setShowSuccessPopup(false), 6000);
    } catch (error) {
      console.error('Error submitting challenge:', error);
      setSubmitError(error.message || 'Failed to submit challenge');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-700 to-black text-white">
      {/* Success Popup */}
   
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 transform transition-all duration-300 animate-scale-in">
            <div className="flex flex-col items-center">
              {/* Animated checkmark circle */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-purple-600 text-5xl" />
                </div>
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping opacity-0"></div>
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Successfully Published!</h3>
                <p className="text-gray-600 mb-6">Your challenge is now live and visible to users.</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                  <div 
                    className="bg-purple-600 h-1.5 rounded-full animate-progress" 
                    style={{ animationDuration: '6s' }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-500">Closing automatically...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 fixed left-0 top-0 h-full bg-gradient-to-b from-purple-600 to-black text-white p-6 flex flex-col justify-between border-r border-purple-500/20">
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
              to="/SkillChallenge" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-700/80 hover:bg-purple-600 transition-all duration-300 group border border-purple-500/50 hover:border-purple-400"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaPlus className="text-white" />
              </div>
              <span className="font-medium">Create Challenge</span>
            </Link>
            <Link 
              to="/viewChallange" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaTrophy className="text-white" />
              </div>
              <span className="font-medium">All Challenges</span>
            </Link>
            <Link 
              to="/skillAnalysis" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaChartLine className="text-white" />
              </div>
              <span className="font-medium">Analytics</span>
            </Link>
            <Link 
              to="/help" 
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
      <main className="flex-1 ml-72 p-10 bg-gray-50 text-black">
        {/* Dashboard Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-black text-transparent bg-clip-text mb-3">
            Skill Challenge Creator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Design engaging challenges to test your team's skills and knowledge
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardStats.map((stat, index) => (
            <div 
              key={index}
              className={`${stat.color} text-white p-6 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white/80">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/20">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/70 rounded-full" 
                  style={{ width: `${Math.random() * 80 + 20}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Challenge Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <FaPlus className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Challenge</h2>
                <p className="text-purple-100">Design a skill-testing question for your team</p>
              </div>
            </div>
          </div>
          
          <form className="p-8" onSubmit={handleSubmit}>
            {/* Question Text */}
            <div className="mb-8">
              <label className="block font-bold text-lg text-gray-700 mb-3">Question Text</label>
              <div className="relative">
                <textarea 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-purple-300" 
                  placeholder="Enter your question here"
                  rows="4"
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  Character count: <span>{formData.questionText.length}</span>/500
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div className="mb-8">
              <label className="block font-bold text-lg text-gray-700 mb-3">Time Limit (minutes)</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="1"
                  max="60"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-purple-300" 
                  placeholder="Enter duration in minutes (1-60)"
                  name="deadLine"
                  value={formData.deadLine}
                  onChange={handleInputChange}
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  mins
                </div>
              </div>
            </div>

            {/* Options in 2x2 grid */}
            <div className="mb-8">
              <label className="block font-bold text-lg text-gray-700 mb-4">Answer Options</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First row - A & B */}
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block font-medium text-gray-700 mb-2">Option A</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-purple-300 pl-10" 
                      placeholder="Enter option A"
                      name="optionA"
                      value={formData.optionA}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="absolute left-4 top-[2.6rem] text-xs font-bold text-purple-600">A.</div>
                  </div>
                  <div className="relative">
                    <label className="block font-medium text-gray-700 mb-2">Option B</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-purple-300 pl-10" 
                      placeholder="Enter option B"
                      name="optionB"
                      value={formData.optionB}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="absolute left-4 top-[2.6rem] text-xs font-bold text-purple-600">B.</div>
                  </div>
                </div>
                
                {/* Second row - C & D */}
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block font-medium text-gray-700 mb-2">Option C</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-purple-300 pl-10" 
                      placeholder="Enter option C"
                      name="optionC"
                      value={formData.optionC}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="absolute left-4 top-[2.6rem] text-xs font-bold text-purple-600">C.</div>
                  </div>
                  <div className="relative">
                    <label className="block font-medium text-gray-700 mb-2">Option D</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-purple-300 pl-10" 
                      placeholder="Enter option D"
                      name="optionD"
                      value={formData.optionD}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="absolute left-4 top-[2.6rem] text-xs font-bold text-purple-600">D.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Correct Answer */}
            <div className="mb-10">
              <label className="block font-bold text-lg text-gray-700 mb-3">Correct Answer</label>
              <div className="grid grid-cols-4 gap-4">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input 
                      type="radio" 
                      name="correctAnswer" 
                      value={option}
                      checked={formData.correctAnswer === option}
                      onChange={handleInputChange}
                      className="hidden peer"
                      required
                    />
                    <div className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-center font-medium text-gray-800 peer-checked:bg-purple-600 peer-checked:border-purple-400 peer-checked:text-white peer-checked:shadow-lg transition-all duration-300 hover:bg-gray-100 cursor-pointer">
                      Option {option}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Error message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                Error: {submitError}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                className="px-8 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors duration-300 font-medium"
                onClick={() => {
                  setFormData({
                    questionText: "",
                    deadLine: "",
                    optionA: "",
                    optionB: "",
                    optionC: "",
                    optionD: "",
                    correctAnswer: ""
                  });
                  setSubmitError(null);
                }}
                disabled={isSubmitting}
              >
                Reset Form
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl text-white hover:from-purple-700 hover:to-purple-900 transition-all duration-500 font-bold shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <FaPlus /> Publish Challenge
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}