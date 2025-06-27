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

  useEffect(() => {
    api
      .get("/dashboard-metrics/")
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error("Failed to fetch dashboard metrics", err));
  }, []);

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
        <p className="text-gray-600">{t("dashboard.welcome")}</p>
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
          <p className="text-sm text-gray-600 mt-1">
            {t("dashboard.totalVisitorsSubtext")}
          </p>
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

        {/* Active Visitors Card */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">
            {t("dashboard.activeVisitors")}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {metrics.active_users}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {t("dashboard.activeVisitorsSubtext", {
              count: metrics.new_active_users || 0,
            })}
          </p>
        </div> */}

        {/* Average Visit Duration Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">
            {t("dashboard.avgVisitDuration")}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatDuration(metrics.avg_visit_duration)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {t("dashboard.avgVisitDurationSubtext")}
          </p>
        </div>

        {/* Membership Distribution Card - Commented out but translated for future use */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">
            {t('dashboard.membershipDistribution')}
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('dashboard.platinum')}</span>
              <span className="text-sm font-medium text-gray-900">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('dashboard.gold')}</span>
              <span className="text-sm font-medium text-gray-900">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('dashboard.silver')}</span>
              <span className="text-sm font-medium text-gray-900">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('dashboard.bronze')}</span>
              <span className="text-sm font-medium text-gray-900">20%</span>
            </div>
          </div>
        </div> */}
      </div>
    </Layout>
  );
};

export default Dashboard;
