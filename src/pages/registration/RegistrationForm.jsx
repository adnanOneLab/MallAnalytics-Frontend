import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../assets/calendarStyles.css";
import { loadFaceDetectionModels } from '../../utils/faceDetection';
import PhotoCapture from './PhotoCapture';
import SuccessModal from '../../components/SuccessModal';

const RegistrationForm = () => {
  const [dob, setDob] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    loadFaceDetectionModels();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);
  };

  const handlePhotoAccepted = (url) => {
    // Store the photo URL for form submission if needed
    console.log('Photo accepted:', url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-3 text-center">Registration</h2>
        <hr className="w-full border-t border-gray-300 mb-6" />

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {dob ? dob.toDateString() : "Select date of birth"}
            </div>
            {showCalendar && (
              <div className="mt-2 absolute z-10 bg-white p-2 rounded-lg shadow-lg">
                <Calendar
                  onChange={(date) => {
                    setDob(date);
                    setShowCalendar(false);
                  }}
                  value={dob}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Interests</label>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {["Sports", "Clothing", "Food", "Fitness", "Electronics", "Books", "Beauty", "Home"].map(
                (interest, idx) => (
                  <label key={idx} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                    <span>{interest}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photo</label>
            <PhotoCapture onPhotoAccepted={handlePhotoAccepted} />
          </div>

          <button
            type="submit"
            className="w-full bg-[#192A3A] text-white py-3 rounded-lg font-medium hover:bg-[#1a3a4f] transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
