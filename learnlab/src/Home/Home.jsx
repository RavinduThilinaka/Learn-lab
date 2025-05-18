import { useState, useEffect, useRef } from "react";
import { FaSearch, FaRobot, FaShoppingCart, FaCalendarAlt, FaClock, FaPlay, FaTimes, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaInfinity, FaChalkboardTeacher, FaStar, FaRegStar, FaStarHalfAlt, FaComment, FaMoon, FaSun } from "react-icons/fa";
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
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  
  // Refs for scroll animations
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const teamRef = useRef(null);
  const sessionsRef = useRef(null);
  const contactRef = useRef(null);
  const testimonialsRef = useRef(null);
  
  // State for scroll animations
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [isTeamVisible, setIsTeamVisible] = useState(false);
  const [isSessionsVisible, setIsSessionsVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isTestimonialsVisible, setIsTestimonialsVisible] = useState(false);

  const images = [class1Image, class2Image, class3Image];

  // Intersection Observer setup for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.target === heroRef.current) {
          setIsHeroVisible(entry.isIntersecting);
        } else if (entry.target === aboutRef.current) {
          setIsAboutVisible(entry.isIntersecting);
        } else if (entry.target === featuresRef.current) {
          setIsFeaturesVisible(entry.isIntersecting);
        } else if (entry.target === teamRef.current) {
          setIsTeamVisible(entry.isIntersecting);
        } else if (entry.target === sessionsRef.current) {
          setIsSessionsVisible(entry.isIntersecting);
        } else if (entry.target === contactRef.current) {
          setIsContactVisible(entry.isIntersecting);
        } else if (entry.target === testimonialsRef.current) {
          setIsTestimonialsVisible(entry.isIntersecting);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (heroRef.current) observer.observe(heroRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (teamRef.current) observer.observe(teamRef.current);
    if (sessionsRef.current) observer.observe(sessionsRef.current);
    if (contactRef.current) observer.observe(contactRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

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
        const feedbackData = Array.isArray(response.data) ? response.data : [];
        // Ensure we have the correct data structure
        const formattedFeedbacks = feedbackData.map(feedback => ({
          id: feedback.id,
          userName: feedback.userName || feedback.user?.name || 'Anonymous User',
          comment: feedback.comment || feedback.feedbackText || 'No comment provided',
          rating: typeof feedback.rating === 'number' ? feedback.rating : 0,
          createdAt: feedback.createdAt
        }));
        setFeedbacks(formattedFeedbacks);
        setFeedbackLoading(false);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setFeedbackError('Failed to load feedbacks. Please try again.');
        setFeedbackLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Auto-slide effect with enhanced animation
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

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
    
    if (today.getTime() !== sessionDate.getTime()) {
      return false;
    }
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post('http://localhost:8080/public/addContact', {
          name: formData.name,
          email: formData.email,
          mobile: formData.phone ? parseInt(formData.phone.replace(/\D/g, '')) : null,
          subject: formData.subject,
          message: formData.message
        });

        if (response.status === 200) {
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
      } catch (error) {
        console.error('Error submitting contact form:', error);
        setFormErrors({ submit: 'Failed to submit form. Please try again.' });
      }
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

  // Format time to display only hours and minutes
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  // Add dark mode toggle handler
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`w-full min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <Navbar/>
      
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors duration-300"
      >
        {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
      </button>
      
      {/* Hero Section with Advanced Design */}
      <section
        id="home"
        ref={heroRef}
        className={`relative w-full h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          isHeroVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Background Video/Image with Parallax */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-1000"
          style={{ 
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${isHeroVisible ? 1.1 : 1})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        {/* Animated Particles Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className={`relative z-10 text-center px-6 max-w-6xl mx-auto transform transition-all duration-1000 ${
          isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Animated Badge */}
          <div className="inline-block mb-6 animate-bounce-slow">
            <span className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-500/30">
              Welcome to SkillShare
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient-x">
              Unlock Your
            </span>
            <span className="block text-white mt-2">
              Creative <span className="text-yellow-400">Potential</span>
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners worldwide and transform your skills with our expert-led courses.
          </p>

          {/* CTA Buttons with Hover Effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to={"/bot"}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaRobot className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span>AI Assistant</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <button className="group relative px-8 py-4 bg-transparent border-2 border-white rounded-full text-white font-medium overflow-hidden transition-all duration-300 hover:bg-white hover:text-black">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </button>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '10K+', label: 'Active Students' },
              { number: '500+', label: 'Expert Instructors' },
              { number: '1000+', label: 'Online Courses' },
              { number: '50+', label: 'Countries' }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`text-center transform transition-all duration-1000 ${
                  isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </section>

      {/* About Section with Slide-up Animation */}
      <section 
        id="about"
        ref={aboutRef}
        className={`py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-1000 ${
          isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className={`transition-all duration-700 delay-150 ${
            isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <img
              src={aboutImage}
              alt="About SkillShare"
              className="rounded-xl md:rounded-2xl shadow-lg md:shadow-xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className={`transition-all duration-700 delay-300 ${
            isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              About <span className="text-purple-600">SkillShare</span>
            </h2>
            <p className="text-gray-700 text-base md:text-lg mb-4 md:mb-6">
              SkillShare is an online learning community where millions come together to take 
              the next step in their creative journey. With thousands of inspiring classes taught 
              by industry experts, learners explore topics like design, business, photography, tech, 
              and more.
            </p>
            <p className="text-gray-700 text-base md:text-lg">
              Whether you're a beginner or a seasoned professional, SkillShare empowers you to learn 
              at your own pace, connect with a passionate community, and build skills that matter.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Courses with Fade-in and Staggered Animation */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 text-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-7xl mx-auto transition-all duration-1000 ${
          isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <h2 className="text-3xl font-bold mb-12">
            Explore Popular <span className="text-purple-600">Creative Courses</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[instructor1Image, instructor2Image, instructor3Image, instructor4Image].map((img, index) => (
              <div 
                key={index}
                className={`w-60 h-60 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                  isAboutVisible ? `opacity-100 translate-y-0 delay-${index * 100}` : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <img 
                  src={img} 
                  alt={`Instructor ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Card Flip Animation */}
      <section 
        ref={featuresRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 ${
          isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">
              SkillShare <span className="text-purple-600">Smart Learning Benefits</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              The way we learn is evolving—students and professionals alike are seeking flexible, 
              high-quality learning experiences that empower them to grow at their own pace, anywhere, anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaChalkboardTeacher className="text-purple-600 text-2xl" />,
                title: "Expert-Led Classes",
                desc: "Learn from industry professionals who bring real-world experience and insight to every lesson."
              },
              {
                icon: <FaClock className="text-purple-600 text-2xl" />,
                title: "Learn on Your Schedule",
                desc: "Enjoy the freedom to learn anytime, fitting courses into your routine whenever it works for you."
              },
              {
                icon: <FaInfinity className="text-purple-600 text-2xl" />,
                title: "Unlimited Access",
                desc: "Explore an unlimited library of classes with a single membership—no limits on learning."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${
                  isFeaturesVisible ? `opacity-100 translate-y-0 delay-${index * 100}` : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-center mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Parallax Effect */}
      <section 
        ref={teamRef}
        className={`relative py-28 px-4 sm:px-6 lg:px-8 text-white bg-fixed bg-cover bg-center ${
          isDarkMode ? 'bg-gray-900' : ''
        }`}
        style={{ backgroundImage: `url(${teamImage})` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-purple-900/90 to-black/90 transition-opacity duration-1000 ${
          isTeamVisible ? 'opacity-90' : 'opacity-0'
        }`} />
        <div className={`relative max-w-7xl mx-auto transition-all duration-1000 ${
          isTeamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 space-y-6 mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold">Skillshare for Teams</h2>
              <p className="text-lg text-gray-300">
                Set your team up for success with reimagined learning to empower their personal and professional growth.
              </p>
              <p className="text-lg text-gray-300">
                With inspiring classes on soft skills, business essentials, well-being and more, your whole team will have deep knowledge and expertise at their fingertips.
              </p>
              <button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition-all duration-300">
                Learn More
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className={`bg-white p-4 rounded-xl shadow-2xl transform transition-all duration-700 ${
                isTeamVisible ? 'rotate-0 scale-100' : 'rotate-12 scale-90'
              }`}>
                <img
                  src={teamImage}
                  alt="Team Learning"
                  className="rounded-lg w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Sessions Section with Staggered Card Animations */}
      <section 
        ref={sessionsRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 ${
          isSessionsVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Upcoming <span className="text-purple-600">Learning Sessions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our interactive learning experiences designed to expand your knowledge and skills.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
              <span className="ml-3 text-gray-700">Loading sessions...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-medium text-red-800 mb-2">Error loading sessions</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 ${
                    isSessionsVisible ? `opacity-100 translate-y-0 delay-${index * 100}` : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  <div className="relative">
                    {session.videoBase64 ? (
                      <div className="relative pt-[56.25%] overflow-hidden">
                        <video
                          className="absolute inset-0 w-full h-full object-cover"
                          controls
                          poster={session.thumbnailUrl}
                          src={`data:video/mp4;base64,${session.videoBase64}`}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-purple-400 to-indigo-500 h-48 flex items-center justify-center">
                        <div className="bg-white bg-opacity-20 p-4 rounded-full">
                          <FaPlay className="text-4xl text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {session.category || 'Workshop'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{session.sessionTitle}</h3>
                    <p className="text-gray-700 mb-4 line-clamp-2">{session.description}</p>
                    
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          <strong>Date:</strong> {new Date(session.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          <strong>Time:</strong> {formatTime(session.endTime) || 'N/A'}
                        </span>
                      </div>
                      {session.instructor && (
                        <div className="flex items-center">
                          <FaChalkboardTeacher className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            <strong>Instructor:</strong> {session.instructor}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-lg font-bold text-purple-600">
                        {session.price ? `$${session.price}` : 'FREE'}
                      </span>
                      <button 
                        onClick={() => handleJoinSession(session)}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                      >
                        Join Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && !error && (
            <div className="mt-16 text-center">
              <button className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors">
                View All Learning Sessions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section with 3D Flip Effect */}
      <section 
        ref={testimonialsRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 ${
          isTestimonialsVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center mb-16">
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
              {feedbacks.map((feedback, index) => {
                const userName = feedback.userName || feedback.user?.name || 'Anonymous User';
                const userInitial = userName.charAt(0).toUpperCase();
                const comment = feedback.comment || feedback.feedbackText || 'No comment provided';
                const rating = typeof feedback.rating === 'number' ? feedback.rating : 0;
                const ratingDisplay = typeof feedback.rating === 'number' ? rating.toFixed(1) : '0.0';
                const createdAt = feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'Unknown date';

                return (
                  <div 
                    key={feedback.id || Math.random()} 
                    className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${
                      isTestimonialsVisible ? `opacity-100 translate-y-0 delay-${index * 100}` : 'opacity-0 translate-y-10'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
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

      {/* Contact Section with Wave Animation */}
      <section 
        ref={contactRef}
        id="contact" 
        className={`relative py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-hidden`}
      >
        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${
          isContactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact <span className="text-purple-600">Us</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? Reach out to us and our team will get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-500 hover:shadow-xl">
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
              <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-500 hover:shadow-xl">
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

              {/* Map with Zoom Animation */}
              <div className="h-80 rounded-xl overflow-hidden shadow-md transform transition-all duration-500 hover:scale-105">
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
              <div className="bg-white p-8 rounded-xl shadow-md transform transition-all duration-500 hover:shadow-xl">
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
        
        {/* Animated Wave Background */}
        <div className={`absolute bottom-0 left-0 w-full overflow-hidden leading-none transition-all duration-1000 ${
          isContactVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <svg 
            className="relative block w-full h-20" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              className="fill-purple-600"
            ></path>
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              opacity=".5" 
              className="fill-purple-600"
            ></path>
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              className="fill-purple-600"
            ></path>
          </svg>
        </div>
      </section>

      {/* Video Modal with Enhanced Animation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fadeIn">
          <div className={`relative w-full max-w-4xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg overflow-hidden transform transition-all duration-300 scale-100`}>
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
                        {formatTime(selectedSession?.endTime) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer with Gradient Animation */}
      <footer className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-purple-600 via-purple-700 to-black'} text-white py-12 overflow-hidden`}>
        <div className="container mx-auto px-4 relative z-10">
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
                  className="p-2 rounded-l-lg focus:outline-none text-black flex-grow"
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
        
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-black animate-gradient-shift"></div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s linear infinite;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

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

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fadeInSlide {
          animation: fadeInSlide 1s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-gradient-shift {
          animation: gradient-shift 15s ease infinite;
          background-size: 200% 200%;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Staggered animations for cards */
        .delay-100 {
          transition-delay: 100ms;
        }
        .delay-200 {
          transition-delay: 200ms;
        }
        .delay-300 {
          transition-delay: 300ms;
        }
        .delay-400 {
          transition-delay: 400ms;
        }
        .delay-500 {
          transition-delay: 500ms;
        }

        /* Dark mode specific styles */
        .dark {
          --tw-bg-opacity: 1;
          --tw-text-opacity: 1;
        }

        .dark .bg-white {
          background-color: rgb(31 41 55 / var(--tw-bg-opacity));
        }

        .dark .text-gray-800 {
          color: rgb(229 231 235 / var(--tw-text-opacity));
        }

        .dark .text-gray-600 {
          color: rgb(156 163 175 / var(--tw-text-opacity));
        }

        .dark .border-gray-100 {
          border-color: rgb(55 65 81 / var(--tw-border-opacity));
        }

        .dark .bg-gray-50 {
          background-color: rgb(17 24 39 / var(--tw-bg-opacity));
        }

        .dark .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }

        .dark .hover\:bg-gray-200:hover {
          background-color: rgb(55 65 81 / var(--tw-bg-opacity));
        }

        .dark .focus\:ring-purple-200:focus {
          --tw-ring-color: rgb(147 51 234 / var(--tw-ring-opacity));
        }
      `}</style>
    </div>
  );
}