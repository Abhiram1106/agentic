import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  Bell, 
  ArrowRight,
  CheckCircle2,
  MoreVertical,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState({
    exams: [],
    reminders: [],
    notifications: [],
    electivesStatus: 'Not Registered'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be separate calls or a single dashboard aggregate call
        const [examsRes, remindersRes, notificationsRes] = await Promise.all([
          API.get('/student/exams'),
          API.get('/student/reminders'),
          API.get('/student/notifications')
        ]);
        
        setData({
          exams: examsRes.data.slice(0, 2),
          reminders: remindersRes.data.slice(0, 3),
          notifications: notificationsRes.data.slice(0, 3),
          electivesStatus: 'Active'
        });
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Upcoming Exams', value: data.exams.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Tasks', value: data.reminders.length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Unread Alerts', value: data.notifications.filter(n => !n.isRead).length, icon: Bell, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Elective Credits', value: '12/18', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Welcome back, {user?.profile?.fullName || 'Student'}!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your academic world today.</p>
        </div>
        <Link to="/assistant" className="btn-primary flex items-center">
          Ask Assistant <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-text">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Exams */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text">Upcoming Exams</h3>
              <Link to="/calendar" className="text-sm font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {data.exams.length > 0 ? data.exams.map((exam, i) => (
                <div key={i} className="flex items-center p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg mr-4 text-center min-w-[60px]">
                    <p className="text-xs font-bold uppercase">{format(new Date(exam.date), 'MMM')}</p>
                    <p className="text-xl font-bold">{format(new Date(exam.date), 'dd')}</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text">{exam.subject}</h4>
                    <p className="text-sm text-gray-500">{exam.title} • {exam.time}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500 hidden sm:block">
                    <p>{exam.location}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center py-8 text-gray-500">No upcoming exams found.</p>
              )}
            </div>
          </div>

          <div className="card p-6">
             <h3 className="text-lg font-bold text-text mb-6">Quick Actions</h3>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Exams', icon: Calendar, path: '/calendar' },
                  { name: 'Electives', icon: BookOpen, path: '/electives' },
                  { name: 'Policies', icon: ShieldCheck, path: '/policies' },
                  { name: 'Reminders', icon: Clock, path: '/notifications' }
                ].map((action, i) => (
                  <Link key={i} to={action.path} className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-border">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-600">
                      <action.icon size={20} />
                    </div>
                    <span className="text-sm font-medium">{action.name}</span>
                  </Link>
                ))}
             </div>
          </div>
        </div>

        {/* Reminders & Sidebar */}
        <div className="space-y-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text">Reminders</h3>
              <button className="text-sm font-bold text-primary hover:underline">Add New</button>
            </div>
            <div className="space-y-4">
              {data.reminders.length > 0 ? data.reminders.map((reminder, i) => (
                <div key={i} className="flex items-start space-x-3 group">
                  <div className="mt-1">
                    <div className="w-5 h-5 border-2 border-border rounded flex items-center justify-center hover:border-primary transition-colors cursor-pointer group-hover:bg-primary/5"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text">{reminder.title}</p>
                    <p className="text-xs text-gray-400">Due {format(new Date(reminder.dueDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center py-4 text-gray-500 text-sm">All caught up!</p>
              )}
            </div>
          </div>

          <div className="bg-primary rounded-2xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Need help?</h3>
              <p className="text-blue-100 text-sm mb-4">Ask the assistant about your exams, policies, or elective options.</p>
              <Link to="/assistant" className="inline-flex items-center bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
                Open Chat
              </Link>
            </div>
            <MessageSquare className="absolute -bottom-4 -right-4 text-white opacity-10" size={120} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
