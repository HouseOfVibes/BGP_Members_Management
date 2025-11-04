import React from 'react';
import { Link } from 'react-router-dom';
import GoogleMap from '../components/common/GoogleMap';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-bgp">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to{' '}
              <span className="text-gradient">
                Believers Gathering Place
              </span>
            </h1>
            
<p className="text-xl text-bgp-gray-medium mb-8 max-w-3xl mx-auto">
              Believe. Connect. Grow. Join our growing church family 
              where lives are transformed by the grace of Christ and spiritual growth flourishes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/register" 
                className="bgp-btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-transform"
              >
                Become a Member
              </Link>
              
              <a 
                href="https://bgpnc.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bgp-btn-outline text-lg px-8 py-4"
              >
                Learn More About BGP
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="bgp-header-2 text-bgp-dark mb-4">
              Why Join Our Church Family?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At BGP, we're more than just a church - we're a community that 
              supports each other in faith and life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-bgp-teal text-white rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-bgp-dark mb-2">
                Strong Community
              </h3>
              <p className="text-gray-600">
                Connect with fellow believers and build lasting friendships in our welcoming community.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-bgp-gold text-white rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-bgp-dark mb-2">
                Biblical Teaching
              </h3>
              <p className="text-gray-600">
                Grow in your faith through expository preaching and Bible-centered teaching.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-bgp-gold text-white rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-bgp-dark mb-2">
                Serving Others
              </h3>
              <p className="text-gray-600">
                Make a difference in our community through various ministry opportunities and outreach programs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-bgp-gray-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="bgp-header-2 text-bgp-dark mb-4">
              Visit Us This Sunday
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join us for worship at East Wake High School every Sunday at 12:30 PM.
              We'd love to meet you and welcome you to our church family!
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-bgp-dark mb-2">Service Information</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Day:</strong> Sunday</p>
                  <p><strong>Time:</strong> 12:30 PM</p>
                  <p><strong>Dress Code:</strong> Come as you are - casual or formal welcome!</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-bgp-dark mb-2">Location</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>East Wake High School</strong></p>
                  <p>5101 Rolesville Road</p>
                  <p>Wendell, NC 27591</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-bgp-dark mb-2">Leadership</h3>
                <div className="space-y-1 text-gray-700">
                  <p>Pastor Mark Smith</p>
                  <p>Lady LaQuadia Smith (Lady Q)</p>
                </div>
              </div>
            </div>
            
            <div>
              <GoogleMap 
                address="East Wake High School, 5101 Rolesville Road, Wendell, NC 27591"
                className="w-full h-80 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-bgp-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="bgp-header-2 text-white mb-4">
            Ready to Join Our Family?
          </h2>
          <p className="text-bgp-gray-medium text-lg mb-8 max-w-2xl mx-auto">
            Registration is quick and easy. Join us this Sunday and experience 
            the love of Christ in community.
          </p>
          
          <Link 
            to="/register" 
            className="bgp-btn-secondary text-lg px-8 py-4 transform hover:scale-105 transition-transform"
          >
            Start Your Registration
          </Link>
          
          <div className="mt-8 text-bgp-gray-medium">
            <p className="mb-2">
<strong>Service Times:</strong> Sundays at 12:30 PM
            </p>
            <p>
<strong>Location:</strong> East Wake High School, Wendell, NC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;