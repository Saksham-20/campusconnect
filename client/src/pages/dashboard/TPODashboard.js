// client/src/pages/dashboard/TPODashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const TPODashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    students: [],
    jobs: [],
    events: [],
    stats: {
      totalStudents: 0,
      placedStudents: 0,
      activeJobs: 0,
      upcomingEvents: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [studentsRes, jobsRes, eventsRes] = await Promise.all([
        api.get('/users/role/student?limit=10'),
        api.get('/jobs?limit=5&organizationId=' + user.organizationId),
        api.get('/events?limit=5&organizationId=' + user.organizationId)
      ]);

      setDashboardData({
        students: studentsRes.users || [],
        jobs: jobsRes.jobs || [],
        events: eventsRes.events || [],
        stats: {
          totalStudents: studentsRes.users?.length || 0,
          placedStudents: studentsRes.users?.filter(s => s.studentProfile?.placementStatus === 'placed').length || 0,
          activeJobs: jobsRes.jobs?.filter(j => j.status === 'active').length || 0,
          upcomingEvents: eventsRes.events?.length || 0
        }
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            TPO Dashboard - {user?.organization?.name}
          </h1>
          <p className="text-gray-600">
            Manage placements and track student progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-lg font-medium text-gray-900">{dashboardData.stats.totalStudents}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* Add other stat cards similarly */}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Students</h2>
              {/* Student list */}
              <div className="space-y-4">
                {dashboardData.students.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{student.firstName} {student.lastName}</h3>
                      <p className="text-sm text-gray-600">{student.studentProfile?.course}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      student.studentProfile?.placementStatus === 'placed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.studentProfile?.placementStatus || 'unplaced'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/jobs/new"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50"
                >
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                  Post New Job
                </Link>
                <Link
                  to="/events/new"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50"
                >
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  Schedule Event
                </Link>
                <Link
                  to="/students"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg border hover:bg-gray-50"
                >
                  <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                  Manage Students
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TPODashboard;