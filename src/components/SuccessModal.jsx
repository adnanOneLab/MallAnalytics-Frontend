import React from 'react';
import successGif from '../assets/success.gif';

const SuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#EAEAEA] bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <img
            src={successGif}
            alt="Success"
            className="w-[233px] h-[233px] object-contain"
          />
        </div>

        <h3 className="text-lg font-semibold mb-1">
          Successfully registered 🎉
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Lorem ipsum dolor sit amet consectetur. Ac posuere fusce
          sollicitudin justo adipiscing. Sit mi pharetra vitae sem est orci.
        </p>
        <button
          className="w-[120px] bg-[#92A3A] text-white px-6 py-2 rounded-md"
          onClick={onClose}
        >
          ok
        </button>
      </div>
    </div>
  );
};

export default SuccessModal; 