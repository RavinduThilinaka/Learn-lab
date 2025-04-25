import { useState, useEffect, useRef } from "react";
import { FaSearch, FaRobot , FaShoppingCart, FaCalendarAlt, FaClock, FaPlay, FaTimes, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaInfinity, FaChalkboardTeacher, FaStar, FaRegStar, FaStarHalfAlt,FaComment  } from "react-icons/fa";
import class1Image from '../Images/b1.jpg';
import class2Image from '../Images/b2.jpg';
import class3Image from '../Images/b3.jpg';
import instructor1Image from '../Images/background3.jpeg';
import instructor2Image from '../Images/f3.jpeg';
import instructor3Image from '../Images/f1.jpeg';
import instructor4Image from '../Images/f2.jpeg';
import aboutImage from "../Images/About.jpeg";
import teamImage from '../Images/background2.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const videoRef = useRef(null);

  const images = [class1Image, class2Image, class3Image];

  // Fetch sessions data
  useEffect(() => {
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

    fetchSessions();
  }, []);

  // Fetch feedbacks data
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/public/allFeedback');
        // Make sure the response data is an array
        const feedbackData = Array.isArray(response.data) ? response.data : [];
        setFeedbacks(feedbackData);
        setFeedbackLoading(false);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setFeedbackError('Failed to load feedbacks. Please try again.');
        setFeedbackLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

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

  // Play video when modal opens
  useEffect(() => {
    if (showModal && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video play failed:", error);
      });
    }
  }, [showModal]);

  const isSessionActive = (session) => {
    const now = new Date();
    const today = new Date(now.toISOString().split('T')[0]);
    const sessionDate = new Date(session.startDate);
    
    // Check if it's the same day
    if (today.getTime() !== sessionDate.getTime()) {
      return false;
    }
    
    // Parse start and end times
    const [startHours, startMinutes] = session.startTime.split(':').map(Number);
    const startTime = new Date(sessionDate);
    startTime.setHours(startHours, startMinutes, 0, 0);
    
    let endTime;
    if (session.endTime) {
      const [endHours, endMinutes] = session.endTime.split(':').map(Number);
      endTime = new Date(sessionDate);
      endTime.setHours(endHours, endMinutes, 0, 0);
    } else {
      // Default to 1 hour duration if no end time is specified
      endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);
    }
    
    return now >= startTime && now <= endTime;
  };

  const handleJoinSession = (session) => {
    if (isSessionActive(session)) {
      setSelectedSession(session);
      setShowModal(true);
      setModalError('');
    } else {
      const sessionDate = new Date(session.startDate);
      const [startHours, startMinutes] = session.startTime.split(':').map(Number);
      const startTime = new Date(sessionDate);
      startTime.setHours(startHours, startMinutes, 0, 0);
      
      let endTime;
      if (session.endTime) {
        const [endHours, endMinutes] = session.endTime.split(':').map(Number);
        endTime = new Date(sessionDate);
        endTime.setHours(endHours, endMinutes, 0, 0);
      } else {
        endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);
      }
      
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      setModalError(`This session is only available between ${startTime.toLocaleString('en-US', options)} and ${endTime.toLocaleString('en-US', options)}`);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setShowModal(false);
    setSelectedSession(null);
    setModalError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
     
      console.log('Form submitted:', formData);
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }
  };

 
  const renderStars = (rating) => {
    const stars = [];
   
    const numericRating = typeof rating === 'number' ? rating : 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
        <Navbar/>
      <section
        className="relative w-full h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />

        <div className="relative text-center text-white px-6">
          <h2 className="text-5xl font-bold animate-fadeInSlide">
            Unlock Your Creativity with <span className="text-yellow-500">Skillshare</span>
          </h2>
          <p className="mt-4 text-lg animate-fadeInSlide animation-delay-2s">
            Learn from thousands of inspiring classes to enhance your skills.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
          <Link 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg animate-fadeInSlide animation-delay-3s shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:bg-indigo-700"
            aria-label="AI Chat Assistant"
            to={"/bot"}
          >
          <FaRobot className="h-5 w-5" />
          <span>AI Assistant</span>
        </Link>
            <button className="bg-yellow-500 text-white px-6 py-2 rounded animate-fadeInSlide animation-delay-4s">Get Started</button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image Side */}
          <div>
            <img
              src={aboutImage}
              alt="About SkillShare"
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
          </div>

          {/* Text Side */}
          <div>
            <h2 className="text-4xl font-bold mb-4">
              About <span className="text-purple-600">SkillShare</span>
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              SkillShare is an online learning community where millions come together to take 
              the next step in their creative journey. With thousands of inspiring classes taught 
              by industry experts, learners explore topics like design, business, photography, tech, 
              and more.
            </p>
            <p className="text-gray-700 text-lg">
              Whether you're a beginner or a seasoned professional, SkillShare empowers you to learn 
              at your own pace, connect with a passionate community, and build skills that matter.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Section */}
      <section className="p-8 text-center">
        <h2 className="text-3xl font-bold">Explore Popular <span className="text-purple-600">Creative Courses</span></h2>
        <div className="mt-6 flex justify-center gap-6">
          <img src={instructor1Image} className="w-60 h-60 rounded-lg shadow-lg" alt="Instructor" />
          <img src={instructor2Image} className="w-60 h-60 rounded-lg shadow-lg" alt="Instructor" />
          <img src={instructor3Image} className="w-60 h-60 rounded-lg shadow-lg" alt="Instructor" />
          <img src={instructor4Image} className="w-60 h-60 rounded-lg shadow-lg" alt="Instructor" />
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            SkillShare <span className="text-purple-600">Smart Learning Benefits</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            The way we learn is evolving—students and professionals alike are seeking flexible, 
            high-quality learning experiences that empower them to grow at their own pace, anywhere, anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
              <FaChalkboardTeacher className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Expert-Led Classes</h3>
            <p className="text-gray-600 text-center">
              Learn from industry professionals who bring real-world experience and insight to every lesson.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
              <FaClock className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Learn on Your Schedule</h3>
            <p className="text-gray-600 text-center">
              Enjoy the freedom to learn anytime, fitting courses into your routine whenever it works for you.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
              <FaInfinity className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Unlimited Access</h3>
            <p className="text-gray-600 text-center">
              Explore an unlimited library of classes with a single membership—no limits on learning.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-3xl mx-auto">
            Whether you're here to upskill, change careers, or explore a new passion, 
            SkillShare offers the tools and community support to help you succeed—your way.
          </p>
        </div>
      </section>

      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white flex flex-col md:flex-row items-center justify-between px-10 py-16">
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

        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img
            src={teamImage}
            alt="Team Learning"
            className="rounded-lg shadow-lg w-full max-w-md"
          />
        </div>
      </div>

      {/* Learning Sessions Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Upcoming <span className="text-purple-600">Learning Sessions</span>
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded text-center">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {session.videoUrl ? (
                  <div className="relative pt-[56.25%] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer" onClick={() => handleJoinSession(session)}>
                      <video className="absolute inset-0 w-full h-full object-cover opacity-70">
                        <source src={session.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="relative z-10 text-white text-4xl bg-black bg-opacity-50 rounded-full p-4">
                        <FaPlay />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-500">
                    <FaPlay className="text-4xl" />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{session.sessionTitle}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{session.description || 'No description available'}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-purple-600" />
                      <span>{new Date(session.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-purple-600" />
                      <span>
                        {session.startTime} - {session.endTime || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleJoinSession(session)}
                    className={`mt-6 w-full py-2 rounded-lg transition-colors ${
                      isSessionActive(session) 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                    disabled={!isSessionActive(session)}
                  >
                    {isSessionActive(session) ? 'Join Session' : 'Session Not Active'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Advanced Contact Us Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact <span className="text-purple-600">Us</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? Reach out to us and our team will get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send us a message</h3>
              
              {formSubmitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Thank you for your message! We'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
                      }`}
                      placeholder="Your name"
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.subject ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
                      }`}
                      placeholder="What's this about?"
                    />
                    {formErrors.subject && <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.message ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
                      }`}
                      placeholder="Your message here..."
                    ></textarea>
                    {formErrors.message && <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition duration-300 flex items-center justify-center"
                  >
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information and Map */}
            <div className="space-y-8">
              <div className="bg-gray-50 p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <FaMapMarkerAlt className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">Our Location</h4>
                      <p className="text-gray-600">123 Skillshare Street, Creative District, New York, NY 10001, USA</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <FaPhone className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">Phone Number</h4>
                      <p className="text-gray-600">+1 (123) 456-7890</p>
                      <p className="text-gray-600">+1 (987) 654-3210 (Support)</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <FaEnvelope className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">Email Address</h4>
                      <p className="text-gray-600">info@skillshare.com</p>
                      <p className="text-gray-600">support@skillshare.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="h-80 rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291234!2d-73.98784492427496!3d40.74844047138949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1623251157755!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Our Location"
                ></iframe>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-50 p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Business Hours</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback and Ratings Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our <span className="text-purple-600">Students Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from our community of learners about their experiences with SkillShare.
            </p>
          </div>

          {feedbackLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : feedbackError ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded text-center">
              <p>{feedbackError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {feedbacks.map((feedback) => {
               
                const userName = feedback.userName || feedback.user?.name || 'Anonymous User';
                const userInitial = userName.charAt(0).toUpperCase();
                const comment = feedback.comment || feedback.feedbackText || 'No comment provided';
                const rating = typeof feedback.rating === 'number' ? feedback.rating : 0;
                const ratingDisplay = typeof feedback.rating === 'number' ? rating.toFixed(1) : '0.0';
                const createdAt = feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'Unknown date';

                return (
                  <div key={feedback.id || Math.random()} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                          {userInitial}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {userName}
                          </h4>
                          <div className="flex items-center mt-1">
                            {renderStars(rating)}
                            <span className="ml-2 text-sm text-gray-600">
                              {ratingDisplay}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mb-4">
                        "{comment}"
                      </p>
                      <div className="text-sm text-gray-500">
                        <FaCalendarAlt className="inline mr-1" />
                        {createdAt}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-100 transition-all"
            >
              <FaTimes className="text-xl" />
            </button>
            
            {modalError ? (
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-red-600 mb-4">Session Not Available</h3>
                <p className="text-gray-700 mb-6">{modalError}</p>
                <button 
                  onClick={closeModal}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="relative pt-[56.25%]">
                  <video 
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full"
                    controls
                    autoPlay
                    playsInline
                    muted
                  >
                    <source src={selectedSession?.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedSession?.sessionTitle}</h3>
                  <p className="text-gray-600 mb-4">{selectedSession?.description || 'No description available'}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-purple-600" />
                      <span>{selectedSession && new Date(selectedSession.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-purple-600" />
                      <span>
                        {selectedSession?.startTime} - {selectedSession?.endTime || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

     {/* Footer */}
     <footer className="bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-purple-300 transition duration-300 ease-in-out">Home</a></li>
                <li><a href="#services" className="hover:text-purple-300 transition duration-300 ease-in-out">Services</a></li>
                <li><a href="#about" className="hover:text-purple-300 transition duration-300 ease-in-out">About Us</a></li>
                <li><a href="#contact" className="hover:text-purple-300 transition duration-300 ease-in-out">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-300">Contact Us</h3>
              <ul className="space-y-2">
                <li><FontAwesomeIcon icon={faPhoneAlt} className="mr-2" /> +1 (123) 456-7890</li>
                <li><FontAwesomeIcon icon={faEnvelope} className="mr-2" /> info@skillshare.com</li>
                <li>123 Skillshare St.</li>
                <li>City, State, ZIP</li>
              </ul>
            </div>

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

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Skillshare. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>
        {`
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

          .animate-fadeInSlide {
            animation: fadeInSlide 1s ease-out forwards;
          }

          .animation-delay-2s {
            animation-delay: 2s;
          }

          .animation-delay-3s {
            animation-delay: 3s;
          }

          .animation-delay-4s {
            animation-delay: 4s;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
}