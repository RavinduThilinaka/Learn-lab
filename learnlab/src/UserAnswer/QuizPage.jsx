import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Duration } from 'luxon';
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [scorePercentage, setScorePercentage] = useState(0);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/public/allChallenge');
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setIsExpired(false);
      setTimeRemaining(null);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.reduce((count, answer, index) => {
      const question = questions[index];
      return answer.selectedAnswer === question.correctAnswer ? count + 1 : count;
    }, 0);
    
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    setScorePercentage(percentage);
    setShowScorePopup(true);
  };

  const closeScorePopup = () => {
    setShowScorePopup(false);
    navigate('/');
  };

  const finishQuiz = async () => {
    calculateScore();
    try {
      // Transform answers to match backend structure
      const backendDataArray = answers.map(answer => {
        const backendData = {
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: ""
        };
        
        // Mark the selected option
        backendData[`option${answer.selectedAnswer}`] = "Selected";
        
        // Include question ID in one of the unused fields
        backendData.optionA += ` (Q${answer.questionId})`;
        
        return backendData;
      });

      // Submit each answer
      for (const data of backendDataArray) {
        await axios.post('http://localhost:8080/public/submitAnswer', data);
      }

    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = { 
      questionId: questions[currentQuestionIndex].id, 
      selectedAnswer: answer
    };
    setAnswers(newAnswers);
  };

  const formatTime = (time) => {
    if (time <= 0 || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && currentQuestion.deadLine) {
        const deadlineDuration = Duration.fromISO(currentQuestion.deadLine);
        const expirationTime = new Date().getTime() + deadlineDuration.toMillis();

        const updateRemainingTime = () => {
          const now = new Date().getTime();
          const remainingTime = expirationTime - now;

          if (remainingTime <= 0) {
            setIsExpired(true);
          } else {
            setTimeRemaining(remainingTime);
          }
        };

        const timerInterval = setInterval(updateRemainingTime, 1000);
        updateRemainingTime();

        return () => clearInterval(timerInterval);
      }
    }
  }, [currentQuestionIndex, questions]);

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">Loading questions...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Score Popup */}
      {showScorePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-popup">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">Quiz Completed!</h2>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4">
                <span className="text-4xl font-bold text-white">{scorePercentage}%</span>
              </div>
              <p className="text-gray-600">
                You scored {scorePercentage}% correct answers!
              </p>
            </div>
            <button 
              onClick={closeScorePopup}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full text-center transition-all duration-300 hover:shadow-2xl">
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="relative">
              <div className="h-4 w-32 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{questions[currentQuestionIndex]?.questionText}</h2>
            {isExpired ? (
              <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Time's up!
              </div>
            ) : (
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Time remaining: {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {["A", "B", "C", "D"].map((option) => (
              <button 
                key={option}
                disabled={isExpired} 
                onClick={() => handleAnswerSelect(option)} 
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left
                  ${selectedAnswer === option ? 
                    'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' : 
                    'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'}
                  ${isExpired ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 
                    ${selectedAnswer === option ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {option}
                  </span>
                  <span>{questions[currentQuestionIndex]?.[`option${option}`]}</span>
                </div>
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button 
              onClick={finishQuiz} 
              disabled={isExpired || answers.length !== questions.length} 
              className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-300
                ${(isExpired || answers.length !== questions.length) ? 
                  'bg-gray-400 cursor-not-allowed' : 
                  'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-md hover:shadow-lg'}
              `}
            >
              Finish Quiz
            </button>
          ) : (
            <button 
              onClick={nextQuestion} 
              disabled={isExpired || !selectedAnswer} 
              className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-300
                ${(isExpired || !selectedAnswer) ? 
                  'bg-gray-400 cursor-not-allowed' : 
                  'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'}
              `}
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;