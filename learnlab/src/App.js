import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home'; // Import the Home component
import AdminManagementDashboard from './Dashboard/AdminDashboard'

import LearningSessionScheduling from './Learning_Session/LearningForm';
import FeedbackForm from './Feedback/FeedbackForm';

 import LoginForm from './Login/Login';
 import SignupForm from './Login/Register'
import SkillChallenge from './SkillChallenge/SkillChallenge';
import SkillChallengeAnalysis from './SkillChallenge/SkillChallenageAnalysis';
import QuizIntroPage from './UserAnswer/QuizIntroPage';
import QuizPage from './UserAnswer/QuizPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Set the root path to render the Home component */}
        <Route path="/" element={<Home />} />
        <Route path="/AdminManagementDashboard" element={<AdminManagementDashboard/>}/>

        <Route path="/LearningSessionScheduling" element={<LearningSessionScheduling/>}/>
        <Route path="/FeedbackForm" element={<FeedbackForm/>}/>

        
        <Route path="/LoginForm" element={<LoginForm/>}/>
        <Route path="/SignupForm" element={<SignupForm/>}/>

        <Route path="/skillChallenge" element={<SkillChallenge/>}/>
        <Route path="/qizeintro" element={<QuizIntroPage/>}/>
        <Route path="/quize" element={<QuizPage/>}/>
        <Route path="/skillAnalysis" element={<SkillChallengeAnalysis/>}/>
       
        {/* You can add more routes here as needed */}
        {/* Example: <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
};

export default App;