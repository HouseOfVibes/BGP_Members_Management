import React from 'react';

const MembersListPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="bgp-header-1 text-bgp-dark">Members</h1>
        <p className="text-gray-600">Manage all church members</p>
      </div>

      {/* Coming Soon */}
      <div className="bgp-card text-center py-12">
        <h2 className="bgp-header-2 text-gray-600 mb-4">
          Member Management Coming Soon! 👥
        </h2>
        <p className="text-gray-500 mb-6">
          The complete member management interface will be available once 
          the database is set up and connected.
        </p>
        <div className="text-sm text-gray-400">
          <p>Features in development:</p>
          <ul className="mt-2 space-y-1">
            <li>📋 View all members</li>
            <li>🔍 Search and filter</li>
            <li>✏️ Edit member details</li>
            <li>📊 Export to CSV/Excel</li>
            <li>👨‍👩‍👧‍👦 Manage families</li>
            <li>📧 Bulk communications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MembersListPage;