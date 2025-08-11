import React from 'react';

const GoogleMap = ({ 
  address = "East Wake High School, 5101 Rolesville Road, Wendell, NC 27591",
  className = "w-full h-64 rounded-lg border border-gray-300"
}) => {
  // Encode the address for the Google Maps embed URL
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`;
  
  // For now, we'll use a simple iframe without API key (works for basic embedding)
  const simpleMapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <div className={className}>
      <iframe
        src={simpleMapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="BGP Church Location"
      />
    </div>
  );
};

export default GoogleMap;