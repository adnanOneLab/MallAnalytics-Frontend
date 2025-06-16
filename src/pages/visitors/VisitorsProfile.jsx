import React, { useState } from 'react';
import { Search, Settings, Download, ArrowUpDown } from 'lucide-react';

const VisitorDetail = () => {
  const [visitData] = useState([
    { date: '05/21/2025', timeEntry: '11:26:53 am', timeExit: '4:56:26 pm', storesVisited: '03', timeSpent: '5 hours 30 minutes', interest: 'Sports Clothing' },
    { date: '05/22/2025', timeEntry: '09:15:44 am', timeExit: '12:30:12 pm', storesVisited: '02', timeSpent: '3 hours 15 minutes', interest: 'Outdoor Gear' },
    { date: '05/23/2025', timeEntry: '08:45:12 am', timeExit: '10:50:35 am', storesVisited: '01', timeSpent: '2 hours 5 minutes', interest: 'Footwear' },
    { date: '05/24/2025', timeEntry: '07:30:00 am', timeExit: '09:00:00 am', storesVisited: '02', timeSpent: '1 hour 30 minutes', interest: 'Fitness Equipment' },
    { date: '05/25/2025', timeEntry: '10:00:00 am', timeExit: '02:00:00 pm', storesVisited: '03', timeSpent: '4 hours', interest: 'Yoga Accessories' },
    { date: '05/26/2025', timeEntry: '12:00:00 pm', timeExit: '03:15:00 pm', storesVisited: '02', timeSpent: '3 hours 15 minutes', interest: 'Athletic Wear' }
  ]);

  const visitorInfo = {
    id: '26559',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    phone: '+1 9653256584',
    address: 'Address 1, LA, 265598',
    monthlyVisits: 36,
    yearlyVisits: 36,
    lifeVisits: 36,
    avgTimePerVisitYear: '3.5 hrs',
    avgTimePerVisitLife: '2 hrs',
    storesVisitedMonth: 19,
    storesVisitedLife: 69,
    firstVisit: '02/28/2022',
    lastVisit: '05/20/2025',
    recency: 36,
    monthlyFrequency: 6
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-lg">Wise Video</span>
            </div>
            <span className="text-gray-600 ml-8">Visitor</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Visitor Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col">
            <div className="flex items-start space-x-8 mb-6">
              {/* Profile Image */}
              <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
                  JD
                </div>
              </div>

              {/* Basic Info Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Visitor ID</div>
                    <div className="font-medium text-gray-900">{visitorInfo.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Name</div>
                    <div className="font-medium text-gray-900">{visitorInfo.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <div className="font-medium text-blue-600">{visitorInfo.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Phone Number</div>
                    <div className="font-medium text-gray-900">{visitorInfo.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Address</div>
                    <div className="font-medium text-gray-900">{visitorInfo.address}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Monthly Visits</div>
                    <div className="text-lg font-semibold text-gray-900">{visitorInfo.monthlyVisits}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Yearly Visits</div>
                    <div className="text-lg font-semibold text-gray-900">{visitorInfo.yearlyVisits}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Life Visits</div>
                    <div className="text-lg font-semibold text-gray-900">{visitorInfo.lifeVisits}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Line */}
            <hr className="mb-6 border-gray-200" />

            {/* Stores Visited Stats - Single line */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-gray-500">Stores visited month:</span>
                  <span className="ml-2 font-semibold text-gray-900">{visitorInfo.storesVisitedMonth}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stores visited life:</span>
                  <span className="ml-2 font-semibold text-gray-900">{visitorInfo.storesVisitedLife}</span>
                </div>
                <div>
                  <span className="text-gray-500">First visit:</span>
                  <span className="ml-2 font-semibold text-gray-900">{visitorInfo.firstVisit}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last visit:</span>
                  <span className="ml-2 font-semibold text-gray-900">{visitorInfo.lastVisit}</span>
                </div>
                <div>
                  <span className="text-gray-500">Recency:</span>
                  <span className="ml-2 font-semibold text-gray-900">{visitorInfo.recency}</span>
                </div>
                <div>
                  <span className="text-gray-500">Monthly Frequency:</span>
                  <span className="ml-2 font-semibold text-gray-900">{visitorInfo.monthlyFrequency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">85</span> Visits
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Time of entry</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Time of Exit</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Stores Visited</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Time spent</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Interest</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitData.map((visit, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.timeEntry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.timeExit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.storesVisited}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.timeSpent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.interest}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetail;