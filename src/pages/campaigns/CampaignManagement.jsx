import React, { useEffect, useState } from "react";
import { Search, Plus, Trash2, MoreVertical } from "lucide-react";
import Layout from "../../components/Layout";
import ContactsTab from "../campaigns/tabs/ContactsTab";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import {
  getCampaignSteps,
  createCampaignStep,
  updateCampaignStep,
  deleteCampaignStep,
  scheduleCampaignStep,
  getSendGridSenders,
  getSuppressionGroups,
} from '../../services/api';
import StepModal from './StepModal';

const CampaignManagement = () => {
  const [activeTab, setActiveTab] = useState("emails");
  const [searchTerm, setSearchTerm] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [steps, setSteps] = useState([]);
  const [stepsLoading, setStepsLoading] = useState(true);
  const [showStepModal, setShowStepModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [stepForm, setStepForm] = useState({ subject: '', body: '', send_at: '', step_order: 1 });
  const { id } = useParams();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleStep, setScheduleStep] = useState(null);
  const [senders, setSenders] = useState([]);
  const [selectedSender, setSelectedSender] = useState('');
  const [suppressionGroups, setSuppressionGroups] = useState([]);
  const [selectedSuppressionGroup, setSelectedSuppressionGroup] = useState('');
  const [stepStats, setStepStats] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [addStepLoading, setAddStepLoading] = useState(false);

  // Fetch campaign steps
  useEffect(() => {
    if (id) fetchSteps();
  }, [id]);

  const fetchSteps = async () => {
    setStepsLoading(true);
    try {
      const res = await getCampaignSteps(id);
      setSteps(res.data);
    } catch (error) {
      console.error('Error fetching steps:', error);
    } finally {
      setStepsLoading(false);
    }
  };

  // Fetch senders for step modal
  const fetchSenders = async () => {
    try {
      const res = await getSendGridSenders();
      setSenders(res.data);
    } catch (error) {
      setSenders([]);
    }
  };

  const fetchSuppressionGroups = async () => {
    try {
      const res = await getSuppressionGroups();
      setSuppressionGroups(res.data);
    } catch (error) {
      setSuppressionGroups([]);
    }
  };

  const handleStepFormChange = (e) => {
    setStepForm({ ...stepForm, [e.target.name]: e.target.value });
  };

  const handleAddStep = async () => {
    setAddStepLoading(true);
    setEditingStep(null);
    setStepForm({ subject: '', body: '', send_at: '', step_order: steps.length + 1 });
    setSelectedSender('');
    setSelectedSuppressionGroup('');
    await fetchSenders();
    await fetchSuppressionGroups();
    setShowStepModal(true);
    setAddStepLoading(false);
  };

  const handleSenderChange = (e) => {
    setSelectedSender(e.target.value);
  };

  const handleSuppressionGroupChange = (e) => {
    setSelectedSuppressionGroup(e.target.value);
  };

  const handleDeleteStep = async (stepId) => {
    if (!window.confirm('Delete this step?')) return;
    try {
      await deleteCampaignStep(id, stepId);
      fetchSteps();
    } catch (error) {
      alert('Failed to delete step');
    }
  };

  const handleStepFormSubmit = async (payload) => {
    try {
      if (editingStep) {
        await updateCampaignStep(id, editingStep.id, payload);
      } else {
        await createCampaignStep(id, payload);
      }
      setShowStepModal(false);
      fetchSteps();
    } catch (error) {
      alert('Failed to save step');
    }
  };

  const handleScheduleStep = async (step) => {
    setScheduleStep(step);
    setShowScheduleModal(true);
    setSelectedSender('');
    try {
      const res = await getSendGridSenders();
      setSenders(res.data);
    } catch (error) {
      setSenders([]);
      alert('Failed to fetch senders');
    }
  };

  const handleConfirmSchedule = async () => {
    if (!selectedSender) {
      alert('Please select a sender');
      return;
    }
    try {
      await scheduleCampaignStep(scheduleStep.id, { sender_id: selectedSender });
      alert('Step scheduled!');
      setShowScheduleModal(false);
      setScheduleStep(null);
      fetchSteps();
    } catch (error) {
      alert('Failed to schedule step');
    }
  };

  // Fetch SendGrid stats for each step
  useEffect(() => {
    const fetchStats = async () => {
      const statsObj = {};
      for (const step of steps) {
        if (step.sendgrid_campaign_id) {
          try {
            const res = await api.get(`/steps/${step.id}/sendgrid-stats/`);
            // The API returns an array in results
            const stats = res.data.results && res.data.results.length > 0 ? res.data.results[0].stats : null;
            statsObj[step.id] = stats || null;
          } catch (e) {
            statsObj[step.id] = null;
          }
        }
      }
      setStepStats(statsObj);
    };
    if (steps.length > 0) fetchStats();
  }, [steps]);

  const getAggregateStats = () => {
    let delivered = 0, opens = 0, bounces = 0, requests = 0;
    Object.values(stepStats).forEach(stats => {
      if (stats) {
        delivered += Number(stats.delivered) || 0;
        opens += Number(stats.opens) || 0;
        bounces += Number(stats.bounces) || 0;
        requests += Number(stats.requests) || 0;
      }
    });
    return { delivered, opens, bounces, requests };
  };

  const Header = () => (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">{campaignName}</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">A</span>
        </div>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="bg-white border-b border-gray-200">
      <div className="flex space-x-8 px-6">
        <button
          onClick={() => setActiveTab("emails")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "emails"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Emails
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "contacts"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Visitors
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "settings"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Settings
        </button>
      </div>
    </div>
  );

  const EmailsTab = () => {
    const aggregate = getAggregateStats();
    return (
      <div className="p-6">
        {/* Aggregate Stats Card */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-wrap gap-6 items-center">
            <div className="text-lg font-semibold text-blue-800 mr-6">Campaign Stats</div>
            <div className="text-sm text-gray-700">Delivered: <span className="font-bold">{aggregate.delivered}</span></div>
            <div className="text-sm text-gray-700">Opens: <span className="font-bold">{aggregate.opens}</span></div>
            <div className="text-sm text-gray-700">Bounces: <span className="font-bold">{aggregate.bounces}</span></div>
            <div className="text-sm text-gray-700">Requests: <span className="font-bold">{aggregate.requests}</span></div>
          </div>
        </div>
        <div className="flex justify-end mb-6">
          <button
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${!isActive ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' : ''}`}
            onClick={handleAddStep}
            disabled={!isActive || addStepLoading}
            title={!isActive ? 'This campaign is inactive. Activate it to add steps.' : ''}
          >
            {addStepLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Adding...
              </span>
            ) : (
              'Add Step'
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="grid grid-cols-11 gap-4 p-4 text-sm font-medium text-gray-700 bg-gray-50">
              <div className="col-span-1 flex items-center">Step Order</div>
              <div className="col-span-2 flex items-center">Subject</div>
              <div className="col-span-3 flex items-center">Body</div>
              <div className="col-span-1 flex items-center">Send At</div>
              <div className="col-span-1 flex items-center justify-center">SendGrid</div>
              <div className="col-span-2 flex items-center justify-center">Stats</div>
              <div className="col-span-1 flex items-center justify-center">Actions</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {stepsLoading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : steps.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No steps found.</div>
            ) : (
              steps.map((step) => {
                const stats = stepStats[step.id];
                const scheduleDisabled = !!step.sendgrid_campaign_id || !isActive;
                return (
                  <div key={step.id} className="grid grid-cols-11 gap-4 p-4 hover:bg-gray-50 items-center">
                    <div className="col-span-1 flex items-center">
                      <span className="font-medium">{step.step_order}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className="truncate" title={step.subject}>{step.subject}</span>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className="text-sm text-gray-600 line-clamp-2" title={step.body}>
                        {step.body}
                      </span>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm">
                        {step.send_at ? new Date(step.send_at).toLocaleDateString() : 'Not scheduled'}
                      </span>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          step.sendgrid_campaign_id
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : !isActive
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                        onClick={() => handleScheduleStep(step)}
                        disabled={scheduleDisabled}
                        title={
                          !isActive
                            ? 'This campaign is inactive. Activate it to schedule steps.'
                            : step.sendgrid_campaign_id
                              ? 'Already scheduled.'
                              : ''
                        }
                      >
                        {step.sendgrid_campaign_id ? 'Scheduled' : 'Schedule'}
                      </button>
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Delivered: {stats ? stats.delivered ?? '-' : step.sendgrid_campaign_id ? '...' : '-'}</div>
                        <div>Opens: {stats ? stats.opens ?? '-' : step.sendgrid_campaign_id ? '...' : '-'}</div>
                        <div>Bounces: {stats ? stats.bounces ?? '-' : step.sendgrid_campaign_id ? '...' : '-'}</div>
                        <div>Requests: {stats ? stats.requests ?? '-' : step.sendgrid_campaign_id ? '...' : '-'}</div>
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-center space-x-1">
                      <button 
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" 
                        onClick={() => handleDeleteStep(step.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Select Sender</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Sender</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={selectedSender}
                  onChange={e => setSelectedSender(e.target.value)}
                >
                  <option value="">Select a sender</option>
                  {senders.map(sender => (
                    <option key={sender.id} value={sender.id}>
                      {sender.nickname || sender.from?.email || sender.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors" 
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" 
                  onClick={handleConfirmSchedule}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SettingsTab = () => (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Campaign Settings
        </h3>
        <p className="text-gray-600">Settings content would go here...</p>
      </div>
    </div>
  );

  // Fetch campaign name and is_active on load
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await api.get(`/campaigns/${id}/`);
        setCampaignName(res.data.name || "Campaign");
        setIsActive(res.data.is_active !== undefined ? res.data.is_active : true);
      } catch (error) {
        console.error("Failed to load campaign", error);
        setCampaignName("Campaign");
        setIsActive(true);
      }
    };
    fetchCampaign();
  }, [id]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <TabNavigation />
        <div className="flex-1 overflow-auto">
          {activeTab === "emails" && <EmailsTab />}
          {activeTab === "contacts" && <ContactsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
        <StepModal
          open={showStepModal}
          onClose={() => setShowStepModal(false)}
          onSubmit={handleStepFormSubmit}
          form={stepForm}
          onChange={handleStepFormChange}
          editing={!!editingStep}
          senders={senders}
          selectedSender={selectedSender}
          onSenderChange={handleSenderChange}
          suppressionGroups={suppressionGroups}
          selectedSuppressionGroup={selectedSuppressionGroup}
          onSuppressionGroupChange={handleSuppressionGroupChange}
        />
      </div>
    </Layout>
  );
};

export default CampaignManagement;