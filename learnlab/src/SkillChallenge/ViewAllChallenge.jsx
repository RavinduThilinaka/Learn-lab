import { FaHome, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaUsers, FaChartLine, FaTrophy, FaClock, FaPlus, FaEdit, FaTrash, FaSearch, FaSort, FaSortUp, FaSortDown, FaEye } from "react-icons/fa";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Logo from "../Images/logo1.png";
import { useState, useEffect } from "react";

export default function ViewAllChallenge() {
  // Sample data for the stats cards
  const dashboardStats = [
    { title: "Total Challenges", value: "142", icon: <FaTrophy className="text-3xl" />, color: "bg-blue-500" },
    { title: "Active Challenges", value: "24", icon: <FaClock className="text-3xl" />, color: "bg-purple-500" },
    { title: "Avg. Participation", value: "78%", icon: <FaUsers className="text-3xl" />, color: "bg-green-500" },
    { title: "Avg. Score", value: "4.2/5", icon: <FaChartLine className="text-3xl" />, color: "bg-yellow-500" }
  ];

  // State for challenges data
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 8;

  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('http://localhost:8080/public/allChallenge');
        if (!response.ok) {
          throw new Error('Failed to fetch challenges');
        }
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

  // Handle sort
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sort challenges
  const sortedChallenges = [...challenges].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Filter challenges by search term
  const filteredChallenges = sortedChallenges.filter(challenge => 
    challenge.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.id.toString().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastChallenge = currentPage * challengesPerPage;
  const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage;
  const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge);
  const totalPages = Math.ceil(filteredChallenges.length / challengesPerPage);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      try {
        const response = await fetch(`http://localhost:8080/public/deleteChallenge/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete challenge');
        }
        
        setChallenges(challenges.filter(challenge => challenge.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Format deadline from PT##M to minutes
  const formatDeadline = (deadline) => {
    if (!deadline) return "N/A";
    return deadline.replace('PT', '').replace('M', '') + ' mins';
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-30" />;
    return sortConfig.direction === "ascending" ? 
      <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

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
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors">
                <FaPlus className="text-white" />
              </div>
              <span className="font-medium">Create Challenge</span>
            </Link>
           
            <Link 
              to="/viewChallange" 
              className="flex items-center gap-3 p-4 rounded-xl bg-purple-700/80 hover:bg-purple-600 transition-all duration-300 group border border-purple-500/50 hover:border-purple-400"
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
            All Challenges
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage all skill challenges in the system
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

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link 
            to="/SkillChallenge"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl text-white hover:from-purple-700 hover:to-purple-900 transition-all duration-500 font-bold shadow-lg hover:shadow-purple-500/30 whitespace-nowrap"
          >
            <FaPlus /> Create New
          </Link>
        </div>

        {/* Challenges Table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-lg text-gray-600">Loading challenges...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl m-6">
              Error: {error}
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="p-12 text-center">
              <FaTrophy className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">No challenges found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or create a new challenge</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={() => requestSort("id")}
                      >
                        <div className="flex items-center">
                          ID
                          {getSortIcon("id")}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={() => requestSort("questionText")}
                      >
                        <div className="flex items-center">
                          Question
                          {getSortIcon("questionText")}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={() => requestSort("deadLine")}
                      >
                        <div className="flex items-center">
                          Time Limit
                          {getSortIcon("deadLine")}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Correct Answer
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentChallenges.map((challenge) => (
                      <tr key={challenge.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {challenge.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {challenge.questionText}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDeadline(challenge.deadLine)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Option {challenge.correctAnswer}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/collectionview/${challenge.id}`}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="View"
                            >
                              <FaEye />
                            </Link>
                            <Link
                              to={`/updateChallange/${challenge.id}`}
                              className="text-purple-600 hover:text-purple-900 transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(challenge.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstChallenge + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastChallenge, filteredChallenges.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredChallenges.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">First</span>
                          «
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          ‹
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'bg-purple-600 border-purple-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          ›
                        </button>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Last</span>
                          »
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}