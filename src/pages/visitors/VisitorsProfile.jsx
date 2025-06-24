import React, { useState, useEffect } from "react";
import { Search, Settings, Download, ArrowUpDown } from "lucide-react";
import { fetchVisitorProfile } from "../../services/visitorService";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { getPresignedUrl } from "../../services/userService";
import { useTranslation } from 'react-i18next';

const VisitorDetail = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const { t } = useTranslation();

  // const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitorInfo, setVisitorInfo] = useState(null);
  const [visitData, setVisitData] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const loadVisitorProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchVisitorProfile(user_id);
        setVisitorInfo({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          picture_url: data.picture_url,
          monthlyVisits: data.monthlyVisits,
          yearlyVisits: data.yearlyVisits,
          lifeVisits: data.lifeVisits,
          avgTimePerVisitYear: data.avgTimePerVisitYear,
          avgTimePerVisitLife: data.avgTimePerVisitLife,
          storesVisitedMonth: data.storesVisitedMonth,
          storesVisitedLife: data.storesVisitedLife,
          firstVisit: data.firstVisit,
          lastVisit: data.lastVisit,
          recency: data.recency,
          monthlyFrequency: data.monthlyFrequency,
        });
        setVisitData(data.visits);
        setError(null);
      } catch (err) {
        console.error("Error loading visitor profile:", err);
        setError("Failed to load visitor profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadVisitorProfile();
  }, [user_id]);

  useEffect(() => {
    const getTempUrl = async () => {
      try {
        if (visitorInfo?.picture_url) {
          const signedUrl = await getPresignedUrl(visitorInfo.picture_url);
          setPreviewUrl(signedUrl);
        }
      } catch (error) {
        console.error("Failed to fetch pre-signed URL:", error);
      }
    };

    getTempUrl();
  }, [visitorInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {t('visitorsProfile.error')}
        </div>
      </div>
    );
  }

  if (!visitorInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {t('visitorsProfile.notFound')}
        </div>
      </div>
    );
  }

  const handleVisitorClick = (visit_id) => {
    navigate(`/visits/${visit_id}`);
  };
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg">{t('visitorsProfile.title')}</span>
              </div>
            </div>
            {/* <div className="flex items-center space-x-4">
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
          </div> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="py-3">
          {/* Visitor Profile Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col">
              <div className="flex items-start space-x-8 mb-6">
                {/* Profile Image */}
                <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={visitorInfo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                        // e.target.parentElement.innerHTML = `
                        //   <div class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
                        //     ${visitorInfo.name.split(' ').map(n => n[0]).join('')}
                        //   </div>
                        // `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
                      {visitorInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>

                {/* Basic Info Grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {t('visitorsProfile.visitorId')}
                      </div>
                      <div className="font-medium text-gray-900">{user_id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{t('visitorsProfile.name')}</div>
                      <div className="font-medium text-gray-900">
                        {visitorInfo.name || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{t('visitorsProfile.email')}</div>
                      <div className="font-medium text-blue-600">
                        {visitorInfo.email || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {t('visitorsProfile.phone')}
                      </div>
                      <div className="font-medium text-gray-900">
                        {visitorInfo.phone || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{t('visitorsProfile.address')}</div>
                      <div className="font-medium text-gray-900">
                        {visitorInfo.address || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {t('visitorsProfile.monthlyVisits')}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {visitorInfo.monthlyVisits || "0"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {t('visitorsProfile.yearlyVisits')}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {visitorInfo.yearlyVisits || "0"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {t('visitorsProfile.lifeVisits')}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {visitorInfo.lifeVisits || "0"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Line */}
              <hr className="mb-6 border-gray-200" />

              {/* Stores Visited Stats - Single line */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-gray-500">{t('visitorsProfile.storesVisitedMonth')}</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {visitorInfo.storesVisitedMonth || "0"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('visitorsProfile.storesVisitedLife')}</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {visitorInfo.storesVisitedLife || "0"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('visitorsProfile.firstVisit')}</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {visitorInfo.firstVisit || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('visitorsProfile.lastVisit')}</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {visitorInfo.lastVisit || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('visitorsProfile.recency')}</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {visitorInfo.recency || "0"} {t('visitorsProfile.days')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('visitorsProfile.monthlyFrequency')}</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {visitorInfo.monthlyFrequency || "0"} {t('visitorsProfile.visits')}
                    </span>
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
                  {t('visitorsProfile.showingVisits', { count: visitData.length || '0' })}
                </div>
                {/* <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg">
                  <Settings className="w-4 h-4" />
                </button>
              </div> */}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>{t('visitorsProfile.tableHeaders.date')}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>{t('visitorsProfile.tableHeaders.timeEntry')}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>{t('visitorsProfile.tableHeaders.timeExit')}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>{t('visitorsProfile.tableHeaders.storesVisited')}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>{t('visitorsProfile.tableHeaders.timeSpent')}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>{t('visitorsProfile.tableHeaders.interest')}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visitData.map((visit, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50"
                      onClick={() => handleVisitorClick(visit.visit_id)}
                    >
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
    </Layout>
  );
};

export default VisitorDetail;
