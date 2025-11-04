import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { publicAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors },
    setValue,
    trigger
  } = useForm();
  
  const steps = [
    { id: 1, title: 'Personal Information', icon: '1' },
    { id: 2, title: 'Church Information', icon: '2' },
    { id: 3, title: 'Family Details', icon: '3' },
    { id: 4, title: 'Permissions & Consent', icon: '4' }
  ];
  
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = {
        ...data,
        children: children.filter(child => child.name) // Only include children with names
      };
      
      const response = await publicAPI.registerMember(formData);
      
      if (response.success) {
        toast.success('Registration successful! Welcome to BGP!');
        navigate('/registration-success');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  const addChild = () => {
    setChildren([...children, { name: '', date_of_birth: '', gender: '' }]);
  };
  
  const removeChild = (index) => {
    setChildren(children.filter((_, i) => i !== index));
  };
  
  const updateChild = (index, field, value) => {
    const newChildren = [...children];
    newChildren[index][field] = value;
    setChildren(newChildren);
  };
  
  const nextStep = async () => {
    let fieldsToValidate = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'street_address', 'city', 'state', 'zip_code'];
        break;
      case 2:
        // Optional fields, no validation required
        break;
      case 3:
        // Family details are optional
        break;
      default:
        break;
    }
    
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        toast.error('Please fill in all required fields correctly');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-bgp-gray-light flex items-center justify-center">
        <LoadingSpinner size="large" message="Submitting your registration..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-bgp-gray-light py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="bgp-header-1 text-bgp-dark">
            Join Believers Gathering Place
          </h1>
          <p className="text-gray-600 mt-2">
            We're excited to welcome you to our church family!
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-bgp-teal text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
{currentStep > step.id ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-1 mx-4
                    ${currentStep > step.id ? 'bg-bgp-teal' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className="text-xs text-center" style={{ width: '120px' }}>
                {step.title}
              </div>
            ))}
          </div>
        </div>
        
        {/* Form */}
        <div className="bgp-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="bgp-header-2 text-bgp-dark">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="bgp-label">First Name *</label>
                    <input
                      type="text"
                      {...register('first_name', { 
                        required: 'First name is required',
                        minLength: { value: 2, message: 'First name must be at least 2 characters' }
                      })}
                      className="bgp-input"
                      placeholder="Enter your first name"
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="bgp-label">Last Name *</label>
                    <input
                      type="text"
                      {...register('last_name', { 
                        required: 'Last name is required',
                        minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                      })}
                      className="bgp-input"
                      placeholder="Enter your last name"
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="bgp-label">Email Address *</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className="bgp-input"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="bgp-label">Phone Number *</label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[\d\s\-\+\(\)]+$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    className="bgp-input"
                    placeholder="(919) 555-0123"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="bgp-label">Date of Birth *</label>
                  <input
                    type="date"
                    {...register('date_of_birth', { 
                      required: 'Date of birth is required'
                    })}
                    className="bgp-input"
                  />
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="bgp-label">Street Address *</label>
                  <input
                    type="text"
                    {...register('street_address', { 
                      required: 'Street address is required'
                    })}
                    className="bgp-input"
                    placeholder="123 Main Street"
                  />
                  {errors.street_address && (
                    <p className="text-red-500 text-sm mt-1">{errors.street_address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="bgp-label">City *</label>
                    <input
                      type="text"
                      {...register('city', { 
                        required: 'City is required'
                      })}
                      className="bgp-input"
                      placeholder="Wendell"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="bgp-label">State *</label>
                    <select
                      {...register('state', { 
                        required: 'State is required'
                      })}
                      className="bgp-input"
                    >
                      <option value="">Select State</option>
                      <option value="NC">North Carolina</option>
                      <option value="SC">South Carolina</option>
                      <option value="VA">Virginia</option>
                      <option value="GA">Georgia</option>
                      <option value="FL">Florida</option>
                      <option value="TN">Tennessee</option>
                      {/* Add more states as needed */}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="bgp-label">ZIP Code *</label>
                    <input
                      type="text"
                      {...register('zip_code', { 
                        required: 'ZIP code is required',
                        pattern: {
                          value: /^\d{5}(-\d{4})?$/,
                          message: 'Please enter a valid ZIP code'
                        }
                      })}
                      className="bgp-input"
                      placeholder="27591"
                    />
                    {errors.zip_code && (
                      <p className="text-red-500 text-sm mt-1">{errors.zip_code.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Church Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="bgp-header-2 text-bgp-dark">Church Information</h2>
                
                <div>
                  <label className="bgp-label">How did you hear about BGP?</label>
                  <select
                    {...register('referral_source')}
                    className="bgp-input"
                  >
                    <option value="">Please select</option>
                    <option value="friend_family">Friend or Family Member</option>
                    <option value="social_media">Social Media</option>
                    <option value="website">Website</option>
                    <option value="driving_by">Driving By</option>
                    <option value="google_search">Google Search</option>
                    <option value="community_event">Community Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="bgp-label">Baptism Date (if applicable)</label>
                  <input
                    type="date"
                    {...register('baptism_date')}
                    className="bgp-input"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave blank if you haven't been baptized yet
                  </p>
                </div>
                
                <div>
                  <label className="bgp-label">Previous Church (optional)</label>
                  <input
                    type="text"
                    {...register('previous_church')}
                    className="bgp-input"
                    placeholder="Name of your previous church"
                  />
                </div>
              </div>
            )}
            
            {/* Step 3: Family Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="bgp-header-2 text-bgp-dark">Family Details</h2>
                
                <div>
                  <label className="bgp-label">Marital Status</label>
                  <select
                    {...register('marital_status')}
                    className="bgp-input"
                    onChange={(e) => {
                      setValue('marital_status', e.target.value);
                      if (e.target.value !== 'married') {
                        setValue('spouse_name', '');
                      }
                    }}
                  >
                    <option value="">Please select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                
                {watch('marital_status') === 'married' && (
                  <div>
                    <label className="bgp-label">Spouse Name</label>
                    <input
                      type="text"
                      {...register('spouse_name')}
                      className="bgp-input"
                      placeholder="Enter your spouse's name"
                    />
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-bgp-dark">Children</h3>
                    <button
                      type="button"
                      onClick={addChild}
                      className="bgp-btn-secondary text-sm px-4 py-2"
                    >
  Add Child
                    </button>
                  </div>
                  
                  {children.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-4">
                      No children added yet. Click "Add Child" to include your children.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {children.map((child, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-bgp-dark">Child {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeChild(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                              </label>
                              <input
                                type="text"
                                value={child.name}
                                onChange={(e) => updateChild(index, 'name', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Child's name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                              </label>
                              <input
                                type="date"
                                value={child.date_of_birth}
                                onChange={(e) => updateChild(index, 'date_of_birth', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender
                              </label>
                              <select
                                value={child.gender}
                                onChange={(e) => updateChild(index, 'gender', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Step 4: Permissions & Consent */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="bgp-header-2 text-bgp-dark">Permissions & Consent</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('photo_consent')}
                      className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      <strong>Photo/Video Consent:</strong> I consent to photos and videos being taken 
                      during church activities and events for BGP's use.
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('social_media_consent')}
                      className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      <strong>Social Media Consent:</strong> I consent to my image being displayed on 
                      church social media platforms and website.
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('email_consent')}
                      defaultChecked={true}
                      className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      <strong>Email Communications:</strong> I agree to receive church communications, 
                      updates, and newsletters via email.
                    </label>
                  </div>
                  
                  {children.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        {...register('parental_consent')}
                        className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-700">
                        <strong>Parental Consent:</strong> I provide parental consent for my minor 
                        children to participate in church activities and programs.
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="bg-bgp-gray-light p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    By submitting this registration, you acknowledge that the information provided 
                    is accurate and agree to BGP's membership policies. We look forward to 
                    welcoming you to our church family!
                  </p>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bgp-btn-outline"
                >
Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bgp-btn-primary"
                >
Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bgp-btn-secondary"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;