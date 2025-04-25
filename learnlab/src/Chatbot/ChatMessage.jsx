import React from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CompanyLogo from '../Images/logo1.png'; 

const ChatMessage = ({ chat }) => {
  return (
    <div className={`flex gap-3 items-start ${chat.role === "user" ? 'justify-end' : ''}`}>
      {chat.role === "model" && (
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-sm">
          <img 
            src={CompanyLogo} 
            alt="Company Logo" 
            className="h-8 w-8 rounded-full object-cover" 
          />
        </div>
      )}
      
      <div className={`max-w-[80%] ${chat.role === "user" ? 'flex flex-col items-end' : ''}`}>
        <div className={`
          px-4 py-3 rounded-xl text-sm
          ${chat.role === "model" 
            ? 'bg-indigo-50 rounded-tl-none text-gray-800 border border-indigo-100 shadow-sm' 
            : 'bg-gradient-to-br from-indigo-500 to-purple-600 rounded-tr-none text-white shadow-md'}
          transition-all duration-150
        `}>
          {chat.text}
        </div>
        {chat.timestamp && (
          <div className={`text-xs mt-1 ${chat.role === "user" 
            ? 'text-gray-400 mr-2' 
            : 'text-gray-500 ml-2'}`}>
            {chat.timestamp}
          </div>
        )}
      </div>
      
      {chat.role === "user" && (
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-full shadow-md">
          <FontAwesomeIcon 
            icon={faUser} 
            className="h-4 w-4 text-gray-600" 
          />
        </div>
      )}
    </div>
  )
}

export default ChatMessage;