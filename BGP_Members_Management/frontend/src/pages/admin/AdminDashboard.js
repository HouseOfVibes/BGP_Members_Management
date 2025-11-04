import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="bgp-header-1 text-bgp-dark">Dashboard</h1>
        <p className="text-gray-600">Welcome to your member management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bgp-card text-center">
          <div className="text-3xl font-bold text-bgp-teal mb-2">42</div>
          <div className="text-sm text-gray-600">Total Members</div>
        </div>
        
        <div className="bgp-card text-center">
          <div className="text-3xl font-bold text-bgp-gold mb-2">8</div>
          <div className="text-sm text-gray-600">New This Month</div>
        </div>
        
        <div className="bgp-card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">38</div>
          <div className="text-sm text-gray-600">Active Members</div>
        </div>
        
        <div className="bgp-card text-center">
          <div className="text-3xl font-bold text-gray-500 mb-2">4</div>
          <div className="text-sm text-gray-600">Inactive</div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bgp-card text-center py-12">
        <h2 className="bgp-header-2 text-gray-600 mb-4">
          Dashboard Coming Soon!
        </h2>
        <p className="text-gray-500 mb-6">
          The full dashboard with charts, recent activities, and detailed statistics 
          will be available once the database is connected.
        </p>
        <div className="text-sm text-gray-400">
          <p>Features in development:</p>
          <ul className="mt-2 space-y-1">
            <li>Real-time statistics</li>
            <li>Growth charts</li>
            <li>Recent registrations</li>
            <li>Email consent rates</li>
            <li>Upcoming birthdays</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;