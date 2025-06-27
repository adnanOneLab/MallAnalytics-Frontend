import React from 'react';

const LoadingComponent = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white flex flex-col items-center gap-6 p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" aria-label="Loading..." aria-busy="true"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 animate-fade-in">
            Welcome to WISE Video
          </h2>
          <p className="text-gray-500 animate-slide-up text-base md:text-lg">
            Preparing your intelligent workspace...
          </p>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slide-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingComponent; 