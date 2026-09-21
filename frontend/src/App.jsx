import react from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import './App.css';
import WhySpeakly from './components/WhySpeakly';
import HowItWorks from './components/HowItWorks';
import WhatYouLearn from './components/WhatYouLearn';
import Features from './components/Features';
import AIPartner from './components/AIPartner';
import RealLife from './components/RealLife';
import SmartRevision from './components/SmartRevision';
import WeaknessMap from './components/WeaknessMap';
import ForStudents from './components/ForStudents';
import ForTeacher from './components/ForTeacher';
import SocialProof from './components/SocialProof';
import CTA from './components/CTA';
import Footer from './components/Footer';
import UserNavbar from './components/UserNavbar';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';

import Signup from './components/Signup';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import StudentSetup from './components/StudentSetup';
import TeacherSetup from './components/TeacherSetup';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import Learn from './components/Learn';
import WordLearning from './components/WordLearning';
import SentencePractice from './components/SentencePractice';
import GrammarHint from './components/GrammarHint';
import WordResult from './components/WordResult';
import RevisionSession from './components/RevisionSession';
import SpeakingPractice from './components/SpeakingPractice';
import AIFriend from './components/AIFriend';
import Conversation from './components/Conversation';
import SpeakingFeedback from './components/SpeakingFeedback';
import Challenges from './components/Challenges';
import DailyChallenge from './components/DailyChallenge';
import Progress from './components/Progress';
import LearningHistory from './components/LearningHistory';
import WeakAreas from './components/WeakAreas';
import Students from './components/Students';
import StudentProfile from './components/StudentProfile';
import TeacherProfile from './components/TeacherProfile';
import Notifications from './components/Notifications';
import Assignments from './components/Assignments';
import CreateAssignment from './components/CreateAssignment';
import TeacherContentManager from './components/TeacherContentManager';
import Pricing from './components/Pricing';
import NotFound from "./components/NotFound";  
import WeeklyTest from './components/WeeklyTest';
import TeacherLessonDetail from './components/TeacherLessonDetail';
import StudentTeacherLessons from './components/StudentTeacherLessons';
import TeacherAIAssistant from './components/TeacherAIAssistant';
import TeacherStudentOverview from './components/TeacherStudentOverview';
import TeacherStudentProgress from './components/TeacherStudentProgress';
import TeacherStudentWeakAreas from './components/TeacherStudentWeakAreas';
import TeacherProgress from "./components/TeacherProgress";
import TeacherWeakAreas from "./components/TeacherWeakAreas";
import Community from './components/Community';
import Settings from './components/Settings';
import MyTeachers from './components/MyTeachers';
import AssignmentDetail from './components/AssignmentDetail';
import TeacherWordDetail from './components/TeacherWordDetail';
import ScenarioPractice from './components/ScenarioPractice';
import Contest from './components/Contest';
import SpeakingRoom from './components/SpeakingRoom';
import AIVideoCall from './components/AIVideoCall';
import AIChat from './components/AIChat';
import PaymentSuccess from './components/PaymentSuccess';

