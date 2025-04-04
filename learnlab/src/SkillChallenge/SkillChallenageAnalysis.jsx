import { FaHome, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaUsers, FaChartLine, FaTrophy, FaClock, FaPlus } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Logo from "../Images/logo1.png";

export default function SkillChallengeAnalysis() {
  // Sample data for charts
  const performanceData = [
    { name: 'Jan', score: 65, participants: 120 },
    { name: 'Feb', score: 72, participants: 145 },
    { name: 'Mar', score: 78, participants: 160 },
    { name: 'Apr', score: 82, participants: 185 },
    { name: 'May', score: 85, participants: 210 },
    { name: 'Jun', score: 79, participants: 195 },
  ];

  const challengeDistribution = [
    { name: 'Technical', value: 35 },
    { name: 'Analytical', value: 25 },
    { name: 'Creative', value: 20 },
    { name: 'Communication', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const timeCompletionData = [
    { name: '0-1 min', value: 15 },
    { name: '1-2 min', value: 35 },
    { name: '2-3 min', value: 25 },
    { name: '3-4 min', value: 15 },
    { name: '4+ min', value: 10 },
  ];

  // Sample data for the stats cards
  const dashboardStats = [
    { title: "Total Participants", value: "1,248", icon: <FaUsers className="text-3xl" />, color: "bg-blue-500" },
    { title: "Avg. Score", value: "78%", icon: <FaChartLine className="text-3xl" />, color: "bg-green-500" },
    { title: "Completion Rate", value: "92%", icon: <FaTrophy className="text-3xl" />, color: "bg-purple-500" },
    { title: "Avg. Time", value: "2.4m", icon: <FaClock className="text-3xl" />, color: "bg-yellow-500" }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-700 to-black text-white">
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
            <p className="text-sm text-purple-200 mt-1">Skill Challenge Analytics</p>
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
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaPlus className="text-white" />
              </div>
              <span className="font-medium">Create Challenge</span>
            </Link>
            <Link 
              to="/SkillChallengeAnalysis" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 transition-all duration-300 group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-400 rounded-lg">
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
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-black text-transparent bg-clip-text mb-2">
            Skill Challenge Analytics
          </h1>
          <p className="text-lg text-gray-600">Detailed performance metrics and insights</p>
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

        {/* Performance Over Time Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }} 
                  name="Average Score (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="participants" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }} 
                  name="Participants"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Challenge Distribution Pie Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Challenge Types Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={challengeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {challengeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} challenges`, 'Count']}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Completion Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Completion Time Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeCompletionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value) => [`${value}% of participants`, 'Percentage']}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    name="Percentage of participants"
                  >
                    {timeCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}