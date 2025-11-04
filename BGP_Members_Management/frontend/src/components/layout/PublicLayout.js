import React from 'react';
import { Link } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-bgp-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="https://bgpnc.com/wp-content/uploads/2025/07/BGP-GB-black-background.png"
                alt="BGP Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Believers Gathering Place
                </h1>
                <p className="text-bgp-gray-medium text-sm">
                  Wendell, NC
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-bgp-gray-medium hover:text-white transition-colors"
              >
                Home
              </Link>
              
              <Link 
                to="/register" 
                className="text-bgp-gray-medium hover:text-white transition-colors"
              >
                Join Us
              </Link>
              
              <a 
                href="https://bgpnc.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-bgp-gray-medium hover:text-white transition-colors"
              >
                Our Website
              </a>
              
              <Link 
                to="/login" 
                className="bgp-btn-outline text-sm px-4 py-2"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                className="text-white hover:text-bgp-gold transition-colors"
                onClick={() => {
                  // Simple mobile menu toggle - you can enhance this
                  const mobileMenu = document.getElementById('mobile-menu');
                  mobileMenu.classList.toggle('hidden');
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div id="mobile-menu" className="hidden md:hidden pb-4">
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block text-bgp-gray-medium hover:text-white transition-colors py-2"
              >
                Home
              </Link>
              
              <Link 
                to="/register" 
                className="block text-bgp-gray-medium hover:text-white transition-colors py-2"
              >
                Join Us
              </Link>
              
              <a 
                href="https://bgpnc.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-bgp-gray-medium hover:text-white transition-colors py-2"
              >
                Our Website
              </a>
              
              <Link 
                to="/login" 
                className="block text-bgp-teal hover:text-bgp-teal-hover transition-colors py-2"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bgp-darker text-bgp-gray-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Church Info */}
            <div>
              <h3 className="text-bgp-gold font-semibold mb-4">
                Believers Gathering Place
              </h3>
              <div className="space-y-2 text-sm">
<p>East Wake High School, Wendell, NC</p>
                <p>Service Time: Sundays at 12:30 PM</p>
                <p>Website: bgpnc.com</p>
<p>Leadership: Pastor Mark Smith & Lady LaQuadia Smith (Lady Q)</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-bgp-gold font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <Link to="/" className="block hover:text-white transition-colors">
                  Home
                </Link>
                <Link to="/register" className="block hover:text-white transition-colors">
                  Become a Member
                </Link>
                <a 
                  href="https://bgpnc.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:text-white transition-colors"
                >
                  Our Website
                </a>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-bgp-gold font-semibold mb-4">Our Mission</h3>
<p className="text-sm">
                Believe. Connect. Grow. We aim to see lives transformed by the grace of Christ. 
                Join us in deeply living our faith in a welcoming community.
              </p>
            </div>
          </div>

{/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <p>
                &copy; {new Date().getFullYear()} Believers Gathering Place. All rights reserved.
              </p>
              <p className="text-bgp-gray-medium">
                Built by <span className="text-bgp-gold font-medium">MW Design Studio</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;