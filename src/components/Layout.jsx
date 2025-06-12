import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 bg-white">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout; 