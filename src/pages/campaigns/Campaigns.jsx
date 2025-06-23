import React, { useEffect, useState } from "react";
import { Search, Moon, Bell, Plus, Trash2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Layout from "../../components/Layout";
import EmailModal from "./EmailModal";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function CampaignTable() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // 🔹 Fetch campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, [isEmailModalOpen]);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/campaigns/");
      setCampaigns(res.data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  // 🔹 Toggle active status
  const toggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/campaigns/${id}/toggle/`, {
        is_active: !currentStatus,
      });
      fetchCampaigns();
    } catch (err) {
      console.error("Failed to toggle active status:", err);
    }
  };

  // 🔹 Delete campaign
  const deleteCampaign = async (id) => {
    try {
      await api.delete(`/campaigns/${id}/`);
      fetchCampaigns();
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    }
  };

  return (
    <Layout>
      <div className="px-6 py-6">
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />
        <div className="bg-white rounded-lg shadow-sm">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {campaigns.length}
                </span>{" "}
                Campaigns
              </div>
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
                onClick={() => setIsEmailModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emails Delivered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emails Opened
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emails Bounced
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emails Scheduled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="hover:bg-gray-50"
                    onClick={() =>
                      navigate(`/campaigns/${campaign.campaign_id}/manage`)
                    }
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-3"
                        />
                        <span className="text-sm text-gray-900 max-w-xs truncate">
                          {campaign.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {campaign.delivered}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {campaign.opened}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      0{campaign.bounced}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      0{campaign.scheduled}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          toggleActive(campaign.campaign_id, campaign.is_active)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          campaign.active ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            campaign.active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteCampaign(campaign.campaign_id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
