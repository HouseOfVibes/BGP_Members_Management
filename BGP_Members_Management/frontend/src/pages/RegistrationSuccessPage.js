import React from 'react';
import { Link } from 'react-router-dom';
import GoogleMap from '../components/common/GoogleMap';

const RegistrationSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-bgp flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500 mb-8 animate-fade-in">
          <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <div className="animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to the Family!
          </h1>
          
          <h2 className="bgp-header-2 text-bgp-gold mb-6">
            Registration Successful
          </h2>
          
          <p className="text-xl text-bgp-gray-medium mb-8 max-w-lg mx-auto">
            Thank you for joining Believers Gathering Place! We're excited to have you as part of our church family.
          </p>
        </div>

        {/* What's Next Section */}
        <div className="bgp-card-dark text-left mb-8 animate-fade-in">
          <h3 className="text-xl font-bold text-bgp-gold mb-4 text-center">
            What Happens Next?
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-bgp-teal rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-white">Welcome Email</h4>
                <p className="text-bgp-gray-medium text-sm">
                  You'll receive a welcome email with important information about BGP within the next few minutes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-bgp-teal rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-white">Personal Welcome</h4>
                <p className="text-bgp-gray-medium text-sm">
                  A member of our pastoral team will reach out to personally welcome you and answer any questions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-bgp-teal rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-white">Join Us Sunday</h4>
                <p className="text-bgp-gray-medium text-sm">
                  We'd love to see you this Sunday at 12:30 PM! Look for our welcome team who will help you feel at home.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div className="bgp-card mb-8">
          <h3 className="text-xl font-bold text-bgp-dark mb-4">
            Service Information
          </h3>
          
          <div className="space-y-2 text-gray-700">
            <p><strong>Service Time:</strong> Sundays at 12:30 PM</p>
            <p><strong>Location:</strong> East Wake High School</p>
            <p><strong>Address:</strong> 5101 Rolesville Road, Wendell, NC</p>
            <p><strong>Dress Code:</strong> Come as you are - casual or formal, all are welcome!</p>
<p><strong>Leadership:</strong> Pastor Mark Smith & Lady LaQuadia Smith (Lady Q)</p>
          </div>
        </div>

        {/* Map Section */}
        <div className="bgp-card mb-8">
          <h3 className="text-xl font-bold text-bgp-dark mb-4 text-center">
            Find Us Here
          </h3>
          <GoogleMap 
            address="East Wake High School, 5101 Rolesville Road, Wendell, NC 27591"
            className="w-full h-64 rounded-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <a 
            href="https://bgpnc.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bgp-btn-primary text-lg px-8 py-3"
          >
            Visit Our Website
          </a>
          
          <Link 
            to="/" 
            className="bgp-btn-outline text-lg px-8 py-3"
          >
            Back to Home
          </Link>
        </div>

        {/* Contact Information */}
        <div className="text-bgp-gray-medium">
          <p className="mb-2">
            Have questions? We're here to help!
          </p>
          <div className="space-y-1">
            <p>Website: bgpnc.com</p>
            <p>Address: East Wake High School, Wendell, NC</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 flex justify-center space-x-6">
          <a 
            href="https://www.facebook.com/profile.php?id=61566028974961" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-bgp-gray-medium hover:text-bgp-teal transition-colors"
            title="Follow us on Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          
          <a 
            href="https://www.instagram.com/believersgatheringplace" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-bgp-gray-medium hover:text-bgp-teal transition-colors"
            title="Follow us on Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.148-1.188C4.613 15.101 4.124 13.95 4.124 12.654c0-1.297.489-2.448 1.178-3.148c.7-.699 1.851-1.188 3.148-1.188c1.297 0 2.448.489 3.148 1.188c.699.7 1.188 1.851 1.188 3.148c0 1.296-.489 2.447-1.188 3.147c-.7.698-1.851 1.187-3.148 1.187zm7.718-2.903H14.41v-2.699h1.757v2.699z"/>
            </svg>
          </a>

          <a 
            href="https://www.tiktok.com/@bgpnc" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-bgp-gray-medium hover:text-bgp-teal transition-colors"
            title="Follow us on TikTok"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;