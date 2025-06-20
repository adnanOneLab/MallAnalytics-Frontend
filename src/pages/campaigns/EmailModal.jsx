import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

export default function CreateEmailCampaignModal({ isOpen, onClose }) {
  const [campaignName, setCampaignName] = useState('');
  const [selectedBusinessHours, setSelectedBusinessHours] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const businessHoursOptions = [
    'Standard Business Hours (9 AM - 5 PM)',
    'Extended Hours (8 AM - 6 PM)',
    'All Day (24/7)',
    'Custom Hours'
  ];

  const handleCreateCampaign = () => {
    // Handle campaign creation logic here
    console.log('Creating campaign:', { campaignName, selectedBusinessHours });
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-blue-300">
          <h2 className="text-lg font-medium text-gray-900">Create New Email Campaign</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please enter the name of the new Email Campaign and the hours when you want to reach your contacts.
          </p>

          {/* Email Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Campaign name
            </label>
            <input
              type="text"
              placeholder="Type Email Campaign name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>

          {/* Business Hours Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Hours
            </label>
            <div className="relative flex justify-center">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between text-gray-500 bg-white hover:bg-gray-50 transition-colors"
              >
                <span>{selectedBusinessHours || 'Select Business Hours'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {businessHoursOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedBusinessHours(option);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Hours Display */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Business Hours</h3>
            <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between">
                <span>Monday:</span>
                <span>08:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Tuesday:</span>
                <span>08:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Wednesday:</span>
                <span>08:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Thursday:</span>
                <span>08:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Friday:</span>
                <span>08:00 - 17:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
          <button 
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreateCampaign}
            disabled={!campaignName.trim()}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Create Email Campaign
          </button>
        </div>
      </div>
    </div>
  );
}