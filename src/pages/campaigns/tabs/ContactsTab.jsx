import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const ContactsTab = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (id) fetchContacts();
  }, [id]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/campaigns/${id}/contacts/`);
      setContacts(res.data);
    } catch (error) {
      console.error("Error fetching Visitors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleVisitorClick = (user_id) => {
    navigate(`/visitors/${user_id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <div className="flex space-x-3">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
            onClick={() => navigate(`/visitors`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Visitors
          </button>
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Steps
          </button> */}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="px-6 py-3">
                  <input type="checkbox" />
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {contacts.map((contact, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 whitespace-nowrap flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleVisitorClick(contact.user.user_id)}
                  >
                    <span className="text-sm font-semibold text-black">
                      {index + 1}.
                    </span>
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {contact.user.name}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.user.cell_phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.user.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(contact.user.date_of_birth).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(contact.added_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactsTab;
