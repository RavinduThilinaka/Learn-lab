import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ type, onClose, onSuccess }) => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    rating: 5,
    comments: '',
    type: type
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    comments: false
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({
      ...feedback,
      [name]: value
    });
  };

  const handleFocus = (field) => {
    setIsFocused({
      ...isFocused,
      [field]: true
    });
  };

  const handleBlur = (field) => {
    setIsFocused({
      ...isFocused,
      [field]: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8080/public/addFeedback', feedback);
      
      if (response.status === 200) {
        setShowSuccess(true);
        setFeedback({ 
          name: '', 
          email: '', 
          rating: 5, 
          comments: '',
          type: type
        });
        
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get form theme based on feedback type
  const getFormTheme = () => {
    switch(type) {
      case 'bug':
        return {
          title: 'Report a Bug',
          icon: '🐞',
          gradient: 'from-red-500 to-orange-500',
          ring: 'focus:ring-red-500',
          border: 'border-red-100',
          buttonHover: 'hover:shadow-red-200'
        };
      case 'suggestion':
        return {
          title: 'Share a Suggestion',
          icon: '💡',
          gradient: 'from-blue-500 to-cyan-500',
          ring: 'focus:ring-blue-500',
          border: 'border-blue-100',
          buttonHover: 'hover:shadow-blue-200'
        };
      default:
        return {
          title: 'Give Us Feedback',
          icon: '💬',
          gradient: 'from-purple-500 to-indigo-500',
          ring: 'focus:ring-purple-500',
          border: 'border-purple-100',
          buttonHover: 'hover:shadow-purple-200'
        };
    }
  };

  const theme = getFormTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm animate-fade-in-up">
            <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 text-white text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-3 inline-flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className="opacity-90">Your feedback has been submitted successfully.</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-6">
                We appreciate you taking the time to help us improve. Your {type === 'bug' ? 'bug report' : type === 'suggestion' ? 'suggestion' : 'feedback'} is valuable to us.
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      {!showSuccess && (
        <div className={`w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.005] animate-fade-in-up`}>
          {/* Form Header */}
          <div className={`bg-gradient-to-r ${theme.gradient} p-6 text-white relative`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-white"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-4xl animate-bounce">{theme.icon}</span>
                <h2 className="text-2xl font-bold tracking-tight">{theme.title}</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-all p-1 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close feedback form"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={feedback.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={() => handleBlur('name')}
                    className={`w-full px-4 py-3 border ${isFocused.name ? theme.border : 'border-gray-200'} rounded-lg ${theme.ring} focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white focus:shadow-md`}
                    placeholder="John Doe"
                    required
                  />
                  <div className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-opacity duration-200 ${isFocused.name ? 'opacity-0' : 'opacity-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={feedback.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-4 py-3 border ${isFocused.email ? theme.border : 'border-gray-200'} rounded-lg ${theme.ring} focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white focus:shadow-md`}
                    placeholder="your@email.com"
                    required
                  />
                  <div className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-opacity duration-200 ${isFocused.email ? 'opacity-0' : 'opacity-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Rating Field */}
              <div className="space-y-2">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="rating"
                    name="rating"
                    value={feedback.rating}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${theme.ring} focus:border-transparent outline-none transition-all duration-200 bg-gray-50 appearance-none focus:bg-white focus:shadow-md`}
                  >
                    <option value="1">😞 Poor - Needs Improvement</option>
                    <option value="2">😐 Fair - It's Okay</option>
                    <option value="3">🙂 Good - Satisfied</option>
                    <option value="4">😊 Very Good - Happy</option>
                    <option value="5">😍 Excellent - Love It!</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Comments Field */}
              <div className="space-y-2">
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                  {type === 'bug' ? 'Bug Description' : 
                   type === 'suggestion' ? 'Your Suggestion' : 
                   'Your Feedback'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="comments"
                    name="comments"
                    value={feedback.comments}
                    onChange={handleChange}
                    onFocus={() => handleFocus('comments')}
                    onBlur={() => handleBlur('comments')}
                    className={`w-full px-4 py-3 border ${isFocused.comments ? theme.border : 'border-gray-200'} rounded-lg ${theme.ring} focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white focus:shadow-md resize-none`}
                    placeholder={
                      type === 'bug' ? 'Please describe the bug you encountered in detail...' : 
                      type === 'suggestion' ? 'We\'d love to hear your ideas for improvement...' : 
                      'Share your thoughts and experience with us...'
                    }
                    rows="5"
                    required
                  ></textarea>
                  <div className={`absolute bottom-3 right-3 transition-opacity duration-200 ${feedback.comments.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <span className={`text-xs ${feedback.comments.length > 300 ? 'text-red-500' : 'text-gray-400'}`}>
                      {feedback.comments.length}/500
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 px-6 py-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : `bg-gradient-to-r ${theme.gradient} text-white shadow-md ${theme.buttonHover} hover:shadow-lg`
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;