import { useState, useEffect } from 'react';
import { FaHome, FaPlus, FaCalendarAlt, FaChartLine, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../Images/logo1.png";
import axios from 'axios';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AnalyticsDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('month');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      prepareChartData();
    }
  }, [sessions, timeRange]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/public/getAllSession');
      setSessions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again.');
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = new Date(session.startDate).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    // Convert to array format for charts
    const data = Object.keys(sessionsByDate).map(date => ({
      date,
      sessions: sessionsByDate[date],
    }));

    // Sort by date
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Apply time range filter
    let filteredData = data;
    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
      filteredData = data.filter(item => new Date(item.date) >= cutoffDate);
    } else if (timeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
      filteredData = data.filter(item => new Date(item.date) >= cutoffDate);
    } else if (timeRange === 'year') {
      cutoffDate.setFullYear(now.getFullYear() - 1);
      filteredData = data.filter(item => new Date(item.date) >= cutoffDate);
    }

    setChartData(filteredData);
  };

  const getPopularTimes = () => {
    const timeCounts = {};
    
    sessions.forEach(session => {
      if (session.startTime) {
        const hour = session.startTime.split(':')[0];
        const timeLabel = `${hour}:00 - ${parseInt(hour)+1}:00`;
        
        if (!timeCounts[timeLabel]) {
          timeCounts[timeLabel] = 0;
        }
        timeCounts[timeLabel]++;
      }
    });

    return Object.entries(timeCounts)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const popularTimes = getPopularTimes();

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
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaCalendarAlt className="text-white" />
              </div>
              <span className="font-medium">View Sessions</span>
            </Link>
            <Link 
              to="/AnalyticsDashboard" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/80 hover:bg-purple-700 transition-all duration-300 group border border-purple-500/30 hover:border-purple-400/50"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-400 rounded-lg group-hover:bg-purple-300 transition-colors">
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
              Sessions Analytics
            </h1>
            <p className="text-lg text-gray-600">Visual insights into your learning sessions</p>
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
            <div className="space-y-12">
              {/* Time Range Selector */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => setTimeRange('week')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${timeRange === 'week' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50'}`}
                  >
                    Last Week
                  </button>
                  <button
                    onClick={() => setTimeRange('month')}
                    className={`px-4 py-2 text-sm font-medium ${timeRange === 'month' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50'}`}
                  >
                    Last Month
                  </button>
                  <button
                    onClick={() => setTimeRange('year')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${timeRange === 'year' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50'}`}
                  >
                    Last Year
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-500">Total Sessions</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{sessions.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-500">Sessions This {timeRange === 'week' ? 'Week' : timeRange === 'month' ? 'Month' : 'Year'}</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{chartData.reduce((sum, item) => sum + item.sessions, 0)}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-500">Average Daily Sessions</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {chartData.length > 0 
                      ? (chartData.reduce((sum, item) => sum + item.sessions, 0) / chartData.length).toFixed(1)
                      : '0'}
                  </p>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Sessions Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="sessions"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Sessions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart - Popular Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Most Popular Times</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={popularTimes}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="time" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="count"
                          fill="#8b5cf6"
                          name="Sessions"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Session Distribution */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Session Distribution</h3>
                  <div className="space-y-4">
                    {popularTimes.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-32 text-sm text-gray-600">{item.time}</div>
                        <div className="flex-1">
                          <div className="h-6 bg-purple-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-600 rounded-full" 
                              style={{ width: `${(item.count / Math.max(...popularTimes.map(i => i.count))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-10 text-right text-sm font-medium text-purple-600">
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}