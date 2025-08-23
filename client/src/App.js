// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Components
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import TPODashboard from './pages/dashboard/TPODashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Admin Pages
import UserManagement from './pages/admin/UserManagement';

// TPO Pages
import TPOAnalytics from './pages/tpo/TPOAnalytics';

// Other Pages
import Profile from './pages/profile/Profile';
import JobsList from './pages/jobs/JobsList';
import JobDetail from './pages/jobs/JobDetail';
import JobPost from './pages/jobs/JobPost';
import JobEdit from './pages/jobs/JobEdit';
import Applications from './pages/applications/Applications';
import ApplicationDetail from './pages/applications/ApplicationDetail';
import Events from './pages/events/Events';
import EventForm from './pages/events/EventForm';
import ResumePage from './pages/resume/ResumePage';
import ApprovalManagement from './pages/approvals/ApprovalManagement';

const DashboardRedirect = ({ user }) => {
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'student':
      return <Navigate to="/dashboard/student" replace />;
    case 'recruiter':
      return <Navigate to="/dashboard/recruiter" replace />;
    case 'tpo':
      return <Navigate to="/dashboard/tpo" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
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
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Header />
                  <Routes>
                    {/* Dashboard Routes */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        {({ user }) => <DashboardRedirect user={user} />}
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/dashboard/student" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/dashboard/recruiter" element={
                      <ProtectedRoute allowedRoles={['recruiter']}>
                        <RecruiterDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/dashboard/tpo" element={
                      <ProtectedRoute allowedRoles={['tpo']}>
                        <TPODashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/dashboard/admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin/users" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <UserManagement />
                      </ProtectedRoute>
                    } />

                    {/* TPO Routes */}
                    <Route path="/tpo/analytics" element={
                      <ProtectedRoute allowedRoles={['tpo', 'admin']}>
                        <TPOAnalytics />
                      </ProtectedRoute>
                    } />

                    {/* Profile Routes */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />

                    {/* Job Routes */}
                    <Route path="/jobs" element={
                      <ProtectedRoute>
                        <JobsList />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/jobs/new" element={
                      <ProtectedRoute allowedRoles={['recruiter', 'tpo', 'admin']}>
                        <JobPost />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/jobs/:id" element={
                      <ProtectedRoute>
                        <JobDetail />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/jobs/:id/edit" element={
                      <ProtectedRoute allowedRoles={['recruiter', 'tpo', 'admin']}>
                        <JobEdit />
                      </ProtectedRoute>
                    } />

                    {/* Application Routes */}
                    <Route path="/applications" element={
                      <ProtectedRoute>
                        <Applications />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/applications/:id" element={
                      <ProtectedRoute>
                        <ApplicationDetail />
                      </ProtectedRoute>
                    } />

                    {/* Event Routes */}
                    <Route path="/events" element={
                      <ProtectedRoute>
                        <Events />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/events/new" element={
                      <ProtectedRoute allowedRoles={['tpo', 'admin']}>
                        <EventForm />
                      </ProtectedRoute>
                    } />

                    {/* Resume Route */}
                    <Route path="/resume" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <ResumePage />
                      </ProtectedRoute>
                    } />

                    {/* Approval Routes */}
                    <Route path="/approvals" element={
                      <ProtectedRoute allowedRoles={['tpo', 'admin']}>
                        <ApprovalManagement />
                      </ProtectedRoute>
                    } />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;