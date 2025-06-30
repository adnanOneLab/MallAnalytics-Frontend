import React from "react";

const DuplicateStepModal = ({ open, stepOrder, message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Duplicate Step</h2>
        <p className="mb-6 text-gray-700">
          {message ? message : (
            <>Step <span className="font-bold">{stepOrder}</span> already exists. Please choose a different step order or delete the existing step first.</>
          )}
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-600"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateStepModal; 