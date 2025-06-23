import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../../services/api';
import { useParams } from 'react-router-dom';

const ContactsTab = () => {
  const [contacts, setContacts] = useState([]);
  const {id}=useParams();
  console.log(id,'idsdsdf');
  
  useEffect(() => {
    if (id) fetchContacts();
  }, [id]);

  const fetchContacts = async () => {
    try {
      const res = await api.get(`/campaigns/${id}/contacts/`);
      setContacts(res.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add contacts
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Steps
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3"><input type="checkbox" /></th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Visits</th>
                <th className="px-6 py-3">Shows</th>
                <th className="px-6 py-3">Last Visit</th>
                <th className="px-6 py-3">Membership</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.contact_id}>
                  <td className="px-6 py-4"><input type="checkbox" /></td>
                  <td className="px-6 py-4">{contact.name}</td>
                  <td className="px-6 py-4">{contact.email}</td>
                  <td className="px-6 py-4">{contact.visits}</td>
                  <td className="px-6 py-4">{contact.shows}</td>
                  <td className="px-6 py-4">{contact.last_visit}</td>
                  <td className="px-6 py-4">{contact.membership}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contact.group ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.group || 'No Group'}
                    </span>
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
