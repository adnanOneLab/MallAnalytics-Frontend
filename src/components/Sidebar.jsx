import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Users, X, Megaphone, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  console.log(t, "t from i 18", i18n)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="w-60 min-h-screen bg-[#1a1a1a] flex-shrink-0 flex flex-col">
      {/* Logo and Close Button */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">W</span>
          </div>
          <span className="font-semibold text-lg text-white">{t('common.appName')}</span>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          to="/"
          onClick={onClose}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/'
            ? 'bg-black/50 text-white'
            : 'text-gray-400 hover:text-white hover:bg-black/50'
            }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{t('common.dashboard')}</span>
        </Link>

        <Link
          to="/campaigns"
          onClick={onClose}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${location.pathname.startsWith('/campaigns') && location.pathname !== '/campaigns/new'
            ? 'bg-black/50 text-white'
            : 'text-gray-400 hover:text-white hover:bg-black/50'
            }`}
        >
          <Megaphone className="w-5 h-5" />
          <span>{t('common.campaign')}</span>
        </Link>

        <Link
          to="/visitors"
          onClick={onClose}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${location.pathname.startsWith('/visitors')
            ? 'bg-black/50 text-white'
            : 'text-gray-400 hover:text-white hover:bg-black/50'
            }`}
        >
          <Users className="w-5 h-5" />
          <span>{t('common.visitorsList')}</span>
        </Link>
      </nav>

      {/* User Profile, Language Toggle and Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <span className="text-gray-300">{t('common.adminUser')}</span>
        </div>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-3 text-gray-400 hover:text-white px-3 py-2 rounded-lg w-full hover:bg-black/50 transition-colors mb-2"
        >
          <Globe className="w-5 h-5" />
          <span>{t('common.language')}: {i18n.language.toUpperCase()}</span>
        </button>

        <button
          onClick={onClose}
          className="flex items-center space-x-3 text-gray-400 hover:text-white px-3 py-2 rounded-lg w-full hover:bg-black/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('common.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 