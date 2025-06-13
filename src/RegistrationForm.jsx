import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../src/assets/calendarStyles.css";
import successGif from '../src/assets/success.gif';
const RegistrationForm = () => {
  const [dob, setDob] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessModal(true); // Show modal on submit
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      {/* Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#EAEAEA] bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            {/* Icon */}
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
              onClick={() => setShowSuccessModal(false)}
            >
              ok
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="w-full max-w-md bg-white rounded-xl shadow h-[90vh] overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-1">Registration</h2>
        <hr className="w-full border-t border-gray-300 mb-4" />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm cursor-pointer"
            >
              {dob ? dob.toDateString() : "Enter date of birth"}
            </div>
            {showCalendar && (
              <div className="mt-2">
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
            <label className="block text-sm font-medium mb-1">Interests</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {["Sports", "Clothing", "Food", "Fitness"].map(
                (interest, idx) => (
                  <label key={idx} className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox h-4 w-4" />
                    <span>{interest}</span>
                  </label>
                )
              )}
              {["Sports", "Clothing", "Food", "Fitness"].map(
                (interest, idx) => (
                  <label key={idx + 4} className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox h-4 w-4" />
                    <span>{interest}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Video
            </label>
            <input
              type="file"
              accept="video/*"
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm file:border-0 file:bg-gray-300 file:py-1 file:px-2 file:rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#192A3A] text-white py-2 rounded-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
