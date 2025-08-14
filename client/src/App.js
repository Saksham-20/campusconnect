// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';

// Import pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import TPODashboard from './pages/dashboard/TPODashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import JobsList from './pages/jobs/JobsList';
import JobDetail from './pages/jobs/JobDetail';
import JobPost from './pages/jobs/JobPost';
import Profile from './pages/profile/Profile';
import ResumePage from './pages/resume/ResumePage';
import Applications from './pages/applications/Applications';
import Events from './pages/events/Events';

import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Header />
                  <DashboardRouter />
                </ProtectedRoute>
              } />
              
              <Route path="/jobs" element={
                <ProtectedRoute>
                  <Header />
                  <JobsList />
                </ProtectedRoute>
              } />
              
              <Route path="/jobs/:id" element={
                <ProtectedRoute>
                  <Header />
                  <JobDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/jobs/new" element={
                <ProtectedRoute requiredRoles={['recruiter', 'tpo']}>
                  <Header />
                  <JobPost />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Header />
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/resume" element={
                <ProtectedRoute requiredRoles={['student']}>
                  <Header />
                  <ResumePage />
                </ProtectedRoute>
              } />
              
              <Route path="/applications" element={
                <ProtectedRoute>
                  <Header />
                  <Applications />
                </ProtectedRoute>
              } />
              
              <Route path="/events" element={
                <ProtectedRoute>
                  <Header />
                  <Events />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

// Dashboard router component to redirect based on user role
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'tpo':
      return <TPODashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default App;