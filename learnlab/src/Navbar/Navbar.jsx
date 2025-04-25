import React, { useState } from "react";
import { FiSearch, FiUser, FiShoppingCart, FiLogIn, FiUserPlus } from "react-icons/fi";
import { Link } from 'react-router-dom';


const Navbar = () => {
  const [isHovered, setIsHovered] = useState(null);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 hover:[&>*]:transition-all hover:[&>*]:duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo with Grow Animation */}
          <div 
            className="flex items-center group"
            onMouseEnter={() => setIsHovered("logo")}
            onMouseLeave={() => setIsHovered(null)}
          >
            <h1 className="text-2xl font-bold text-black group-hover:text-purple-600 transition-all duration-300 cursor-pointer transform group-hover:scale-105">
              Skill<span className="text-purple-600">Share</span>
            </h1>
          </div>

          {/* Navigation Links with Underline Animation */}
          <nav className="hidden md:flex space-x-8">
            {['Courses', 'Browse', 'Teach', 'Pricing'].map((item) => (
              <a 
                key={item}
                href="#"
                className="relative text-gray-600 hover:text-purple-700 px-2 py-1 text-sm font-medium transition-colors duration-300 group"
                onMouseEnter={() => setIsHovered(item)}
                onMouseLeave={() => setIsHovered(null)}
              >
                {item}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${isHovered === item ? 'w-full' : 'w-0'}`}></span>
              </a>
            ))}
          </nav>

          {/* Right Side with Interactive Elements */}
          <div className="flex items-center space-x-4">
            
            {/* Search Icon with Pulse Effect */}
            <button 
              className="md:hidden text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-110"
              onMouseEnter={() => setIsHovered("search")}
              onMouseLeave={() => setIsHovered(null)}
            >
              <FiSearch className={`text-xl ${isHovered === "search" ? "animate-pulse" : ""}`} />
            </button>

            {/* Login & Signup Buttons with Bounce */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                className="flex items-center space-x-1 text-gray-600 hover:text-purple-700 transition-all duration-300 hover:translate-y-[-2px]"
                onMouseEnter={() => setIsHovered("login")}
                onMouseLeave={() => setIsHovered(null)}
                to={'/Login'}
                
              >
                <FiLogIn className={`text-lg ${isHovered === "login" ? "animate-bounce" : ""}`} />
                <span className="text-sm font-medium">Login</span>
              </Link>
              <Link 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-1 hover:shadow-lg hover:shadow-purple-200 hover:translate-y-[-2px]"
                onMouseEnter={() => setIsHovered("signup")}
                onMouseLeave={() => setIsHovered(null)}
                to={"/Signup"}
              >
                <FiUserPlus className={isHovered === "signup" ? "animate-bounce" : ""} />
                <span>Sign Up</span>
              </Link>
            </div>

            {/* Shopping Cart with Ring Animation */}
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovered("cart")}
              onMouseLeave={() => setIsHovered(null)}
            >
              <FiShoppingCart className={`text-xl text-gray-600 group-hover:text-purple-600 transition-all duration-300 ${isHovered === "cart" ? "ring-2 ring-purple-400 rounded-full p-1" : ""}`} />
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform group-hover:scale-110 transition-all">
                0
              </span>
            </div>

            {/* User Profile with Spin Effect */}
            <button 
              className="md:hidden text-gray-600 hover:text-purple-600 transition-all duration-300"
              onMouseEnter={() => setIsHovered("user")}
              onMouseLeave={() => setIsHovered(null)}
            >
              <FiUser className={`text-xl ${isHovered === "user" ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;