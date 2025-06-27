import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const ContactsTab = ({ onHasVisitorsChange, searchTerm }) => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedVisitors, setSelectedVisitors] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  useEffect(() => {
    if (id) fetchContacts(page);
  }, [id, page]);

  useEffect(() => {
    if (onHasVisitorsChange) {
      onHasVisitorsChange(contacts.length > 0);
    }
  }, [contacts, onHasVisitorsChange]);

  const fetchContacts = async (pageNum = page) => {
    setLoading(true);
    try {
      const res = await api.get(`api/campaigns/${id}/contacts/?page=${pageNum}`);
      setContacts(res.data.results);
      setCount(res.data.count);
      setPageSize(res.data.page_size || 10);
      setTotalPages(Math.ceil(res.data.count / (res.data.page_size || 10)));
    } catch (error) {
      console.error("Error fetching Visitors:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredContacts = contacts?.filter(({ user }) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(lowerSearch) ||
      user.email?.toLowerCase().includes(lowerSearch) ||
      user.cell_phone?.toLowerCase().includes(lowerSearch) ||
      user.address?.toLowerCase().includes(lowerSearch) ||
      new Date(user.date_of_birth).toLocaleDateString().includes(lowerSearch)
    );
  });

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

  // Checkbox logic
  const handleSelectAll = () => {
    if (selectedVisitors.size === contacts.length) {
      setSelectedVisitors(new Set());
    } else {
      setSelectedVisitors(new Set(contacts.map((c) => c.user.user_id)));
    }
  };

  const handleSelectVisitor = (user_id) => {
    const newSelected = new Set(selectedVisitors);
    if (newSelected.has(user_id)) {
      newSelected.delete(user_id);
    } else {
      newSelected.add(user_id);
    }
    setSelectedVisitors(newSelected);
  };

  // Bulk delete logic
  const handleBulkDeleteClick = () => setShowBulkDeleteModal(true);
  const cancelBulkDelete = () => setShowBulkDeleteModal(false);
  const confirmBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      for (const user_id of selectedVisitors) {
        await api.delete(`api/campaigns/${id}/contacts/${user_id}/`);
      }
      setShowBulkDeleteModal(false);
      setSelectedVisitors(new Set());
      fetchContacts(page);
    } catch (err) {
      console.error("Failed to delete contacts:", err);
    } finally {
      setBulkDeleting(false);
    }
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
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:bg-red-300 disabled:cursor-not-allowed"
            onClick={handleBulkDeleteClick}
            disabled={selectedVisitors.size === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Visitors
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedVisitors.size === contacts.length && contacts.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
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
              {filteredContacts.map((contact, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedVisitors.has(contact.user.user_id)}
                      onChange={() => handleSelectVisitor(contact.user.user_id)}
                    />
                  </td>
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

      {/* Delete Contact Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Remove Visitors from Campaign</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to remove the selected visitors from the campaign? This will also remove them from the SendGrid list. This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelBulkDelete}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={bulkDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center justify-center min-w-[90px]"
                disabled={bulkDeleting}
              >
                {bulkDeleting ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Removing...
                  </span>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTab;
