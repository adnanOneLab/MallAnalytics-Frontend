import React from 'react';

const CameraGuide = ({ onClose, onStartCamera }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">Camera Guide</h3>
        
        {/* Face Frame Guide */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-blue-500 font-medium text-center">
              Keep face within this frame
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm">1</span>
            </div>
            <p className="text-sm text-gray-600">Position your face within the blue frame</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm">2</span>
            </div>
            <p className="text-sm text-gray-600">Ensure good lighting on your face</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm">3</span>
            </div>
            <p className="text-sm text-gray-600">Look directly at the camera</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm">4</span>
            </div>
            <p className="text-sm text-gray-600">Remove any face coverings or sunglasses</p>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onStartCamera}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Open Camera
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraGuide; 