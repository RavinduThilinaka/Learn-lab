import React, { useState } from 'react';

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { 
      role: "user", 
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const thinkingMessage = { role: "model", text: "Thinking..." };
    
    setChatHistory(prev => [...prev, userMessage, thinkingMessage]);
    setMessage('');
    
    generateBotResponse([...chatHistory, userMessage]);
  };

  return (
    <form onSubmit={handleSubmit} className="px-2 pb-2">
      <div className="relative flex items-center">
        <input
          type="text"
          className="w-full py-3 pl-4 pr-14 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          aria-label="Type your message"
        />
        <button 
          type="submit" 
          disabled={!message.trim()}
          className="absolute right-2 flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-sm"
          aria-label="Send message"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 transform rotate-45" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default ChatForm;