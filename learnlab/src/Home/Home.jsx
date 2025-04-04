import { useState, useEffect } from "react";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import class1Image from '../Images/b1.jpg'; // Adjust the path as needed
import class2Image from '../Images/b2.jpg';
import class3Image from '../Images/b3.jpg';
import instructor1Image from '../Images/background3.jpeg';
import instructor2Image from '../Images/background3.jpeg';
import teamImage from '../Images/background2.jpeg';
import { FaCamera, FaNewspaper, FaBlog, FaHandshake, FaGift, FaChalkboardTeacher, FaMobileAlt, FaApple, FaGooglePlay } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';




import { faFacebookF, faTwitter, faLinkedinIn, faInstagram, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons';




export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [class1Image, class2Image, class3Image];

  // Function to handle next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Auto-slide effect using useEffect
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 3000); // Change image every 3 seconds

    // Cleanup interval when component is unmounted
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="w-full min-h-screen bg-gray-100">
       <header className="sticky top-0 z-50 w-full bg-white shadow-md p-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold text-black hover:text-yellow-500 transition-colors duration-300 cursor-pointer">
          Skillshare
        </h1>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-6">
          {/* Search Icon */}
          <div className="relative group">
            <FaSearch className="text-gray-600 text-xl cursor-pointer group-hover:text-yellow-500 transition-colors duration-300" />
            <span className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              
            </span>
          </div>

          {/* User Icon */}
          <div className="relative group">
            <FaUser className="text-gray-600 text-xl cursor-pointer group-hover:text-yellow-500 transition-colors duration-300" />
            <span className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             
            </span>
          </div>

          {/* Cart Icon */}
          <div className="relative group">
            <FaShoppingCart className="text-gray-600 text-xl cursor-pointer group-hover:text-yellow-500 transition-colors duration-300" />
            <span className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             
            </span>
          </div>

          {/* Start Free Trial Button */}
          <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition-colors duration-300">
            Start Free Trial
          </button>
        </div>
      </div>
    </header>

      <section
  className="relative w-full h-[500px] flex items-center justify-center bg-cover bg-center"
  style={{ backgroundImage: `url(${images[currentIndex]})` }} // Set background to current image
>
  <div className="absolute inset-0 bg-black opacity-50" /> {/* Add overlay for better contrast */}

  <div className="relative text-center text-white px-6">
    <h2 className="text-5xl font-bold animate-fadeInSlide">
      Unlock Your Creativity with <span className="text-yellow-500">Skillshare</span>
    </h2>
    <p className="mt-4 text-lg animate-fadeInSlide animation-delay-2s">
      Learn from thousands of inspiring classes to enhance your skills.
    </p>
    <div className="mt-6 flex gap-4 justify-center">
      <button className="bg-white text-black px-6 py-2 rounded animate-fadeInSlide animation-delay-3s">Browse Classes</button>
      <button className="bg-yellow-500 text-white px-6 py-2 rounded animate-fadeInSlide animation-delay-4s">Get Started</button>
    </div>
  </div>
</section>

<style jsx>
  {`
    /* Keyframes for fade-in and slide-up effect */
    @keyframes fadeInSlide {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Apply the animation */
    .animate-fadeInSlide {
      animation: fadeInSlide 1s ease-out forwards;
    }

    /* Add delay for different elements */
    .animation-delay-2s {
      animation-delay: 2s;
    }

    .animation-delay-3s {
      animation-delay: 3s;
    }

    .animation-delay-4s {
      animation-delay: 4s;
    }
  `}
</style>



      {/* Featured Section */}
      <section className="p-8 text-center">
        <h2 className="text-3xl font-bold">Explore Popular <span className="text-green-500">Creative Courses</span></h2>
        <div className="mt-6 flex justify-center gap-6">
          <img src={instructor1Image} className="w-60 h-60 rounded-lg shadow-lg" alt="Instructor" />
          <img src={instructor2Image} className="w-60 h-60 rounded-lg shadow-lg" alt="Instructor" />
        </div>
      </section>

      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white flex flex-col md:flex-row items-center justify-between px-10 py-16">
  {/* Left Content */}
  <div className="md:w-1/2 space-y-6">
    <h2 className="text-3xl md:text-4xl font-bold">Skillshare for Teams</h2>
    <p className="text-lg text-gray-300">
      Set your team up for success with reimagined learning to empower their personal and professional growth.
    </p>
    <p className="text-lg text-gray-300">
      With inspiring classes on soft skills, business essentials, well-being and more, your whole team will have deep knowledge and expertise at their fingertips.
    </p>
    <button className="bg-white text-black font-semibold px-6 py-2 rounded-md hover:bg-gray-200">Learn More</button>
  </div>

  {/* Right Image */}
  <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
    <img
      src={teamImage}
      alt="Team Learning"
      className="rounded-lg shadow-lg w-full max-w-md"
    />
  </div>
</div>

      {/* Class Showcase */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-center">Top Trending <span className="text-green-500">Classes</span></h2>
        <div className="mt-6 flex gap-4 overflow-x-scroll p-4">
          {images.map((img, index) => (
            <div key={index} className="relative w-60 h-80 rounded-lg shadow-lg overflow-hidden">
              <img src={img} alt={`Class ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    {/* Footer */}
<footer className="bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-12">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-purple-300">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="#home" className="hover:text-purple-300 transition duration-300 ease-in-out">Home</a></li>
          <li><a href="#services" className="hover:text-purple-300 transition duration-300 ease-in-out">Services</a></li>
          <li><a href="#about" className="hover:text-purple-300 transition duration-300 ease-in-out">About Us</a></li>
          <li><a href="#contact" className="hover:text-purple-300 transition duration-300 ease-in-out">Contact</a></li>
        </ul>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-purple-300">Contact Us</h3>
        <ul className="space-y-2">
          <li><FontAwesomeIcon icon={faPhoneAlt} className="mr-2" /> +1 (123) 456-7890</li>
          <li><FontAwesomeIcon icon={faEnvelope} className="mr-2" /> info@skillshare.com</li>
          <li>123 Skillshare St.</li>
          <li>City, State, ZIP</li>
        </ul>
      </div>

      {/* Social Media Links */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-purple-300">Follow Us</h3>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
              <FontAwesomeIcon icon={faFacebookF} className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
              <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
              <FontAwesomeIcon icon={faLinkedinIn} className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
              <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
              <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-purple-300 transition duration-300 ease-in-out">
              <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
            </a>
          </li>
        </ul>
      </div>

      {/* Newsletter Subscription */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-purple-300">Subscribe</h3>
        <p className="mb-4">Stay updated with the latest classes, offers, and news from Skillshare.</p>
        <form className="flex">
          <input
            type="email"
            placeholder="Your email"
            className="p-2 rounded-l-lg focus:outline-none text-black"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700 transition duration-300 ease-in-out"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>

    {/* Copyright Notice */}
    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
      <p>&copy; 2025 Skillshare. All rights reserved.</p>
    </div>
  </div>
</footer>


    </div>
  );
}
