import React, { useEffect, useState } from "react";
import { Search, Moon, Bell, Plus, Trash2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Layout from "../../components/Layout";
import EmailModal from "./EmailModal";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CampaignTable() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [campaigns, setCampaigns] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [campaignStats, setCampaignStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(3); // default fallback
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Fetch campaigns on mount
  useEffect(() => {
    fetchCampaigns(page);
  }, [isEmailModalOpen, page]);

  useEffect(() => {
    if (campaigns?.length > 0) {
      fetchAllCampaignStats();
    }
    // eslint-disable-next-line
  }, [campaigns]);

  const fetchCampaigns = async (pageNum = page) => {
    try {
      setLoading(true);
      const res = await api.get(`api/campaigns/?page=${pageNum}`);
      setCampaigns(res.data.results);
      setCount(res.data.count);
      setPageSize(res.data.page_size || 3);
      setTotalPages(Math.ceil(res.data.count / (res.data.page_size || 3)));
    } catch (error) {
      console.error(t("campaigns.fetchError"), error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch and aggregate stats for all campaigns
  const fetchAllCampaignStats = async () => {
    const statsByCampaign = {};
    for (const campaign of campaigns) {
      let delivered = 0, opens = 0, bounces = 0, scheduled = 0;
      try {
        const stepsRes = await api.get(`api/campaigns/${campaign.campaign_id}/steps/`);
        const steps = stepsRes.data;
        for (const step of steps) {
          if (step.sendgrid_campaign_id) {
            try {
              const statsRes = await api.get(`api/steps/${step.id}/sendgrid-stats/`);
              const stats = statsRes.data.results && statsRes.data.results.length > 0 ? statsRes.data.results[0].stats : null;
              if (stats) {
                delivered += Number(stats.delivered) || 0;
                opens += Number(stats.opens) || 0;
                bounces += Number(stats.bounces) || 0;
                scheduled += Number(stats.requests) || 0;
              }
            } catch (e) {
              // Ignore step stats fetch error
            }
          }
        }
      } catch (e) {
        // Ignore steps fetch error
      }
      statsByCampaign[campaign.campaign_id] = { delivered, opens, bounces, scheduled };
    }
    setCampaignStats(statsByCampaign);
  };

  // 🔹 Toggle active status
  const toggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`api/campaigns/${id}/toggle/`, {
        is_active: !currentStatus,
      });
      fetchCampaigns(page);
    } catch (err) {
      console.error(t("campaigns.toggleError"), err);
    }
  };

  // 🔹 Delete campaign
  const handleDeleteClick = (id) => {
    setCampaignToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`api/campaigns/${campaignToDelete}/`);
      fetchCampaigns(page);
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setCampaignToDelete(null);
    }
  };

  const cancelDeleteCampaign = () => {
    setShowDeleteModal(false);
    setCampaignToDelete(null);
  };

  return (
    <Layout>
      <div className="px-6 py-6">
        {/* Header with Search */}
        <div className="bg-white px-6 py-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {"Campaigns"}
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={
                  t("campaigns.searchPlaceholder") || "Search by name..."
                }
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />
        <div className="bg-white rounded-lg shadow-sm">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {t("campaigns.showing")}{" "}
                <span className="font-medium text-gray-900">
                  {campaigns.length}
                </span>{" "}
                {t("campaigns.campaigns")}
              </div>
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
                onClick={() => setIsEmailModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span>{t("campaigns.newCampaign")}</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("campaigns.tableHeaders.campaignName")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("campaigns.tableHeaders.emailsDelivered")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("campaigns.tableHeaders.emailsOpened")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("campaigns.tableHeaders.emailsBounced")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("campaigns.tableHeaders.emailsScheduled")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("campaigns.tableHeaders.active")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("campaigns.tableHeaders.action")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
                      </div>
                    </td>
                  </tr>
                ) : campaigns?.length > 0 ? (
                  // campaigns.map((campaign, index) => {
                  campaigns
                    .filter((c) =>
                      c.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((campaign, index) => {
                      const stats = campaignStats[campaign.campaign_id];
                      return (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            {/* <div className="flex items-center">
                            <span className="text-sm font-semibold text-black">
                              {index+1}
                            </span>
                            <span
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                              onClick={() =>
                                navigate(
                                  `/campaigns/${campaign.campaign_id}/manage`
                                )
                              }
                            >
                              {campaign.name}
                            </span>
                          </div> */}
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-black">
                                {index + 1}.
                              </span>
                              <span
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                                onClick={() =>
                                  navigate(
                                    `/campaigns/${campaign.campaign_id}/manage`
                                  )
                                }
                              >
                                {campaign.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {stats
                              ? stats.delivered
                              : campaign.sendgrid_list_id
                              ? "..."
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {stats
                              ? stats.opens
                              : campaign.sendgrid_list_id
                              ? "..."
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {stats
                              ? stats.bounces
                              : campaign.sendgrid_list_id
                              ? "..."
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {stats
                              ? stats.scheduled
                              : campaign.sendgrid_list_id
                              ? "..."
                              : "-"}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                toggleActive(
                                  campaign.campaign_id,
                                  campaign.is_active
                                )
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                campaign.is_active
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  campaign.is_active
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleDeleteClick(campaign.campaign_id)
                              }
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      {t("campaigns.noCampaignsFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span> ({count} total, {pageSize} per page)
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Campaign Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Delete Campaign</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this campaign? This will also delete all steps and the SendGrid list. This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteCampaign}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCampaign}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center justify-center min-w-[90px]"
                disabled={deleting}
              >
                {deleting ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
