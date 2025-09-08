// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Add useAuth import here
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';

// Import pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PendingApproval from './pages/auth/PendingApproval';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import TPODashboard from './pages/dashboard/TPODashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import JobsList from './pages/jobs/JobsList';
import JobDetail from './pages/jobs/JobDetail';
import JobPost from './pages/jobs/JobPost';
import JobEdit from './pages/jobs/JobEdit';
import Profile from './pages/profile/Profile';
import ResumePage from './pages/resume/ResumePage';
import Applications from './pages/applications/Applications';
import ApplicationDetail from './pages/applications/ApplicationDetail';
import Events from './pages/events/Events';
import EventForm from './pages/events/EventForm';

import './styles/index.css';

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
        <Route path="/pending-approval" element={<PendingApproval />} />
              
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
              
              <Route path="/jobs/:id/edit" element={
                <ProtectedRoute requiredRoles={['recruiter', 'tpo']}>
                  <Header />
                  <JobEdit />
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
              
              <Route path="/applications/:id" element={
                <ProtectedRoute>
                  <Header />
                  <ApplicationDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/events" element={
                <ProtectedRoute>
                  <Header />
                  <Events />
                </ProtectedRoute>
              } />
              
              <Route path="/events/new" element={
                <ProtectedRoute requiredRoles={['recruiter', 'tpo']}>
                  <Header />
                  <EventForm />
                </ProtectedRoute>
              } />
              
              <Route path="/events/:id/edit" element={
                <ProtectedRoute requiredRoles={['recruiter', 'tpo']}>
                  <Header />
                  <EventForm />
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

export default App;