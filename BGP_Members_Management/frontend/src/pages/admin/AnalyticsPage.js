import React from 'react';

const AnalyticsPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="bgp-header-1 text-bgp-dark">Analytics</h1>
        <p className="text-gray-600">Church growth and member insights</p>
      </div>

      <div className="bgp-card text-center py-12">
        <h2 className="bgp-header-2 text-gray-600 mb-4">
          Analytics Dashboard Coming Soon!
        </h2>
        <p className="text-gray-500 mb-6">
          Comprehensive analytics and insights will be available once 
          the database is connected and populated with member data.
        </p>
        <div className="text-sm text-gray-400">
          <p>Analytics features in development:</p>
          <ul className="mt-2 space-y-1">
            <li>Member growth charts</li>
            <li>Age demographics</li>
            <li>Consent statistics</li>
            <li>Family analysis</li>
            <li>Geographic distribution</li>
            <li>Monthly reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;