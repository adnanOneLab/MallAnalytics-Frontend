import React, { useEffect, useState } from "react";
import { Search, Plus, Trash2, MoreVertical } from "lucide-react";
import Layout from "../../components/Layout";
import ContactsTab from "../campaigns/tabs/ContactsTab";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const CampaignManagement = () => {
  const [activeTab, setActiveTab] = useState("emails");
  const [searchTerm, setSearchTerm] = useState("");
  const [campaignName, setCampaignName] = useState("");

  // Sample data for emails/campaign steps
  const campaignSteps = [
    {
      id: 1,
      day: "Day 1",
      type: "Email",
      subject: "Transform Your Aviation Operations with AI",
      content:
        "Hi [[first_name]], I hope this message finds you well! My name is [[sender_first_name]] [[sender_last_name]], and I'm reaching out from [[sender_company]] because I believe we can help [[company]] tackle a...",
      active: true,
      replyInThread: false,
      noSubject: false,
    },
    {
      id: 2,
      day: "Day 4",
      type: "Email",
      subject: "Reply in Thread - No Subject",
      content:
        "Hi [[first_name]], I hope this message finds you well! My name is [[sender_first_name]] [[sender_last_name]], and I'm reaching out from [[sender_company]] because I believe we can help [[company]] tackle a...",
      active: false,
      replyInThread: true,
      noSubject: true,
    },
    {
      id: 3,
      day: "Day 7",
      type: "LinkedIn Connection",
      subject: "Connection Request",
      content: "",
      active: false,
      replyInThread: false,
      noSubject: false,
    },
    {
      id: 4,
      day: "Day 11",
      type: "LinkedIn Message",
      subject: "Transform Your Aviation Operations with AI",
      content:
        "Hi [[first_name]], I hope this message finds you well! My name is [[sender_first_name]] [[sender_last_name]], and I'm reaching out from [[sender_company]] because I believe we can help [[company]] tackle a...",
      active: true,
      replyInThread: false,
      noSubject: false,
    },
  ];

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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Steps
        </button>
      </div>

      <div className="bg-white rounded-lg border-2 border-blue-200">
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-700 bg-gray-50">
            <div className="col-span-2">Steps</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-6">Summary</div>
            <div className="col-span-1">Active</div>
            <div className="col-span-1">Action</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {campaignSteps.map((step) => (
            <div
              key={step.id}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50"
            >
              <div className="col-span-2 flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-3 text-sm text-gray-900">{step.day}</span>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-900">{step.type}</span>
              </div>

              <div className="col-span-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    {step.subject}
                    {step.replyInThread && (
                      <span className="ml-2 text-xs text-gray-500">
                        Reply in Thread - No Subject
                      </span>
                    )}
                  </div>
                  {step.content && (
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {step.content}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <div
                  className={`w-10 h-6 rounded-full p-1 ${
                    step.active ? "bg-green-500" : "bg-gray-300"
                  } transition-colors cursor-pointer`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      step.active ? "translate-x-4" : ""
                    }`}
                  ></div>
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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
  const { id } = useParams();
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
      </div>
    </Layout>
  );
};

export default CampaignManagement;
