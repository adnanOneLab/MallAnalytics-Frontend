import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../assets/calendarStyles.css";
import { loadFaceDetectionModels } from '../../utils/faceDetection';
import PhotoCapture from './PhotoCapture';
import SuccessModal from '../../components/SuccessModal';
import { registerUser } from '../../services/userService';
import api from '../../services/api';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date_of_birth: null,
    address: '',
    cell_phone: '',
    interests: []
  });
  const [availableInterests, setAvailableInterests] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loadingInterests, setLoadingInterests] = useState(true);

  useEffect(() => {
    loadFaceDetectionModels();
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const response = await api.get('/interests/');
      setAvailableInterests(response.data);
    } catch (error) {
      console.error('Error fetching interests:', error);
      setError('Failed to load interests. Please try again later.');
    } finally {
      setLoadingInterests(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handlePhotoAccepted = (url, file) => {
    setPhotoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      const missingFields = [];
      if (!formData.name) missingFields.push('Name');
      if (!formData.email) missingFields.push('Email');
      if (!formData.date_of_birth) missingFields.push('Date of Birth');
      if (!photoFile) missingFields.push('Photo');

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Format date to ISO string
      const userData = {
        ...formData,
        date_of_birth: formData.date_of_birth.toISOString().split('T')[0]
      };

      console.log('Submitting registration with data:', userData);
      const response = await registerUser(userData, photoFile);
      console.log('Registration successful:', response);
      setFormData({
        name: '',
        email: '',
        date_of_birth: null,
        address: '',
        cell_phone: '',
        interests: []
      })
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-3 text-center">Registration</h2>
        <hr className="w-full border-t border-gray-300 mb-6" />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="cell_phone"
              value={formData.cell_phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2">Date of Birth *</label>
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {formData.date_of_birth ? formData.date_of_birth.toDateString() : "Select date of birth"}
            </div>
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-20 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 min-w-[280px]">
                <Calendar
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, date_of_birth: date }));
                    setShowCalendar(false);
                  }}
                  value={formData.date_of_birth}
                  className="modern-calendar"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Interests</label>
            {loadingInterests ? (
              <div className="text-sm text-gray-500">Loading interests...</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {availableInterests.map((interest) => (
                  <label key={interest.interest_id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest.name)}
                      onChange={() => handleInterestChange(interest.name)}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    <span>{interest.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photo *</label>
            <PhotoCapture onPhotoAccepted={handlePhotoAccepted} />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#192A3A] text-white p-3 rounded-lg font-medium transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1a3a4f]'
              }`}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
