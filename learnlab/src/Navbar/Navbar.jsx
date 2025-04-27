import React, { useState, useEffect } from "react";
import { FiSearch, FiUser, FiShoppingCart, FiLogIn, FiUserPlus, FiLogOut, FiHome, FiInfo, FiMail } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [logoutState, setLogoutState] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    setLogoutState('processing');
    
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      
      setLogoutState('success');
      
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }, 1800);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Get the navbar height to offset the scroll position
      const navbarHeight = document.querySelector('header').offsetHeight;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Full-screen Logout Experience */}
      <AnimatePresence>
        {logoutState && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{
              background: logoutState === 'processing' 
                ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
            }}
          >
            {logoutState === 'processing' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="mx-auto h-24 w-24 rounded-full border-4 border-white border-opacity-20 border-t-white mb-8"
                />
                
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-white mb-3"
                >
                  Securing Your Account
                </motion.h3>
                
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white text-opacity-80 mb-8 max-w-md px-4"
                >
                  We're securely ending your session and clearing all authentication tokens
                </motion.p>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 1.8 }}
                  className="mx-auto h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden"
                >
                  <div className="h-full bg-white rounded-full" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mx-auto h-24 w-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-8"
                >
                  <svg
                    className="h-12 w-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-white mb-3"
                >
                  You're Signed Out
                </motion.h3>
                
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white text-opacity-80 mb-8"
                >
                  Your session has been securely terminated
                </motion.p>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 1.2 }}
                  className="mx-auto h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden"
                >
                  <div className="h-full bg-white rounded-full" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center group">
              <Link to="/" className="text-2xl font-bold text-black group-hover:text-purple-600 transition-all duration-300">
                Skill<span className="text-purple-600">Share</span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              {/* Home Link */}
              <button
                onClick={() => scrollToSection('home')}
                className="relative text-gray-600 hover:text-purple-700 px-2 py-1 text-lg font-medium transition-colors duration-300 group flex items-center"
                onMouseEnter={() => setIsHovered('Home')}
                onMouseLeave={() => setIsHovered(null)}
              >
                <FiHome className="mr-1" />
                Home
                <span className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${
                  isHovered === 'Home' ? 'w-full' : 'w-0'
                }`} />
              </button>

              {/* About Link */}
              <button
                onClick={() => scrollToSection('about')}
                className="relative text-gray-600 hover:text-purple-700 px-2 py-1 text-lg font-medium transition-colors duration-300 group flex items-center"
                onMouseEnter={() => setIsHovered('About')}
                onMouseLeave={() => setIsHovered(null)}
              >
                <FiInfo className="mr-1" />
                About
                <span className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${
                  isHovered === 'About' ? 'w-full' : 'w-0'
                }`} />
              </button>

              {/* Contact Link */}
              <button
                onClick={() => scrollToSection('contact')}
                className="relative text-gray-600 hover:text-purple-700 px-2 py-1 text-lg font-medium transition-colors duration-300 group flex items-center"
                onMouseEnter={() => setIsHovered('Contact')}
                onMouseLeave={() => setIsHovered(null)}
              >
                <FiMail className="mr-1" />
                Contact
                <span className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${
                  isHovered === 'Contact' ? 'w-full' : 'w-0'
                }`} />
              </button>

              {/* Other Navigation Links */}
              {['Category', 'Quiz'].map((item) => {
                let path = '/';
                if (item === 'Category') {
                  path = '/CategoryCardsPage'; 
                } else if (item === 'Quiz') {
                  path = '/qizeintro';
                }

                return (
                  <Link 
                    key={item}
                    to={path}
                    className="relative text-gray-600 hover:text-purple-700 px-2 py-1 text-lg font-medium transition-colors duration-300 group"
                    onMouseEnter={() => setIsHovered(item)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    {item}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${
                      isHovered === item ? 'w-full' : 'w-0'
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              
              {/* Search Icon */}
              <button className="md:hidden text-gray-600 hover:text-purple-600 transition-all duration-300">
                <FiSearch className="text-xl" />
              </button>

              {/* Conditional Render - Login/Signup or User Profile */}
              {!userName ? (
                <div className="hidden md:flex items-center space-x-3">
                  <Link 
                    to="/login"
                    className="flex items-center space-x-1 text-gray-600 hover:text-purple-700 transition-all duration-300"
                  >
                    <FiLogIn className="text-lg" />
                    <span className="text-sm font-medium">Login</span>
                  </Link>
                  <Link 
                    to="/signup"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-1 hover:shadow-lg"
                  >
                    <FiUserPlus />
                    <span>Sign Up</span>
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    disabled={logoutState}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700">{userName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                    >
                      <Link 
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="mr-2" />
                        My Profile
                      </Link>
                      <Link 
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center transition-colors duration-200"
                      >
                        <FiLogOut className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Shopping Cart */}
              <div className="relative group cursor-pointer">
                <FiShoppingCart className="text-xl text-gray-600 group-hover:text-purple-600 transition-all duration-300" />
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;