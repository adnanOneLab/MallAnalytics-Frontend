import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import api from '../../services/api';

export default function CreateEmailCampaignModal({ isOpen, onClose }) {
  const [campaignName, setCampaignName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedBusinessHourLabel, setSelectedBusinessHourLabel] = useState('');
  const [selectedBusinessHourId, setSelectedBusinessHourId] = useState(null);
  console.log(selectedBusinessHourLabel,'selectedBusinessHourLabelas');
  
  const staticBusinessHours = [
    {
      id: 1,
      label: 'Standard Business Hours',
      hours: [
        { day: 'Monday', start: '08:00', end: '17:00' },
        { day: 'Tuesday', start: '08:00', end: '17:00' },
        { day: 'Wednesday', start: '08:00', end: '17:00' },
        { day: 'Thursday', start: '08:00', end: '17:00' },
        { day: 'Friday', start: '08:00', end: '17:00' },
      ],
    },
    {
      id: 2,
      label: 'Extended Hours',
      hours: [
        { day: 'Monday', start: '07:00', end: '19:00' },
        { day: 'Tuesday', start: '07:00', end: '19:00' },
        { day: 'Wednesday', start: '07:00', end: '19:00' },
        { day: 'Thursday', start: '07:00', end: '19:00' },
        { day: 'Friday', start: '07:00', end: '19:00' },
      ],
    },
    {
      id: 3,
      label: 'Weekend Hours',
      hours: [
        { day: 'Saturday', start: '10:00', end: '16:00' },
        { day: 'Sunday', start: '10:00', end: '16:00' },
      ],
    },
  ];

  // useEffect(() => {
  //   if (isOpen) {
  //     api.get('/business-hours/')
  //       .then((res) => setBusinessHoursList(res.data))
  //       .catch((err) => console.error('Error fetching business hours:', err));
  //   }
  // }, [isOpen]);

  const handleCreateCampaign = async () => {
    try {
      const payload = {
        name: campaignName,
        business_hours: [selectedBusinessHourId],
        is_active: false
      };
      const res = await api.post('api/campaigns/', payload);
      console.log('Campaign created:', res.data);
      onClose();
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  const selectedHours = staticBusinessHours.find(
    (hour) => hour.id === selectedBusinessHourId
  );


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
                <span>{'Select Business Hours'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {staticBusinessHours.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedBusinessHourId(item.id);
                          setSelectedBusinessHourLabel(item.label);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Display Selected Hours */}
          {/* Display Selected Hours */}
          {selectedHours && (
            <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-700">
              {selectedHours.hours.map((h, index) => (
                <div key={index} className="flex justify-between">
                  <span>{h.day}:</span>
                  <span>{h.start} - {h.end}</span>
                </div>
              ))}
            </div>
          )}
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