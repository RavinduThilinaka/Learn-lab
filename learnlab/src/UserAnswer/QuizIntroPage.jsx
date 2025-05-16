import React from 'react';
import { useNavigate } from 'react-router-dom';
import companyLogo from "../Images/Quize3.gif";

const QuizIntroPage = () => {
  const navigate = useNavigate();
  const [showRules, setShowRules] = React.useState(false);

  const startQuiz = () => {
    setShowRules(true);
  };

  const continueToQuiz = () => {
    navigate('/quize');
  };

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundImage: `url(${companyLogo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white bg-opacity-90 shadow-xl rounded-2xl p-8 max-w-2xl w-full text-center transition-all duration-300 hover:shadow-2xl">
          {!showRules ? (
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl font-bold text-purple-700 mb-4">Welcome to the Quiz!</h1>
              <p className="text-gray-600 mb-8 text-lg">Test your knowledge with our challenging questions.</p>
              <button 
                onClick={startQuiz} 
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold"
              >
                Start Quiz Now
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-purple-700 mb-2">Quiz Rules</h2>
                <div className="w-20 h-1 bg-purple-500 mx-auto mb-6 rounded-full"></div>
              </div>
              <ul className="text-left space-y-3 mb-8 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-700 rounded-full p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  You must answer each question before moving to the next one.
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-700 rounded-full p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Each question has a time limit; once time is up, you can't answer.
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-700 rounded-full p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  You cannot go back to previous questions.
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-700 rounded-full p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Your final score will be shown as a percentage after completing all questions.
                </li>
              </ul>
              <button 
                onClick={continueToQuiz} 
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg shadow-md hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 font-medium"
              >
                Continue to Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizIntroPage;