import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Electives from './pages/Electives';
import Calendar from './pages/Calendar';
import Timetable from './pages/Timetable';
import Policies from './pages/Policies';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import useAuthStore from './store/useAuthStore';

function App() {
  const { token, user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!token ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout title="Student Dashboard" />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<DashboardLayout title="Academic Assistant" />}>
          <Route path="/assistant" element={<Assistant />} />
        </Route>

        <Route element={<DashboardLayout title="Elective Courses" />}>
          <Route path="/electives" element={<Electives />} />
        </Route>

        <Route element={<DashboardLayout title="Academic Calendar" />}>
          <Route path="/calendar" element={<Calendar />} />
        </Route>

        <Route element={<DashboardLayout title="Weekly Timetable" />}>
          <Route path="/timetable" element={<Timetable />} />
        </Route>

        <Route element={<DashboardLayout title="Policy Center" />}>
          <Route path="/policies" element={<Policies />} />
        </Route>

        <Route element={<DashboardLayout title="Notifications" />}>
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Admin Route */}
        {user?.role === 'admin' && (
          <Route element={<DashboardLayout title="Admin Panel" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