function Landingpage() {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <WhySpeakly />
        <HowItWorks />
        <WhatYouLearn />
        <RealLife />
        <Features />
        <Pricing />
        <AIPartner />
        <WeaknessMap />
        <ForStudents />
        <ForTeacher />
        <SocialProof />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  return (
    <>
      {user.id && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup' && <UserNavbar />}
      
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/student-setup" element={<ProtectedRoute role="student"><StudentSetup /></ProtectedRoute>} />
        <Route path="/teacher-setup" element={<ProtectedRoute role="teacher"><TeacherSetup /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
        
        <Route path="/learn" element={<ProtectedRoute role="student"><Learn /></ProtectedRoute>} />
        <Route path="/word-learning" element={<ProtectedRoute role="student"><WordLearning /></ProtectedRoute>} />
        <Route path="/sentence-practice" element={<ProtectedRoute role="student"><SentencePractice /></ProtectedRoute>} />
        <Route path="/grammar-hint" element={<ProtectedRoute role="student"><GrammarHint /></ProtectedRoute>} />
        <Route path="/word-result" element={<ProtectedRoute role="student"><WordResult /></ProtectedRoute>} />
        <Route path="/smart-revision" element={<ProtectedRoute role="student"><SmartRevision /></ProtectedRoute>} />
        <Route path="/revision-session" element={<ProtectedRoute role="student"><RevisionSession /></ProtectedRoute>} />
        <Route path="/speaking-practice" element={<ProtectedRoute role="student"><SpeakingPractice /></ProtectedRoute>} />
        <Route path="/speaking-practice/scenarios" element={<ProtectedRoute role="student"><ScenarioPractice /></ProtectedRoute>} />
        <Route path="/ai-friend" element={<ProtectedRoute role="student"><AIFriend /></ProtectedRoute>} />
        <Route path="/conversation" element={<ProtectedRoute role="student"><Conversation /></ProtectedRoute>} />
        <Route path="/speaking-feedback" element={<ProtectedRoute role="student"><SpeakingFeedback /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute role="student"><Challenges /></ProtectedRoute>} />
        <Route path="/contest" element={<ProtectedRoute role="student"><Contest /></ProtectedRoute>} />
        <Route path="/speaking-room" element={<ProtectedRoute role="student"><SpeakingRoom /></ProtectedRoute>} />
        <Route path="/ai-video-call" element={<ProtectedRoute role="student"><AIVideoCall /></ProtectedRoute>} />
        <Route path="/ai-chat" element={<ProtectedRoute role="student"><AIChat /></ProtectedRoute>} />
        <Route path="/daily-challenge" element={<ProtectedRoute role="student"><DailyChallenge /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute role="student"><Progress /></ProtectedRoute>} />
        <Route path="/learning-history" element={<ProtectedRoute role="student"><LearningHistory /></ProtectedRoute>} />
        <Route path="/weak-areas" element={<ProtectedRoute role="student"><WeakAreas /></ProtectedRoute>} />
        <Route path="/weekly-test" element={<ProtectedRoute role="student"><WeeklyTest /></ProtectedRoute>} />
        <Route path="/student-profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/my-teachers" element={<ProtectedRoute role="student"><MyTeachers /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="/students" element={<ProtectedRoute role="teacher"><Students /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute role="teacher"><Assignments /></ProtectedRoute>} />
        <Route path="/assignment/:id" element={<ProtectedRoute role="teacher"><AssignmentDetail /></ProtectedRoute>} />
        <Route path="/create-assignment" element={<ProtectedRoute role="teacher"><CreateAssignment /></ProtectedRoute>} />
        <Route path="/teacher-content" element={<ProtectedRoute role="teacher"><TeacherContentManager /></ProtectedRoute>} />
        <Route path="/teacher/lesson/:id" element={<ProtectedRoute role="teacher"><TeacherLessonDetail /></ProtectedRoute>} />
        <Route path="/teacher/word/:id" element={<ProtectedRoute role="teacher"><TeacherWordDetail /></ProtectedRoute>} />
        <Route path="/teacher/students" element={<ProtectedRoute role="teacher"><Students /></ProtectedRoute>} />
        <Route path="/teacher/classes" element={<ProtectedRoute role="teacher"><Assignments /></ProtectedRoute>} />
        <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/content-manager" element={<ProtectedRoute role="teacher"><TeacherContentManager /></ProtectedRoute>} />
        <Route path="/teacher/ai-assistant" element={<ProtectedRoute role="teacher"><TeacherAIAssistant /></ProtectedRoute>} />
        <Route path="/teacher/student-overview" element={<ProtectedRoute role="teacher"><TeacherStudentOverview /></ProtectedRoute>} />
        <Route path="/teacher/teacher-progress" element={<ProtectedRoute role="teacher"><TeacherProgress /></ProtectedRoute>} />
        <Route path="/teacher/teacher-weak-areas" element={<ProtectedRoute role="teacher"><TeacherWeakAreas /></ProtectedRoute>} />
        <Route path="/teacher-profile" element={<ProtectedRoute role="teacher"><TeacherProfile /></ProtectedRoute>} />

        <Route path="/student/teacher-lessons" element={<ProtectedRoute role="student"><StudentTeacherLessons /></ProtectedRoute>} />
        <Route path="/social/community" element={<ProtectedRoute role="student"><Community /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;