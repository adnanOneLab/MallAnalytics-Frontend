import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogOut } from 'lucide-react';

const UserAccessDenied = ({ email, name }) => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          User <span className="font-bold">{name || email}</span> does not have access to this application.
        </p>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-md hover:bg-gray-900 transition-colors text-base font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserAccessDenied; 