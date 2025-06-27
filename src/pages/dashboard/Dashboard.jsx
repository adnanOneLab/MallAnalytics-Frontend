import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../components/Layout";
import api from "../../services/api";

const Dashboard = () => {
  const { t } = useTranslation();
  // const [metrics, setMetrics] = useState({
  //   total_visitors: 0,
  //   active_users: 0,
  //   avg_visit_duration: null,
  //   new_active_users: null,
  // });
  const [metrics, setMetrics] = useState({
    total_visitors: 0,
    avg_stores_visited: 0,
    avg_visit_duration: null,
    new_active_users: null,
  });
  
  const [days, setDays] = useState(30); // default to 30 days

  // useEffect(() => {
  //   api
  //     .get("/dashboard-metrics/")
  //     .then((res) => setMetrics(res.data))
  //     .catch((err) => console.error("Failed to fetch dashboard metrics", err));
  // }, []);
  useEffect(() => {
    fetchMetrics(days);
  }, [days]);

  const fetchMetrics = (selectedDays) => {
    console.log(selectedDays,'selectedddf');
    
    api
      .get(`api/dashboard-metrics/?days=${selectedDays}`)
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error("Failed to fetch dashboard metrics", err));
  };

  const formatDuration = (duration) => {
    if (!duration) return "0m";
    const [hours, minutes] = duration.split(":");
    return `${parseInt(hours)}h ${parseInt(minutes)}m`;
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {t("dashboard.title")}
        </h1>
        <p className="text-gray-600 mb-4">{t("dashboard.welcome")}</p>

        <div className="mb-4 flex items-center gap-3">
          <label htmlFor="days" className="text-sm font-medium text-gray-700">
            {t("dashboard.selectRange")}:
          </label>
          <select
            id="days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm hover:border-gray-400"
          >
            <option value={7}>Last 7 Days</option>
            <option value={15}>Last 15 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Visitors Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">
            {t("dashboard.totalVisitors")}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {metrics.total_visitors}
          </p>
          {/* <p className="text-sm text-gray-600 mt-1">
            {t("dashboard.totalVisitorsSubtext")}
          </p> */}
        </div>

        {/* Average Stores Visited Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">
            {t("dashboard.avgStoresVisited")}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {metrics.avg_stores_visited || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {t("dashboard.avgStoresVisitedSubtext")}
          </p>
        </div>

        {/* Average Visit Duration Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">
            {t("dashboard.avgVisitDuration")}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatDuration(metrics.avg_visit_duration)}
          </p>
          {/* <p className="text-sm text-gray-600 mt-1">
            {t("dashboard.avgVisitDurationSubtext")}
          </p> */}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
