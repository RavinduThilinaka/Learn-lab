import React, { useState, useEffect } from 'react';
import { FaHome, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaUsers, FaChartLine, FaTrophy, FaClock, FaPlus } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Logo from "../Images/logo1.png";

export default function SkillChallengeAnalysis() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('http://localhost:8080/public/allChallenge');
        if (!response.ok) throw new Error('Failed to fetch challenges');
        const data = await response.json();
        setChallenges(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Process data for charts
  const processChartData = () => {
    if (!challenges || challenges.length === 0) return {};

    // Performance over time - handle invalid dates
    const performanceData = challenges
      .slice(0, 6)
      .map(challenge => {
        let date;
        try {
          date = challenge.createdAt ? new Date(challenge.createdAt) : new Date();
          if (isNaN(date.getTime())) date = new Date(); // Fallback if date is invalid
        } catch (e) {
          date = new Date(); // Fallback if date parsing fails
        }
        
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: challenge.avgScore || 0,
          participants: challenge.participantsCount || 0
        };
      });

    // Challenge type distribution
    const typeCounts = challenges.reduce((acc, challenge) => {
      const type = challenge.category || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const challengeDistribution = Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value
    }));

    // Time completion distribution - handle duration in seconds
    const timeRanges = [
      { name: '0-1 min', min: 0, max: 60 },
      { name: '1-2 min', min: 60, max: 120 },
      { name: '2-3 min', min: 120, max: 180 },
      { name: '3-4 min', min: 180, max: 240 },
      { name: '4+ min', min: 240, max: Infinity }
    ];

    const timeCompletionData = timeRanges.map(range => {
      const count = challenges.filter(challenge => {
        const time = challenge.completionTime || 0;
        return time >= range.min && time < range.max;
      }).length;
      return {
        name: range.name,
        value: Math.round((count / challenges.length) * 100)
      };
    });

    // Dashboard stats - Corrected calculations
    const totalParticipants = challenges.reduce((sum, challenge) => sum + (challenge.participantsCount || 0), 0);
    const avgScore = challenges.length > 0 
      ? Math.round(challenges.reduce((sum, challenge) => sum + (challenge.avgScore || 0), 0) / challenges.length)
      : 0;
    const completionRate = challenges.length > 0
      ? Math.round((challenges.filter(c => c.completionRate).length / challenges.length) * 100)
      : 0;
    const avgTime = challenges.length > 0
      ? challenges.reduce((sum, challenge) => sum + (challenge.completionTime || 0), 0) / challenges.length / 60
      : 0;

    const dashboardStats = [
      { title: "Total Participants", value: totalParticipants.toLocaleString(), icon: <FaUsers className="text-3xl" />, color: "bg-blue-500" },
      { title: "Avg. Score", value: `${avgScore}%`, icon: <FaChartLine className="text-3xl" />, color: "bg-green-500" },
      { title: "Completion Rate", value: `${completionRate}%`, icon: <FaTrophy className="text-3xl" />, color: "bg-purple-500" },
      { title: "Avg. Time", value: `${avgTime.toFixed(1)}m`, icon: <FaClock className="text-3xl" />, color: "bg-yellow-500" }
    ];

    return {
      performanceData,
      challengeDistribution,
      timeCompletionData,
      dashboardStats
    };
  };

  const { 
    performanceData = [], 
    challengeDistribution = [], 
    timeCompletionData = [], 
    dashboardStats = [] 
  } = processChartData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-purple-700 to-black text-white items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mb-4"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-purple-700 to-black text-white items-center justify-center">
        <div className="bg-white/10 p-8 rounded-xl max-w-md text-center">
          <h3 className="text-xl font-bold mb-2">Error Loading Data</h3>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              to="/viewChallange" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-400 rounded-lg group-hover:bg-purple-300 transition-colors">
                <FaTrophy className="text-white" />
              </div>
              <span className="font-medium">All Challenges</span>
            </Link>
            <Link 
              to="/SkillChallengeAnalysis" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-700/80 hover:bg-purple-600 transition-all duration-300 group border border-purple-500/50 hover:border-purple-400"
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
          {performanceData.length > 0 ? (
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
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No performance data available
            </div>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Challenge Distribution Pie Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Challenge Types Distribution</h2>
            {challengeDistribution.length > 0 ? (
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
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No challenge type data available
              </div>
            )}
          </div>

          {/* Time Completion Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Completion Time Distribution</h2>
            {timeCompletionData.length > 0 ? (
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
                      formatter={(value) => [`${value}% of challenges`, 'Percentage']}
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
                      name="Percentage of challenges"
                    >
                      {timeCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No completion time data available
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}