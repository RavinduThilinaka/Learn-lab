import React from 'react';
import { Link } from 'react-router-dom';
import backgroundVideo from '../Video/pv648_qOz94.mp4';

const LearnLabPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 object-cover w-full h-full"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-1"></div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          {/* Aurora Dream Gradient heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent 
                        bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400
                        animate-gradient-x leading-tight">
            Master In-Demand Tech Skills
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto">
            Join Learn Lab's community of tech learners and accelerate your career with our project-based courses
          </p>
          
          {/* CTA Buttons with Aurora Gradient */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/Home" 
              className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500
                         hover:from-purple-600 hover:via-pink-600 hover:to-blue-600
                         rounded-lg text-xl font-semibold text-white 
                         transition-all duration-500 transform hover:scale-105
                         shadow-lg hover:shadow-xl text-center"
            >
              Explore Courses
            </Link>
            <Link 
              to="/Home" 
              className="px-8 py-4 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20
                         hover:from-purple-400/30 hover:via-pink-400/30 hover:to-blue-400/30
                         border-2 border-white/30 hover:border-white/50
                         rounded-lg text-xl font-semibold text-white 
                         transition-all duration-500 transform hover:scale-105 text-center"
            >
              Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Gradient animation styles */}
      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LearnLabPage;