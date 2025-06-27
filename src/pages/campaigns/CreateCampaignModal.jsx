import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";

export default function CreateCampaignModal({ isOpen, onClose, onCreated }) {
  const [campaignName, setCampaignName] = useState("");

  const handleCreate = async () => {
    try {
      const res = await api.post("api/campaigns/", { name: campaignName });
      onCreated(res.data); // send new campaign data up
      setCampaignName("");
    } catch (err) {
      console.error("Failed to create campaign:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Create Email Campaign</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />

        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
