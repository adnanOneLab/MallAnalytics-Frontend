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
import { fetchMovementsByVisitId } from "../../services/visitorService";

const VisitorMovements = () => {
  const navigate = useNavigate();
//   const [movements] = useState([
//     {
//       camera_id: 265985,
//       start_time: "11:26:33 am",
//       end_time: "11:30:33 am",
//       situation: "Walking",
//       location: "Hall A",
//       store_name: "Puma",
//     },
//     {
//       camera_id: 265986,
//       start_time: "11:26:33 am",
//       end_time: "11:30:33 am",
//       situation: "Walking",
//       location: "Hall A",
//       store_name: "Puma",
//     },
//     {
//       camera_id: 265987,
//       start_time: "11:26:33 am",
//       end_time: "11:30:33 am",
//       situation: "Walking",
//       location: "Hall A",
//       store_name: "Puma",
//     },
//     {
//       camera_id: 265988,
//       start_time: "11:26:33 am",
//       end_time: "11:30:33 am",
//       situation: "Walking",
//       location: "Hall A",
//       store_name: "Puma",
//     },
//   ]);

    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);

  const [selectedVisitors, setSelectedVisitors] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
      const loadVisitors = async () => {
        try {
          const data = await fetchMovementsByVisitId();
          setMovements(data);
        } catch (error) {
          console.error('Failed to fetch visitors:', error);
        } finally {
          setLoading(false);
        }
      };

      loadVisitors();
    }, []);

    if (loading) return <p>Loading visitors...</p>;

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVisitors(new Set());
    } else {
      setSelectedVisitors(new Set(movements||[].map((v) => v.id)));
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
    setSelectAll(newSelected.size === movements.length);
  };

  const handleVisitorClick = (id) => {
    navigate(`/visitors/${id}`);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Visitor</h1>
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
              <div>Showing 05/21/2025</div>
            </div>
            <div style={{display:'flex'}}>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Export to CSV
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center space-x-2">
                <span>Filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
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
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Camera Id
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Start Time (TimeStamp)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  End Time (TimeStamp)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Situation
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Store Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movements||[].map((visitor) => (
                <tr key={visitor.camera_id} className="hover:bg-gray-50">
                  <td className="w-12 px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedVisitors.has(visitor.camera_id)}
                      onChange={() => handleSelectVisitor(visitor.camera_id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleVisitorClick(visitor.camera_id)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {visitor.camera_id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {visitor.start_time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {visitor.end_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {visitor.situation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {visitor.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {visitor.store_name}
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

export default VisitorMovements;
