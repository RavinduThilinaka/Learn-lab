import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home'; // Import the Home component
import VideoBackgroundPage  from './LaunchingScreen/Loading';
import AdminManagementDashboard from './Dashboard/AdminDashboard'

import LearningSessionScheduling from './Learning_Session/LearningForm';
import ViewAllSessions from './Learning_Session/SessionData';
import AnalyticsDashboard from './Learning_Session/SessionAnalytics';

import FeedbackForm from './Feedback/FeedbackForm';
import FeedbackManagement from './Feedback/FeedbackData';

 import LoginForm from './Login/Login';
 import SignupForm from './Login/Register'


import SkillChallenge from './SkillChallenge/SkillChallenge';
import SkillChallengeAnalysis from './SkillChallenge/SkillChallenageAnalysis';
import QuizIntroPage from './UserAnswer/QuizIntroPage';
import QuizPage from './UserAnswer/QuizPage';

import SkillCategoryForm  from './SkillCatergory/SkillCatergory';
import CategoryListPage from './SkillCatergory/categoryData';

import UpdateSkillChallenge from './SkillChallenge/UpdateSkillChallenge';
import ViewAllChallenge from './SkillChallenge/ViewAllChallenge';
import Navbar from './Navbar/Navbar';
import Chatbot from './Chatbot/Chatbot';
import ChatForm from './Chatbot/ChatForm';
import ChatMessage from './Chatbot/ChatMessage';
import ViewChallenge from './SkillChallenge/ViewChallange';
import LearningSessionViewer from './Learning_Session/LearningSessionViewer';




const App = () => {
  return (
    <Router>
      <Routes>
        {/* Set the root path to render the Home component */}
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<VideoBackgroundPage/>}/>
        <Route path="/AdminManagementDashboard" element={<AdminManagementDashboard/>}/>

        <Route path="/LearningSessionScheduling" element={<LearningSessionScheduling/>}/>
        <Route path="/ViewAllSessions" element={<ViewAllSessions/>}/>
        <Route path="/AnalyticsDashboard" element={<AnalyticsDashboard/>}/>

        <Route path="/FeedbackForm" element={<FeedbackForm/>}/>
        <Route path="/FeedbackManagement" element={<FeedbackManagement/>}/>

        
        <Route path="/Login" element={<LoginForm/>}/>
        <Route path="/Signup" element={<SignupForm/>}/>

        <Route path="/skillChallenge" element={<SkillChallenge/>}/>
        <Route path="/qizeintro" element={<QuizIntroPage/>}/>
        <Route path="/quize" element={<QuizPage/>}/>
        <Route path="/skillAnalysis" element={<SkillChallengeAnalysis/>}/>
        <Route path="/updateChallange/:id" element={<UpdateSkillChallenge/>}/>
        <Route path="/viewChallange" element={<ViewAllChallenge/>}/>
        <Route path="/view/:id" element={<ViewChallenge/>}/>


        <Route path="/SkillCategoryForm" element={<SkillCategoryForm/>}/>
        <Route path="/CategoryListPage" element={<CategoryListPage/>}/>
       
        <Route path="/bot" element={<Chatbot/>}/>
        <Route path="/chatform" element={<ChatForm/>}/>
        <Route path="/chatmessage" element={<ChatMessage/>}/>

        <Route path="/display" element={<LearningSessionViewer/>}/>
      </Routes>
    </Router>
  );
};

export default App;