import React, { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import CreateCampaignModal from "../campaigns/CreateCampaignModal";
import { useTranslation } from 'react-i18next';

export default function AddContactModal({ isOpen, onClose, selectedVisitors }) {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleCampaignCreated = (newCampaign) => {
    setIsCreateModalOpen(false);
    setCampaigns((prev) => [...prev, newCampaign]);
    setSelectedCampaign(newCampaign.campaign_id);
  };

  console.log(selectedCampaign, "selectedCampaignsd");

  const navigate = useNavigate();

  // 🟢 Fetch all campaigns on mount
  useEffect(() => {
    if (isOpen) {
      api
        .get("/campaigns/")
        .then((res) => {
          setCampaigns(res.data);
        })
        .catch((err) => {
          console.error("Error fetching campaigns:", err);
        });
    }
  }, [isOpen]);

  const handleAddContact = async () => {
    try {
      if (
        !selectedCampaign ||
        !selectedVisitors ||
        selectedVisitors.length === 0
      )
        return;

      await api.post(`/campaigns/${selectedCampaign}/add-contacts/`, {
        user_ids: selectedVisitors,
      });

      console.log("Contacts added successfully!");
      // onClose();
      setSuccess(true);
    } catch (error) {
      console.error("Failed to add contacts:", error);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 w-full max-w-md text-center relative">
          <button
            onClick={() => {
              setSuccess(false);
              onClose(); // Close main modal
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
              alt="Success"
              className="w-16 h-16"
            />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            {t('addContactModal.successTitle')}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {t('addContactModal.successMessage')}
          </p>

          <button
            onClick={() => {
              setSuccess(false);
              navigate(`/campaigns/${selectedCampaign}/manage/`);
            }}
            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            {t('addContactModal.viewCampaign')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            {t('addContactModal.title')}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            {t('addContactModal.selectSequence')}
          </p>

          {/* Email Campaign Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('addContactModal.emailCampaign')}
            </label>
            <div className="relative flex justify-center">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between bg-gray-50 text-gray-500"
              >
                {campaigns.find((c) => c.campaign_id === selectedCampaign)
                  ?.name || t('addContactModal.emailCampaign')}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {campaigns.map((campaign, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedCampaign(campaign.campaign_id);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm transition-colors"
                      >
                        {campaign.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* No campaigns message */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">{t('addContactModal.noCampaigns')}</span>
            <button
              onClick={handleCreateNew}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {t('addContactModal.createOne')}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            {t('addContactModal.cancel')}
          </button>
          <button
            onClick={handleAddContact}
            disabled={!selectedCampaign}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {t('addContactModal.addVisitors')}
          </button>
        </div>
        <CreateCampaignModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleCampaignCreated}
        />
      </div>
    </div>
  );
}
