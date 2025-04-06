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
import UpdateSkillChallenge from './SkillChallenge/UpdateSkillChallenge';
import ViewAllChallenge from './SkillChallenge/ViewAllChallenge';



const App = () => {
  return (
    <Router>
      <Routes>
        {/* Set the root path to render the Home component */}
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<VideoBackgroundPage/>}/>
        <Route path="/AdminManagementDashboard" element={<AdminManagementDashboard/>}/>

        <Route path="/LearningSessionScheduling" element={<LearningSessionScheduling/>}/>
        <Route path="/ViewAllSessions" element={<ViewAllSessions/>}/>
        <Route path="/AnalyticsDashboard" element={<AnalyticsDashboard/>}/>

        <Route path="/FeedbackForm" element={<FeedbackForm/>}/>
        <Route path="/FeedbackManagement" element={<FeedbackManagement/>}/>

        
        <Route path="/LoginForm" element={<LoginForm/>}/>
        <Route path="/SignupForm" element={<SignupForm/>}/>

        <Route path="/skillChallenge" element={<SkillChallenge/>}/>
        <Route path="/qizeintro" element={<QuizIntroPage/>}/>
        <Route path="/quize" element={<QuizPage/>}/>
        <Route path="/skillAnalysis" element={<SkillChallengeAnalysis/>}/>
        <Route path="//updateChallange/:id" element={<UpdateSkillChallenge/>}/>
        <Route path="/viewChallange" element={<ViewAllChallenge/>}/>


        <Route path="/SkillCategoryForm" element={<SkillCategoryForm/>}/>
       

      </Routes>
    </Router>
  );
};

export default App;