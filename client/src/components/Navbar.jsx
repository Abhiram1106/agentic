import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Navbar = ({ title }) => {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-text">{title}</h2>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search academic info..."
            className="pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text">{user?.profile?.fullName || 'Student'}</p>
            <p className="text-xs text-gray-400">{user?.role === 'admin' ? 'Administrator' : `${user?.profile?.department}`}</p>
          </div>
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
