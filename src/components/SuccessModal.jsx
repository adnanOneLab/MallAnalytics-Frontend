import React from 'react';
import successGif from '../assets/success.gif';
import { Check } from 'lucide-react';

const SuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
        <div className="flex justify-center mb-6">
          <img
            src={successGif}
            alt="Success"
            className="w-[180px] h-[180px] object-contain"
          />
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-2 rounded-full">
            <Check className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Registration Successful!
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Thank you for registering with us. Your account has been created successfully. 
          You can now enjoy personalized shopping experiences and track your mall visits.
        </p>
        <button
          className="w-full bg-[#192A3A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1a3a4f] transition-colors"
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SuccessModal; 