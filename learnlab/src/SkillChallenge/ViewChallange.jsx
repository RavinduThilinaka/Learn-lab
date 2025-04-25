import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaClock, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ViewChallenge = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`http://localhost:8080/public/challengeId/${id}`);
        if (!response.ok) throw new Error('Failed to fetch challenge');
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 600)); // Smooth loading delay
        setChallenge(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const formatDuration = (duration) => {
    if (!duration) return "No duration set";
    
    try {
      // Parse ISO 8601 duration format (PTnHnMnS)
      const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
      const matches = duration.match(regex);
      
      if (!matches) return "Invalid duration format";
      
      const hours = matches[1] ? parseInt(matches[1]) : 0;
      const minutes = matches[2] ? parseInt(matches[2]) : 0;
      const seconds = matches[3] ? parseInt(matches[3]) : 0;
      
      const parts = [];
      if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
      if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
      if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
      
      if (parts.length === 0) return "0 seconds";
      
      return parts.join(', ');
    } catch (e) {
      console.error("Error formatting duration:", e);
      return "Invalid duration";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-2 bg-indigo-600 rounded-full flex items-center justify-center">
              <FaCheck className="text-white text-xl" />
            </div>
          </div>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-indigo-800 font-medium text-lg"
          >
            Loading Challenge...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-red-100"
        >
          <div className="bg-red-500 text-white p-3 rounded-xl mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="font-bold text-lg">Error Occurred</h3>
          </div>
          <p className="text-gray-700 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-red-200 transition-all"
            onClick={() => window.location.reload()}
          >
            <FaArrowLeft className="mr-2" />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center border border-yellow-100"
        >
          <div className="bg-yellow-500 text-white p-3 rounded-xl mb-4">
            <h3 className="font-bold text-lg">Challenge Not Found</h3>
          </div>
          <p className="text-gray-700 mb-6">No challenge exists with ID: {id}</p>
          <button 
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-yellow-200 transition-all"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
          {/* Glowing Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <motion.h1 
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    className="text-3xl font-bold mb-1"
                  >
                    Challenge Details
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center text-indigo-200"
                  >
                    <FaClock className="mr-2" />
                    <span>Duration: {formatDuration(challenge.deadLine)}</span>
                  </motion.div>
                </div>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-sm flex items-center"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  ID: {id}
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Question Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-8 border-b border-gray-100"
          >
            <div className="flex items-start">
              <div className="bg-indigo-100 text-indigo-600 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-500 mb-2">QUESTION</h2>
                <p className="text-xl font-medium text-gray-800 leading-relaxed">
                  {challenge.questionText}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Options Section */}
          <div className="p-8">
            <h2 className="text-lg font-semibold text-gray-500 mb-6">OPTIONS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((option) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-5 rounded-xl border transition-all duration-200 ${
                    challenge.correctAnswer === option
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-green-100 shadow-sm'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      challenge.correctAnswer === option
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {option}
                    </span>
                    <p className="text-gray-800 flex-grow">{challenge[`option${option}`]}</p>
                    {challenge.correctAnswer === option && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2 text-green-500 flex-shrink-0"
                      >
                        <FaCheck className="w-5 h-5" />
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Correct Answer Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-50 px-8 py-6 border-t border-gray-200"
          >
            <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-800 p-2 rounded-lg mr-3">
                    <FaCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Correct Answer</h3>
                    <p className="text-sm text-gray-500">The right choice is marked below</p>
                  </div>
                </div>
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  {challenge.correctAnswer}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewChallenge;