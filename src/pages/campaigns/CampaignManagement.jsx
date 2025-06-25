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

  const handleStepFormChange = (e) => {
    setStepForm({ ...stepForm, [e.target.name]: e.target.value });
  };

  const handleAddStep = async () => {
    setEditingStep(null);
    setStepForm({ subject: '', body: '', send_at: '', step_order: steps.length + 1 });
    setSelectedSender('');
    await fetchSenders();
    setShowStepModal(true);
  };

  const handleEditStep = async (step) => {
    setEditingStep(step);
    setStepForm({
      subject: step.subject,
      body: step.body,
      send_at: step.send_at ? step.send_at.slice(0, 16) : '',
      step_order: step.step_order,
    });
    setSelectedSender(step.sender_id || '');
    await fetchSenders();
    setShowStepModal(true);
  };

  const handleSenderChange = (e) => {
    setSelectedSender(e.target.value);
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

  const handleStepFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...stepForm, sender_id: selectedSender };
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

  // Sample data for contacts
  const contacts = [
    {
      id: 1,
      name: "Alice Johnson",
      title: "Project Manager",
      organization: "Tech Innovations",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      phone: "(415) 555-0198",
      email: "alice.johnson@techinnovations.com",
      group: "Example Group 1",
    },
    {
      id: 2,
      name: "Bob Smith",
      title: "Lead Developer",
      organization: "Creative Solutions",
      city: "New York",
      state: "NY",
      country: "USA",
      phone: "(212) 555-0142",
      email: "bob.smith@creativesolutions.com",
      group: "",
    },
    {
      id: 3,
      name: "Catherine Lee",
      title: "UX Designer",
      organization: "Visual Works",
      city: "Austin",
      state: "TX",
      country: "USA",
      phone: "(512) 555-0175",
      email: "catherine.lee@visualworks.com",
      group: "",
    },
    {
      id: 4,
      name: "David Brown",
      title: "Marketing Specialist",
      organization: "Market Savvy",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      phone: "(310) 555-0234",
      email: "david.brown@marketsavvy.com",
      group: "Example Group 1",
    },
    {
      id: 5,
      name: "Eva Green",
      title: "HR Manager",
      organization: "People First",
      city: "Chicago",
      state: "IL",
      country: "USA",
      phone: "(312) 555-0123",
      email: "eva.green@peoplefirst.com",
      group: "Example Group 1",
    },
    {
      id: 6,
      name: "Frank White",
      title: "Data Analyst",
      organization: "Data Driven",
      city: "Seattle",
      state: "WA",
      country: "USA",
      phone: "(206) 555-0180",
      email: "frank.white@datadriven.com",
      group: "",
    },
    {
      id: 7,
      name: "Grace Kim",
      title: "Business Analyst",
      organization: "Insightful Consulting",
      city: "Denver",
      state: "CO",
      country: "USA",
      phone: "(720) 555-0190",
      email: "grace.kim@insightfulconsulting.com",
      group: "",
    },
    {
      id: 8,
      name: "Henry Adams",
      title: "Content Strategist",
      organization: "Content Creators",
      city: "Miami",
      state: "FL",
      country: "USA",
      phone: "(305) 555-0210",
      email: "henry.adams@contentcreators.com",
      group: "",
    },
    {
      id: 9,
      name: "Ivy Chen",
      title: "SEO Specialist",
      organization: "Search Wizards",
      city: "Boston",
      state: "MA",
      country: "USA",
      phone: "(617) 555-0156",
      email: "ivy.chen@searchwizards.com",
      group: "",
    },
  ];

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredContacts, "filteredContactssdfdf");

  const Header = () => (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">
        Campaign-{campaignName}
      </h1>
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

  const EmailsTab = () => (
    <div className="p-6">
      <div className="flex justify-end mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={handleAddStep}>
          Add Step
        </button>
      </div>

      <div className="bg-white rounded-lg border-2 border-blue-200">
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-700 bg-gray-50">
            <div className="col-span-2">Step Order</div>
            <div className="col-span-2">Subject</div>
            <div className="col-span-4">Body</div>
            <div className="col-span-2">Send At</div>
            <div className="col-span-1">Action</div>
            <div className="col-span-1">SendGrid</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {stepsLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : steps.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No steps found.</div>
          ) : (
            steps.map((step) => (
              <div key={step.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                <div className="col-span-2 flex items-center">{step.step_order}</div>
                <div className="col-span-2 flex items-center">{step.subject}</div>
                <div className="col-span-4 text-sm text-gray-600 line-clamp-2">{step.body}</div>
                <div className="col-span-2 flex items-center">{step.send_at ? new Date(step.send_at).toLocaleString() : ''}</div>
                <div className="col-span-1 flex items-center space-x-2">
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditStep(step)}>Edit</button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteStep(step.id)}><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="col-span-1 flex items-center">
                  <button className="bg-green-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleScheduleStep(step)} disabled={!!step.sendgrid_campaign_id}>
                    {step.sendgrid_campaign_id ? 'Scheduled' : 'Schedule'}
                  </button>
                </div>
              </div>
            ))
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
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowScheduleModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleConfirmSchedule}>Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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

  // Fetch campaign name on load
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await api.get(`/campaigns/${id}/`); // Make sure 'id' is from useParams
        setCampaignName(res.data.name || "Campaign");
      } catch (error) {
        console.error("Failed to load campaign", error);
        setCampaignName("Campaign");
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
        />
      </div>
    </Layout>
  );
};

export default CampaignManagement;
