import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { publicAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RegisterPageEmbedded = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [householdMembers, setHouseholdMembers] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email_consent: true,
      photo_consent: 'not_answered',
      children_photo_consent: 'not_applicable'
    }
  });

  // Watch for marital status changes
  const maritalStatus = watch('marital_status');
  const hasChildren = children.length > 0;

  // Volunteer Interest Options
  const volunteerInterests = [
    { value: 'youth_ministry', label: 'Youth Ministry (e.g., mentoring teens, leading youth groups)' },
    { value: 'choir_worship', label: 'Choir or Worship Team (e.g., singing, playing instruments)' },
    { value: 'outreach', label: 'Outreach (e.g., community service)' },
    { value: 'children_ministry', label: "Children's Ministry (e.g., teaching Sunday school, Vacation Bible School)" },
    { value: 'prayer_ministry', label: 'Prayer Ministry (e.g., leading prayer groups)' },
    { value: 'event_support', label: 'Event Support (e.g., planning events, setup/cleanup for services)' },
    { value: 'other_volunteer', label: 'Other' }
  ];

  // Skills and Talents Options
  const skillsTalents = [
    { value: 'music', label: 'Music (e.g., singing, playing an instrument)' },
    { value: 'teaching', label: 'Teaching (e.g., leading classes, mentoring)' },
    { value: 'technical_skills', label: 'Technical Skills (e.g., audio/video, IT support)' },
    { value: 'creative_arts', label: 'Creative Arts (e.g., graphic design, photography)' },
    { value: 'leadership', label: 'Leadership (e.g., organizing/leading groups, team coordination)' },
    { value: 'hospitality', label: 'Hospitality (e.g., greeting, hosting)' },
    { value: 'crafts', label: 'Crafts (e.g., decorating, building props)' },
    { value: 'other_skills', label: 'Other' }
  ];

  // Small Groups Options
  const smallGroups = [
    { value: 'singles_connect', label: 'Singles Connect', description: 'For singles growing in faith together.' },
    { value: 'marriage_connect', label: 'Marriage Connect', description: 'For couples strengthening their marriage.' },
    { value: 'brother_connect', label: 'Brother Connect', description: "Men's fellowship and accountability." },
    { value: 'sister_connect', label: 'Sister Connect', description: 'Women supporting each other in faith.' },
    { value: 'bgp_kidz_connect', label: 'BGP Kidz Connect', description: 'For children exploring faith.' }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Gather volunteer interests
      const selectedVolunteerInterests = volunteerInterests
        .filter(interest => data[`volunteer_${interest.value}`])
        .map(interest => interest.value);

      // Gather skills and talents
      const selectedSkills = skillsTalents
        .filter(skill => data[`skill_${skill.value}`])
        .map(skill => skill.value);

      // Gather small groups interests
      const selectedSmallGroups = smallGroups
        .filter(group => data[`small_group_${group.value}`])
        .map(group => group.value);

      const formData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        street_address: data.street_address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        country: data.country || 'US',
        baptism_status: data.baptism_status,
        baptism_date: data.baptism_date || null,
        previous_church: data.previous_church || null,
        marital_status: data.marital_status,
        spouse_name: data.spouse_name || null,
        children: children.filter(child => child.name),
        household_members: householdMembers.filter(member => member.name),
        volunteer_interests: selectedVolunteerInterests,
        skills_talents: selectedSkills,
        small_groups: selectedSmallGroups,
        photo_consent: data.photo_consent,
        children_photo_consent: data.children_photo_consent,
        email_consent: data.email_consent,
        social_media_consent: data.social_media_consent || false,
        parental_consent: data.parental_consent || false
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

  // Child management functions
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

  const calculateAge = (birthdate) => {
    if (!birthdate) return '';
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Household member management functions
  const addHouseholdMember = () => {
    setHouseholdMembers([...householdMembers, { name: '', relationship: '', email: '', phone: '' }]);
  };

  const removeHouseholdMember = (index) => {
    setHouseholdMembers(householdMembers.filter((_, i) => i !== index));
  };

  const updateHouseholdMember = (index, field, value) => {
    const newMembers = [...householdMembers];
    newMembers[index][field] = value;
    setHouseholdMembers(newMembers);
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
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Embedded version */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-secondary font-extralight text-bgp-dark mb-3">
            BGP New Members Form
          </h1>
          <p className="text-lg font-medium text-gray-700 mt-2">
            Welcome to Our BGP Family!
          </p>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto font-primary">
            We're thrilled to have you with us on this journey of faith and fellowship. This New Members
            Form helps us get to know you and support your spiritual growth. You'll connect with ministers,
            resources, and ways to engage in our community by filling it out.
          </p>
          <p className="text-gray-600 mt-2 font-primary">
            We can't wait to grow together and build lasting relationships.
          </p>
          <p className="font-semibold text-gray-800 mt-4 font-secondary">
            Believe. Connect. Grow.
          </p>
          <p className="text-gray-600 mt-2 font-primary">
            Ready to get started? Let's do this together!
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-secondary font-extralight text-bgp-dark border-b pb-2">Your Information</h2>

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
                    placeholder="First name"
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
                    placeholder="Last name"
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
                  placeholder="name@example.com"
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
                  placeholder="Mobile"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="bgp-label">Birthdate *</label>
                <input
                  type="date"
                  {...register('date_of_birth', {
                    required: 'Date of birth is required'
                  })}
                  className="bgp-input"
                  placeholder="MM/DD/YYYY"
                />
                {errors.date_of_birth && (
                  <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>
                )}
              </div>

              <div>
                <label className="bgp-label">Gender</label>
                <p className="text-sm text-gray-600 mb-2 font-primary">
                  Please select your gender from the options below. This information helps us personalize your experience
                  and connect you with relevant support or ministries in groups.
                </p>
                <select
                  {...register('gender')}
                  className="bgp-input"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="bgp-label">Marital Status *</label>
                <p className="text-sm text-gray-600 mb-2 font-primary">
                  Please select your current marital status from the options below. This helps us better understand your
                  family situation and connect you with relevant support or ministries.
                </p>
                <select
                  {...register('marital_status', { required: 'Marital status is required' })}
                  className="bgp-input"
                >
                  <option value="">Select...</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
                {errors.marital_status && (
                  <p className="text-red-500 text-sm mt-1">{errors.marital_status.message}</p>
                )}
              </div>

              {/* Conditional Spouse Field */}
              {maritalStatus === 'married' && (
                <div>
                  <label className="bgp-label">Spouse's Name (if applicable) *</label>
                  <p className="text-sm text-gray-600 mb-2 font-primary">
                    If you are married, please provide your spouse's full name. This helps us recognize your family unit and connect
                    you both with our community and ministries.
                  </p>
                  <input
                    type="text"
                    {...register('spouse_name', {
                      required: maritalStatus === 'married' ? 'Spouse name is required when married' : false
                    })}
                    className="bgp-input"
                    placeholder="Spouse's full name"
                  />
                  {errors.spouse_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.spouse_name.message}</p>
                  )}
                </div>
              )}

              {/* Household Members Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-lg font-semibold font-secondary text-bgp-dark">Household Members</h3>
                    <p className="text-sm text-gray-600 mt-1 font-primary">
                      Please provide details about other members of your household. This helps us connect your family with age-
                      appropriate ministries, events, and support. Please note any allergies or medical conditions (e.g., asthma,
                      peanut allergy).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addHouseholdMember}
                    className="bgp-btn-secondary text-sm px-4 py-2 whitespace-nowrap"
                  >
                    + Add adult
                  </button>
                </div>

                {householdMembers.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg font-primary">
                    No household members added yet. Click "+ Add adult" to include other adults in your household.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {householdMembers.map((member, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium font-secondary text-bgp-dark">Household Member {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeHouseholdMember(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateHouseholdMember(index, 'name', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md font-primary"
                              placeholder="Full name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                              Relationship
                            </label>
                            <input
                              type="text"
                              value={member.relationship}
                              onChange={(e) => updateHouseholdMember(index, 'relationship', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md font-primary"
                              placeholder="e.g., parent, sibling"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={member.email}
                              onChange={(e) => updateHouseholdMember(index, 'email', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md font-primary"
                              placeholder="email@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={member.phone}
                              onChange={(e) => updateHouseholdMember(index, 'phone', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md font-primary"
                              placeholder="Phone number"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Children Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold font-secondary text-bgp-dark">Children</h3>
                  <button
                    type="button"
                    onClick={addChild}
                    className="bgp-btn-secondary text-sm px-4 py-2"
                  >
                    + Add child
                  </button>
                </div>

                {children.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg font-primary">
                    No children added yet. Click "+ Add child" to include your children.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {children.map((child, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium font-secondary text-bgp-dark">Child {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeChild(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                              Name *
                            </label>
                            <input
                              type="text"
                              value={child.name}
                              onChange={(e) => updateChild(index, 'name', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md font-primary"
                              placeholder="Child's name"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                              Birthday *
                            </label>
                            <input
                              type="date"
                              value={child.date_of_birth}
                              onChange={(e) => updateChild(index, 'date_of_birth', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md font-primary"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                              Age
                            </label>
                            <input
                              type="text"
                              value={calculateAge(child.date_of_birth)}
                              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 font-primary"
                              placeholder="Auto-calculated"
                              disabled
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                              Gender
                            </label>
                            <select
                              value={child.gender}
                              onChange={(e) => updateChild(index, 'gender', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md font-primary"
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

              {/* Baptism Status */}
              <div>
                <label className="bgp-label">Baptism Status</label>
                <p className="text-sm text-gray-600 mb-2 font-primary">
                  Please let us know your baptism stance. This helps us understand your spiritual journey and connect with
                  resources or opportunities, such as baptism classes, to support you in your faith.
                </p>
                <select
                  {...register('baptism_status')}
                  className="bgp-input"
                >
                  <option value="">Select...</option>
                  <option value="baptized">Baptized</option>
                  <option value="not_baptized">Not Baptized</option>
                  <option value="planning_to">Planning To</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="bgp-label">Address *</label>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      {...register('country')}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="US">🇺🇸</option>
                    </select>
                  </div>

                  <div className="col-span-11">
                    <label className="block text-sm font-medium font-secondary text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      {...register('street_address', {
                        required: 'Street address is required'
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md font-primary"
                      placeholder="Street Address"
                    />
                    {errors.street_address && (
                      <p className="text-red-500 text-sm mt-1">{errors.street_address.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div>
                    <input
                      type="text"
                      {...register('city', {
                        required: 'City is required'
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md font-primary"
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <select
                      {...register('state', {
                        required: 'State is required'
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md font-primary"
                    >
                      <option value="">State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      {...register('zip_code', {
                        required: 'ZIP code is required',
                        pattern: {
                          value: /^\d{5}(-\d{4})?$/,
                          message: 'Please enter a valid ZIP code'
                        }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md font-primary"
                      placeholder="Postal code"
                    />
                    {errors.zip_code && (
                      <p className="text-red-500 text-sm mt-1">{errors.zip_code.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Areas of Interest for Volunteering */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-secondary font-extralight text-bgp-dark border-b pb-2 mb-4">
                  Areas of Interest for Volunteering Section
                </h2>
                <p className="text-sm text-gray-600 mb-4 font-primary">
                  We're thrilled that you want to serve in our community! Please select the areas where you're interested in
                  volunteering. This helps us match you with ministries and opportunities that align with your passions, such as youth
                  ministry, worship, or event planning.
                </p>

                <div className="space-y-3">
                  {volunteerInterests.map((interest) => (
                    <div key={interest.value} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        {...register(`volunteer_${interest.value}`)}
                        className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                        id={`volunteer_${interest.value}`}
                      />
                      <label
                        htmlFor={`volunteer_${interest.value}`}
                        className="text-sm text-gray-700 cursor-pointer font-primary"
                      >
                        {interest.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills and Talents */}
              <div>
                <h3 className="text-lg font-semibold font-secondary text-bgp-dark mb-2">
                  Skills and Talents (e.g., music, teaching, technical skills)
                </h3>
                <p className="text-sm text-gray-600 mb-4 font-primary">
                  We'd love to learn about your skills and talents! Sharing this helps us connect you with meaningful volunteer
                  opportunities or ministries where you can serve and grow, such as music, teaching, or technical support.
                </p>

                <div className="space-y-3">
                  {skillsTalents.map((skill) => (
                    <div key={skill.value} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        {...register(`skill_${skill.value}`)}
                        className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                        id={`skill_${skill.value}`}
                      />
                      <label
                        htmlFor={`skill_${skill.value}`}
                        className="text-sm text-gray-700 cursor-pointer font-primary"
                      >
                        {skill.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Small Groups */}
              <div>
                <h3 className="text-lg font-semibold font-secondary text-bgp-dark mb-2">
                  Small Groups Interest
                </h3>
                <p className="text-sm text-gray-600 mb-4 font-primary">
                  Small groups are a great way to connect with others and grow in your faith! Please select any small groups
                  you'd like to learn more about or join.
                </p>

                <div className="space-y-3">
                  {smallGroups.map((group) => (
                    <div key={group.value} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        {...register(`small_group_${group.value}`)}
                        className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                        id={`small_group_${group.value}`}
                      />
                      <label
                        htmlFor={`small_group_${group.value}`}
                        className="text-sm text-gray-700 cursor-pointer font-primary"
                      >
                        <span className="font-semibold">{group.label}</span>
                        <span className="text-gray-600"> - {group.description}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo & Media Release Consent */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-secondary font-extralight text-bgp-dark border-b pb-2 mb-4">
                  Photo & Media Release Consent *
                </h2>
                <p className="text-sm text-gray-600 mb-4 font-primary">
                  We like sharing moments and spreading the word about our community! Please indicate below whether you permit
                  Believers Gathering Place to use your photos or videos that may include you or your children in our church
                  website, social media (Facebook, Instagram, etc.), promotional materials, or other church-related communications.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      {...register('photo_consent', { required: 'Please select a photo consent option' })}
                      value="yes"
                      className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300"
                      id="photo_consent_yes"
                    />
                    <label htmlFor="photo_consent_yes" className="text-sm text-gray-700 cursor-pointer font-primary">
                      Yes, I consent to the use of my image in photos and videos for church purposes.
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      {...register('photo_consent')}
                      value="no"
                      className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300"
                      id="photo_consent_no"
                    />
                    <label htmlFor="photo_consent_no" className="text-sm text-gray-700 cursor-pointer font-primary">
                      No, I do not consent to the use of my image in photos and videos.
                    </label>
                  </div>

                  {hasChildren && (
                    <>
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          {...register('children_photo_consent')}
                          value="yes"
                          className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300"
                          id="children_consent_yes"
                        />
                        <label htmlFor="children_consent_yes" className="text-sm text-gray-700 cursor-pointer font-primary">
                          Children's Consent (if applicable): Yes, I consent to the use of my children's images in photos and videos for
                          church purposes.
                        </label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          {...register('children_photo_consent')}
                          value="no"
                          className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300"
                          id="children_consent_no"
                        />
                        <label htmlFor="children_consent_no" className="text-sm text-gray-700 cursor-pointer font-primary">
                          Children's Consent (if applicable): No, I do not consent to the use of my children's images in photos and videos.
                        </label>
                      </div>

                      <div className="flex items-start space-x-3 mt-4">
                        <input
                          type="checkbox"
                          {...register('parental_consent')}
                          className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                          id="parental_consent"
                        />
                        <label htmlFor="parental_consent" className="text-sm text-gray-700 cursor-pointer font-primary">
                          <strong>Parental Consent:</strong> I provide parental consent for my minor children to participate in church
                          activities and programs.
                        </label>
                      </div>
                    </>
                  )}
                </div>
                {errors.photo_consent && (
                  <p className="text-red-500 text-sm mt-2">{errors.photo_consent.message}</p>
                )}
              </div>

              {/* Email Communications */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('email_consent')}
                  defaultChecked={true}
                  className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                  id="email_consent"
                />
                <label htmlFor="email_consent" className="text-sm text-gray-700 cursor-pointer font-primary">
                  <strong>Email Communications:</strong> I agree to receive church communications, updates, and newsletters via email.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('social_media_consent')}
                  className="mt-1 h-4 w-4 text-bgp-teal focus:ring-bgp-teal border-gray-300 rounded"
                  id="social_media_consent"
                />
                <label htmlFor="social_media_consent" className="text-sm text-gray-700 cursor-pointer font-primary">
                  <strong>Social Media Consent:</strong> I consent to my image being displayed on church social media platforms and
                  website.
                </label>
              </div>
            </div>

            {/* Final Acknowledgment */}
            <div className="bg-bgp-gray-light p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed font-primary">
                By submitting this registration, you acknowledge that the information provided is accurate and agree to BGP's
                membership policies. We look forward to welcoming you to our church family and supporting you on your spiritual
                journey!
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="bgp-btn-secondary px-12 py-3 text-lg"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 mt-6 font-primary">
          <p>This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPageEmbedded;
