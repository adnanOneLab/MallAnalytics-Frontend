import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Users } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#1a1a1a] flex-shrink-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">W</span>
          </div>
          <span className="font-semibold text-lg text-white">WISE Video</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === '/'
              ? 'bg-black/50 text-white'
              : 'text-gray-400 hover:text-white hover:bg-black/50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/visitors"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === '/visitors'
              ? 'bg-black/50 text-white'
              : 'text-gray-400 hover:text-white hover:bg-black/50'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Visitors</span>
        </Link>
      </nav>

      {/* User Profile and Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <span className="text-gray-300">Admin User</span>
        </div>
        <button className="flex items-center space-x-3 text-gray-400 hover:text-white px-3 py-2 rounded-lg w-full hover:bg-black/50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 