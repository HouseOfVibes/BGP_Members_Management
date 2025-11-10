import React, { useState } from 'react';
import BulkUpload from '../../components/admin/BulkUpload';

const MembersListPage = () => {
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const handleUploadComplete = () => {
    // Refresh member list or show success message
    setShowBulkUpload(false);
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="bgp-header-1 text-bgp-dark">Members</h1>
          <p className="text-gray-600">Manage all church members</p>
        </div>
        <button
          onClick={() => setShowBulkUpload(!showBulkUpload)}
          className="bgp-btn-primary"
        >
          {showBulkUpload ? 'Hide' : 'Bulk Import'}
        </button>
      </div>

      {/* Bulk Upload Section */}
      {showBulkUpload && (
        <div className="mb-8">
          <BulkUpload onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {/* Coming Soon */}
      <div className="bgp-card text-center py-12">
        <h2 className="bgp-header-2 text-gray-600 mb-4">
          Member List View Coming Soon! 👥
        </h2>
        <p className="text-gray-500 mb-6">
          The complete member list and management interface will be available once
          the database is set up and connected. In the meantime, you can use the
          Bulk Import feature above to import members from your existing system.
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