import React, { useState } from 'react';
import { ArrowLeft, User, Car, FileText, Briefcase, IndianRupee, Clock, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';


const BecomePartner = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    pincode: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleNumber: '',
    manufacturingYear: '',
    hasInsurance: false,
    drivingLicense: '',
    aadharNumber: '',
    panNumber: '',
    bankAccount: '',
    ifscCode: '',
    preferredAreas: '',
    workingHours: '',
    experienceLevel: '',
    agreeTerms: false,
    agreeBackgroundCheck: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVehicleTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, vehicleType: type }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Application submitted successfully! We will review your application and contact you soon.');
    // Add your submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
       
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
             <a href='/'><ArrowLeft className="w-5 h-5" /></a>
            <Logo/>            
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">
              Price Calculator
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition">
              Track Package
            </a>
            <a href="#" className="text-blue-600 font-medium">
              Become Partner
            </a>
          </nav>

          <div className="flex items-center space-x-4">
              <Link
              className="hover:bg-blue-600 rounded-sm px-4 py-2 text-gray-700 hover:text-sky-50"
                  to='/login'
              >Login</Link>
              <Link
              className="hover:bg-blue-600 rounded-sm px-4 py-2 text-gray-700 hover:text-sky-50"
                  to='/register'
              >Register</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Become a Delivery Partner
          </h1>
          <p className="text-gray-600 text-lg">
            Join thousands of partners earning flexible income with courierKaro
          </p>
        </div>
      </div>

      {/* Benefits Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IndianRupee className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Earn More</h3>
            <p className="text-gray-600 text-sm">
              Earn ₹15,000-50,000 per month with flexible working hours
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Work Flexibly</h3>
            <p className="text-gray-600 text-sm">
              Choose your own working hours and take breaks when you need
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-yellow-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Get Rewarded</h3>
            <p className="text-gray-600 text-sm">
              Performance bonuses, incentives, and recognition programs
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="text-blue-600" size={20} />
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                </div>
                <p className="text-sm text-gray-600 mb-6">Tell us about yourself</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your-email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="text"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Enter your pincode"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="text-green-600" size={20} />
                  <h2 className="text-xl font-semibold">Vehicle Information</h2>
                </div>
                <p className="text-sm text-gray-600 mb-6">Details about your delivery vehicle</p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Vehicle Type *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleVehicleTypeSelect('Bike/Scooter', '₹300-500/day')}
                      className={`p-4 border-2 rounded-lg text-left transition ${
                        formData.vehicleType === 'Bike/Scooter'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold">Bike/Scooter</div>
                      <div className="text-sm text-gray-600">₹300-500/day</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVehicleTypeSelect('Car/Sedan', '₹500-800/day')}
                      className={`p-4 border-2 rounded-lg text-left transition ${
                        formData.vehicleType === 'Car/Sedan'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold">Car/Sedan</div>
                      <div className="text-sm text-gray-600">₹500-800/day</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVehicleTypeSelect('Auto Rickshaw', '₹400-600/day')}
                      className={`p-4 border-2 rounded-lg text-left transition ${
                        formData.vehicleType === 'Auto Rickshaw'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold">Auto Rickshaw</div>
                      <div className="text-sm text-gray-600">₹400-600/day</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVehicleTypeSelect('Small Truck', '₹800-1000/day')}
                      className={`p-4 border-2 rounded-lg text-left transition ${
                        formData.vehicleType === 'Small Truck'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold">Small Truck</div>
                      <div className="text-sm text-gray-600">₹800-1000/day</div>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVehicleTypeSelect('Large Truck', '₹1200-2000/day')}
                    className={`mt-4 w-full p-4 border-2 rounded-lg text-left transition ${
                      formData.vehicleType === 'Large Truck'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">Large Truck</div>
                    <div className="text-sm text-gray-600">₹1200-2000/day</div>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Model *
                    </label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      placeholder="e.g., Honda Activa, Maruti Swift"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number *
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., DL01AB1234"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturing Year *
                    </label>
                    <input
                      type="text"
                      name="manufacturingYear"
                      value={formData.manufacturingYear}
                      onChange={handleInputChange}
                      placeholder="e.g., 2020"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <input
                      type="checkbox"
                      name="hasInsurance"
                      checked={formData.hasInsurance}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Vehicle has valid insurance
                    </label>
                  </div>
                </div>
              </div>

              {/* Document Details */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-purple-600" size={20} />
                  <h2 className="text-xl font-semibold">Document Details</h2>
                </div>
                <p className="text-sm text-gray-600 mb-6">Required documents for verification</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driving License Number *
                    </label>
                    <input
                      type="text"
                      name="drivingLicense"
                      value={formData.drivingLicense}
                      onChange={handleInputChange}
                      placeholder="Enter license number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Number *
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Aadhar number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number *
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="Enter PAN number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Account Number *
                    </label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleInputChange}
                      placeholder="Enter account number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="Enter IFSC code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Work Preferences */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="text-orange-600" size={20} />
                  <h2 className="text-xl font-semibold">Work Preferences</h2>
                </div>
                <p className="text-sm text-gray-600 mb-6">Tell us about your availability and preferences</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Working Areas *
                    </label>
                    <input
                      type="text"
                      name="preferredAreas"
                      value={formData.preferredAreas}
                      onChange={handleInputChange}
                      placeholder="e.g., Gurgaon, Noida, South Delhi"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours *
                    </label>
                    <select
                      name="workingHours"
                      value={formData.workingHours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select working hours</option>
                      <option value="full-time">Full Time (8+ hours)</option>
                      <option value="part-time">Part Time (4-8 hours)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level *
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select experience</option>
                      <option value="beginner">Beginner (0-1 years)</option>
                      <option value="intermediate">Intermediate (1-3 years)</option>
                      <option value="experienced">Experienced (3+ years)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      required
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeBackgroundCheck"
                      checked={formData.agreeBackgroundCheck}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      required
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      I consent to background verification and document checks
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Submit Application
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Partner Benefits */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">Partner Benefits</h3>
                <ul className="space-y-3">
                  {[
                    'Flexible working hours',
                    'Weekly payments',
                    'Fuel allowance',
                    'Insurance coverage',
                    '24/7 support',
                    'Performance bonuses'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="text-green-600 flex-shrink-0" size={16} />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Earnings */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="text-green-600" size={20} />
                  <h3 className="font-semibold">Earnings</h3>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ₹15,000-50,000
                </div>
                <div className="text-sm text-gray-600 mb-4">Per Month</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Per Delivery:</span>
                    <span className="font-semibold">₹30-150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly Bonus:</span>
                    <span className="font-semibold">Up to ₹2000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Allowance:</span>
                    <span className="font-semibold">₹5-15/delivery</span>
                  </div>
                </div>
              </div>

              {/* Application Process */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">Application Process</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Submit Application</div>
                      <div className="text-xs text-gray-600">Fill the registration form</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Document Verification</div>
                      <div className="text-xs text-gray-600">24-48 hours process</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Start Earning</div>
                      <div className="text-xs text-gray-600">Begin accepting deliveries</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="rounded-xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
                  alt="Delivery Partner"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomePartner;