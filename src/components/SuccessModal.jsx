import React from 'react';
import { Check } from 'lucide-react';

const SuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs mx-auto text-center overflow-hidden">
        {/* Content Container */}
        <div className="p-6 sm:p-8">
          {/* Animated Success Icon with Floating Dots */}
          <div className="flex justify-center mb-6 sm:mb-8 relative">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              {/* Floating Dots Animation */}
              <div className="absolute inset-0">
                {/* Blue dots */}
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{top: '10%', left: '50%', animationDelay: '0s'}}></div>
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{top: '25%', left: '25%', animationDelay: '0.2s'}}></div>
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{top: '30%', left: '75%', animationDelay: '0.4s'}}></div>
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{top: '45%', left: '15%', animationDelay: '0.6s'}}></div>
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{top: '55%', left: '85%', animationDelay: '0.8s'}}></div>
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{top: '70%', left: '20%', animationDelay: '1s'}}></div>
                <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{top: '75%', left: '65%', animationDelay: '1.2s'}}></div>
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{top: '85%', left: '45%', animationDelay: '1.4s'}}></div>
                
                {/* Dark dots */}
                <div className="absolute w-2 h-2 bg-gray-700 rounded-full animate-bounce" style={{top: '35%', right: '10%', animationDelay: '0.3s'}}></div>
                <div className="absolute w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{top: '60%', right: '15%', animationDelay: '0.7s'}}></div>
                <div className="absolute w-2 h-2 bg-gray-700 rounded-full animate-bounce" style={{top: '80%', right: '35%', animationDelay: '1.1s'}}></div>
              </div>
              
              {/* Central Success Badge */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Star-like background shape */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded-full flex items-center justify-center relative overflow-hidden">
                    {/* Star points using pseudo-elements simulation */}
                    <div className="absolute inset-0 bg-gray-800 transform rotate-45 rounded-lg"></div>
                    <div className="absolute inset-0 bg-gray-800 transform -rotate-45 rounded-lg"></div>
                    <div className="absolute inset-2 bg-gray-800 rounded-full z-10"></div>
                    
                    {/* Check mark */}
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-20" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message with Emoji */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4">
              Successfully registered 🎉
            </h3>
            
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
            Thank you for registering with us. Your account has been created successfully. 
            You can now enjoy personalized shopping experiences and track your mall visits.
            </p>
          </div>

          {/* OK Button */}
          <button
            className="w-full bg-gray-800 text-white px-6 py-3 sm:py-4 rounded-lg font-medium hover:bg-gray-900 active:bg-gray-700 transition-all duration-200 text-sm sm:text-base min-h-[48px] focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal; 