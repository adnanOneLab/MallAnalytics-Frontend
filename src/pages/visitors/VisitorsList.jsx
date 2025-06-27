import React, { useEffect, useState } from "react";
import {
  Search,
  Settings,
  ChevronDown,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { fetchVisitors } from "../../services/visitorService";
import AddContactModal from "./AddContactModal";
import api from "../../services/api";

const VisitorsList = () => {
  const navigate = useNavigate();

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedVisitors, setSelectedVisitors] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    membership: "",
    store: "",
    monthlyFreq: "",
    lastVisit: "",
    visits: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}/`);
      setVisitors(visitors.filter((v) => v.user_id !== userId));
      await loadVisitors();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const response = await fetchVisitors({
        search: searchTerm,
        page: currentPage,
        pageSize,
        ...filters,
      });
      setVisitors(response.results || []);
      setTotalCount(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / pageSize));
    } catch (error) {
      console.error("Failed to fetch visitors:", error);
      setVisitors([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadVisitors();
  }, [searchTerm, currentPage, pageSize, filters]);

  const getMembershipColor = (membership) => {
    const colors = {
      "Gold Membership": "bg-yellow-100 text-yellow-800",
      "Platinum Membership": "bg-purple-100 text-purple-800",
      "Silver Membership": "bg-gray-100 text-gray-800",
      "Bronze Membership": "bg-orange-100 text-orange-800",
    };
    return colors[membership] || "bg-gray-100 text-gray-800";
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVisitors(new Set());
    } else {
      setSelectedVisitors(new Set(visitors.map((v) => v.user_id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectVisitor = (id) => {
    const newSelected = new Set(selectedVisitors);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVisitors(newSelected);
    setSelectAll(newSelected.size === visitors.length);
  };

  const handleVisitorClick = (user_id) => {
    navigate(`/visitors/${user_id}`);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Visitors List
          </h1>
          <p className="text-gray-600">{visitors.length} Visits</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div> */}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedVisitors.size > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => setIsAddContactModalOpen(true)}
                disabled={selectedVisitors.size === 0}
              >
                Add to Email Campaign
              </button>
              {/* <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Export to CSV
              </button> */}
              <div className="flex items-center space-x-3 relative">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center space-x-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span>Filters</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg p-4 border z-10">
                    <div className="mb-3">
                      <label className="block text-sm text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={filters.name}
                        onChange={(e) =>
                          setFilters({ ...filters, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-700">
                        Email
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={filters.email}
                        onChange={(e) =>
                          setFilters({ ...filters, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-700">
                        Membership
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={filters.membership}
                        onChange={(e) =>
                          setFilters({ ...filters, membership: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-700">
                        Stores Visited
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={filters.store}
                        onChange={(e) =>
                          setFilters({ ...filters, store: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-700">
                        Visits
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={filters.visits}
                        onChange={(e) =>
                          setFilters({ ...filters, visits: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-700">
                        Monthly Frequency
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                        value={filters.monthlyFreq}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            monthlyFreq: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-700">
                        Last Visit (YYYY-MM-DD)
                      </label>
                      <input
                        type="date"
                        className="w-full border rounded px-2 py-1"
                        value={filters.lastVisit}
                        onChange={(e) =>
                          setFilters({ ...filters, lastVisit: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <button
                        className="px-4 py-1 rounded bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
                        onClick={() => {
                          setFilters({
                            name: "",
                            email: "",
                            membership: "",
                            store: "",
                            monthlyFreq: "",
                            lastVisit: "",
                            visits: "",
                          });
                          setShowFilters(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                        onClick={() => {
                          setCurrentPage(1); // reset pagination if needed
                          setShowFilters(false);
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {Object.values(filters).some(Boolean) && (
                <button
                  className="text-sm text-blue-600 hover:underline ml-2"
                  onClick={() => {
                    setFilters({
                      name: "",
                      email: "",
                      membership: "",
                      store: "",
                      monthlyFreq: "",
                      lastVisit: "",
                      visits: "",
                    });
                    setCurrentPage(1);
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
            <button className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="w-12 px-6 py-3 bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Visits
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Shows
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Visit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Membership
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="bg-gray-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                visitors.map((visitor) => (
                  <tr key={visitor.user_id} className="hover:bg-gray-50">
                    <td className="w-12 px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedVisitors.has(visitor.user_id)}
                        onChange={() => handleSelectVisitor(visitor.user_id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleVisitorClick(visitor.user_id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {visitor.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {visitor.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visitor.visits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visitor.shows}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visitor.lastVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${getMembershipColor(
                          visitor.membership
                        )}`}
                      >
                        {visitor.membership}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => {
                            setUserToDelete(visitor);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages} ({totalCount} total
              visitors)
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm">Page {currentPage}</span>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={() => {
          setIsAddContactModalOpen(false);
          setSelectedVisitors(new Set());
        }}
        selectedVisitors={Array.from(selectedVisitors)} // 👈 convert Set to array
      />
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Delete {userToDelete.name}?
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(userToDelete.user_id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default VisitorsList;
