import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../assets/calendarStyles.css";
import { loadFaceDetectionModels } from "../../utils/faceDetection";
import PhotoCapture from "./PhotoCapture";
import { registerUser } from "../../services/userService";
// import api from '../../services/api';
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import api from "../../services/api";

const RegistrationForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: null,
    address: "",
    cell_phone: "",
    interests: [],
  });
  const [availableInterests, setAvailableInterests] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [photoKey, setPhotoKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    loadFaceDetectionModels();
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const response = await api.get("api/interests/");
      setAvailableInterests(response.data);
    } catch (error) {
      console.error("Error fetching interests:", error);
      setError("Failed to load interests. Please try again later.");
    } finally {
      setLoadingInterests(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Clear general error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleInterestChange = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handlePhotoAccepted = (url, file) => {
    setPhotoFile(file);
    // Clear photo error when photo is selected
    if (formErrors.photo) {
      setFormErrors((prev) => ({
        ...prev,
        photo: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      const missingFields = [];
      if (!formData.name) missingFields.push("Name");
      if (!formData.email) missingFields.push("Email");
      if (!formData.date_of_birth) missingFields.push("Date of Birth");
      if (!photoFile) missingFields.push("Photo");

      if (missingFields.length > 0) {
        // Set field-specific errors for missing fields
        const fieldErrors = {};
        if (!formData.name)
          fieldErrors.name = [t("registration.validation.name_required")];
        if (!formData.email)
          fieldErrors.email = [t("registration.validation.email_required")];
        if (!formData.date_of_birth)
          fieldErrors.date_of_birth = [
            t("registration.validation.dob_required"),
          ];
        if (!photoFile)
          fieldErrors.photo = [t("registration.validation.photo_required")];

        setFormErrors(fieldErrors);
        throw new Error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Format date to ISO string
      const userData = {
        ...formData,
        date_of_birth: formData.date_of_birth.toISOString().split("T")[0],
      };

      console.log("Submitting registration with data:", userData);
      const response = await registerUser(userData, photoFile);
      console.log("Registration successful:", response);

      // Reset form data
      setFormData({
        name: "",
        email: "",
        date_of_birth: null,
        address: "",
        cell_phone: "",
        interests: [],
      });

      // Reset photo and force PhotoCapture re-render
      setPhotoFile(null);
      setPhotoKey((prev) => prev + 1);

      // Clear any errors
      setError(null);
      setFormErrors({});

      // Navigate to success page with user ID
      navigate(`/registration-success/${response.user_id}`);
    } catch (error) {
      console.error("Registration error:", error);

      // Check if it's a validation error with field-specific errors
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === "object"
      ) {
        const data = error.response.data;

        // Set field-specific errors
        setFormErrors(data);

        // Also show the first error at the top
        const firstField = Object.keys(data)[0];
        const message = Array.isArray(data[firstField])
          ? data[firstField][0]
          : data[firstField];
        setError(message || "Validation failed. Please check your input.");
      } else {
        // Handle errors thrown by userService (these are regular Error objects with messages)
        setError(
          error.message || "An unexpected error occurred. Please try again."
        );

        // Clear any previous field-specific errors
        setFormErrors({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg h-[90vh] overflow-y-auto p-6">
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>
        <h2 className="text-xl font-semibold mb-3 text-center">
          {t("registration.title")}
        </h2>
        <hr className="w-full border-t border-gray-300 mb-6" />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("registration.name")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {formErrors.name && (
              <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formErrors.name[0]}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("registration.email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {formErrors.email && (
              <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formErrors.email[0]}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("registration.phone")} *
            </label>
            <input
              type="tel"
              name="cell_phone"
              value={formData.cell_phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {formErrors.cell_phone && (
              <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formErrors.cell_phone[0]}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("registration.address")} *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              {t("registration.dob")} *
            </label>
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {formData.date_of_birth
                ? formData.date_of_birth.toDateString()
                : t("registration.select_date")}
            </div>
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-20 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 min-w-[280px]">
                <Calendar
                  onChange={(date) => {
                    setFormData((prev) => ({ ...prev, date_of_birth: date }));
                    setShowCalendar(false);
                    // Clear date of birth error when user selects a date
                    if (formErrors.date_of_birth) {
                      setFormErrors((prev) => ({
                        ...prev,
                        date_of_birth: null,
                      }));
                    }
                  }}
                  value={formData.date_of_birth}
                  className="modern-calendar"
                />
              </div>
            )}
            {formErrors.date_of_birth && (
              <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formErrors.date_of_birth[0]}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("registration.interests")}
            </label>
            {loadingInterests ? (
              <div className="text-sm text-gray-500">
                {t("registration.loading_interests")}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {availableInterests.map((interest) => (
                  <label
                    key={interest.interest_id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md"
                  >
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
            <label className="block text-sm font-medium mb-2">
              {t("registration.photo")} *
            </label>
            <PhotoCapture
              key={photoKey}
              onPhotoAccepted={handlePhotoAccepted}
              photoError={formErrors.photo ? formErrors.photo[0] : null}
            />
            {formErrors.photo && (
              <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formErrors.photo[0]}</span>
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#192A3A] text-white p-3 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#1a3a4f]"
              }`}
            >
              {isSubmitting
                ? t("registration.registering")
                : t("registration.register")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
