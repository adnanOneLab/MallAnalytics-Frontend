import React, { useState } from 'react';
import { Search, Settings, ChevronDown, Edit, Trash2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from './components/Layout';

const VisitorsList = () => {
  const navigate = useNavigate();
  const [visitors] = useState([
    { id: 1, name: 'John Doe', email: 'johndoe@gmail.com', visits: 36, shows: 12, lastVisit: '05/21/2025', membership: 'Gold Membership' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@gmail.com', visits: 49, shows: 15, lastVisit: '06/15/2025', membership: 'Platinum Membership' },
    { id: 3, name: 'Michael Johnson', email: 'michael@gmail.com', visits: 29, shows: 9, lastVisit: '07/03/2025', membership: 'Silver Membership' },
    { id: 4, name: 'Emily Davis', email: 'emilydavis@gmail.com', visits: 51, shows: 20, lastVisit: '06/28/2025', membership: 'Gold Membership' },
    { id: 5, name: 'David Wilson', email: 'davidw@gmail.com', visits: 38, shows: 13, lastVisit: '07/10/2025', membership: 'Silver Membership' },
    { id: 6, name: 'Sarah Brown', email: 'sarahb@gmail.com', visits: 45, shows: 15, lastVisit: '06/30/2025', membership: 'Gold Membership' },
    { id: 7, name: 'William Lee', email: 'williamlee@gmail.com', visits: 33, shows: 11, lastVisit: '08/01/2025', membership: 'Bronze Membership' },
    { id: 8, name: 'Jessica Taylor', email: 'jessicataylor@gmail.com', visits: 34, shows: 7, lastVisit: '05/15/2025', membership: 'Platinum Membership' },
    { id: 9, name: 'Daniel Martinez', email: 'danielm@gmail.com', visits: 50, shows: 22, lastVisit: '06/10/2025', membership: 'Gold Membership' },
    { id: 10, name: 'Lisa Garcia', email: 'lisag@gmail.com', visits: 41, shows: 14, lastVisit: '07/25/2025', membership: 'Silver Membership' },
    { id: 11, name: 'James Anderson', email: 'james@gmail.com', visits: 35, shows: 25, lastVisit: '08/05/2025', membership: 'Platinum Membership' },
    { id: 12, name: 'Olivia Thomas', email: 'oliviat@gmail.com', visits: 30, shows: 10, lastVisit: '08/20/2025', membership: 'Bronze Membership' },
    { id: 13, name: 'Samuel Clark', email: 'samuelc@gmail.com', visits: 47, shows: 19, lastVisit: '07/15/2025', membership: 'Gold Membership' },
    { id: 14, name: 'Ava White', email: 'avaw@gmail.com', visits: 24, shows: 6, lastVisit: '05/18/2025', membership: 'Silver Membership' }
  ]);

  const [selectedVisitors, setSelectedVisitors] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const getMembershipColor = (membership) => {
    const colors = {
      'Gold Membership': 'bg-yellow-100 text-yellow-800',
      'Platinum Membership': 'bg-purple-100 text-purple-800',
      'Silver Membership': 'bg-gray-100 text-gray-800',
      'Bronze Membership': 'bg-orange-100 text-orange-800'
    };
    return colors[membership] || 'bg-gray-100 text-gray-800';
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVisitors(new Set());
    } else {
      setSelectedVisitors(new Set(visitors.map(v => v.id)));
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

  const handleVisitorClick = (id) => {
    navigate(`/visitors/${id}`);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Visitors List</h1>
          <p className="text-gray-600">3,265 Visits</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Mail Promotion
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Export to CSV
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center space-x-2">
                <span>Filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <button className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

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
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visits
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shows
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-50">
                  <td className="w-12 px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedVisitors.has(visitor.id)}
                      onChange={() => handleSelectVisitor(visitor.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleVisitorClick(visitor.id)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {visitor.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{visitor.email}</div>
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
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${getMembershipColor(visitor.membership)}`}>
                      {visitor.membership}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default VisitorsList;