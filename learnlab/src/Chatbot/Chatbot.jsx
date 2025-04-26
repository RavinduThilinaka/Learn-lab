import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faComment, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';
import CompanyLogo from '../Images/logo1.png';
import Navbar from '../Navbar/Navbar';

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatBodyRef = useRef();
  const popupRef = useRef();

  
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDjyXtMbzpuT0Hflor4TIOux5tUC47Xbg0';

  
  const vibrateStyle = {
    animation: 'vibrate 2s infinite ease-in-out',
    transformOrigin: 'center'
  };

 
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes vibrate {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.05) rotate(-2deg); }
        50% { transform: scale(1.08) rotate(2deg); }
        75% { transform: scale(1.05) rotate(-2deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory(prev => [
        ...prev.filter(msg => msg.text !== "Thinking..."),
        {
          role: "model",
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    
    updateHistory("Thinking...");

    try {
      history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history })
      };

      const response = await fetch(API_URL, requestOptions);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error("Invalid response format from API");
      }

      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      updateHistory("Sorry, I'm having trouble connecting. Please try again later.");
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatHistory]);

  useEffect(() => {
    if (showChatbot && popupRef.current) {
      const popup = popupRef.current;
      const viewportHeight = window.innerHeight;
      const popupHeight = popup.offsetHeight;

      if (popupHeight > viewportHeight - 150) {
        popup.style.maxHeight = `${viewportHeight - 150}px`;
      }
    }
  }, [showChatbot]);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
    setIsMinimized(false);
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
    setShowChatbot(false);
  };

  return (
    <>
     
      {!showChatbot && !isMinimized && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-indigo-600 to-purple-600">
          <div
            className="flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
            onClick={toggleChatbot}
          >
            <img
              src={CompanyLogo}
              alt="Company Logo"
              className="h-32 w-32 rounded-full object-cover mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              style={vibrateStyle}
            />
            <h2 className="text-4xl font-bold text-white mb-3">AI Assistant</h2>
            <p className="text-white/80 text-lg max-w-md text-center mb-6">
              Click the logo to start chatting
            </p>
          </div>
        </div>
      )}

      {/* Minimized Chat Icon */}
      {isMinimized && (
        <div
          className="fixed bottom-8 right-8 h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer pointer-events-auto z-50"
          onClick={toggleChatbot}
        >
          <FontAwesomeIcon icon={faComment} className="text-2xl" />
        </div>
      )}

      {/* Chatbot Interface - Centered on Screen */}
      {showChatbot && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-purple-800/90 backdrop-blur-sm">
          <div
            className="w-full max-w-md mx-4 h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out pointer-events-auto border border-gray-200"
            ref={popupRef}
          >
            {/* Chat Header */}
            <div className="flex p-4 items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <img
                    src={CompanyLogo}
                    alt="Company Logo"
                    className="h-10 w-10 rounded-full object-cover border-2 border-white"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full w-3 h-3 border border-white"></div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">AI Assistant</h2>
                  <p className="text-xs opacity-90">Online now</p>
                </div>
              </div>
              <div className="flex gap-2">
               
                <button
                  className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                  onClick={toggleChatbot}
                  aria-label="Close chat"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div
              ref={chatBodyRef}
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gradient-to-b from-white to-gray-50 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent"
            >
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-sm">
                    <img 
                        src={CompanyLogo} 
                        alt="Company Logo" 
                        className="h-8 w-8 rounded-full object-cover" 
                    />
                </div>
                <div className="max-w-[80%]">
                  <div className="px-4 py-3 bg-indigo-100 rounded-xl rounded-tl-none text-sm text-gray-800 shadow-sm">
                    Hello! I'm your AI assistant. How can I help you today?
                  </div>
                  <div className="text-xs text-gray-400 mt-1 ml-1">Just now</div>
                </div>
              </div>

              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>

            {/* Chat Input */}
            <div className="bg-white p-4 border-t border-gray-100">
              <ChatForm
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                generateBotResponse={generateBotResponse}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;