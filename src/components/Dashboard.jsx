import React from 'react';
import Layout from './Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to WISE Video Analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Visitors Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Visitors</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">3,265</p>
          <p className="text-sm text-gray-600 mt-1">+12% from last month</p>
        </div>

        {/* Active Shows Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">Active Shows</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
          <p className="text-sm text-gray-600 mt-1">+3 new this week</p>
        </div>

        {/* Average Visit Duration Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">Avg. Visit Duration</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">45m</p>
          <p className="text-sm text-gray-600 mt-1">+5m from last month</p>
        </div>

        {/* Membership Distribution Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">Membership Distribution</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Platinum</span>
              <span className="text-sm font-medium text-gray-900">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Gold</span>
              <span className="text-sm font-medium text-gray-900">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Silver</span>
              <span className="text-sm font-medium text-gray-900">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bronze</span>
              <span className="text-sm font-medium text-gray-900">20%</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 