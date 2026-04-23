import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Clock,
  BookOpen, 
  ShieldCheck, 
  Bell, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Assistant', icon: MessageSquare, path: '/assistant' },
    { name: 'Timetable', icon: Clock, path: '/timetable' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Electives', icon: BookOpen, path: '/electives' },
    { name: 'Policies', icon: ShieldCheck, path: '/policies' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', icon: Settings, path: '/admin' });
  }

  return (
    <div className="w-64 bg-surface border-r border-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-border flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <h1 className="text-xl font-bold text-text">SSA</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 p-3 mb-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
            {user?.profile?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate text-text">{user?.profile?.fullName || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
