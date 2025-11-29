import React from 'react';
import { Package, Clock, Shield, MapPin, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">courierKaro</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Price Calculator</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Track Package</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Become Partner</a>
            </div>
            
            {/* Auth Buttons */}
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Fast & Reliable Delivery</span>
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Your Delivery Partner for{' '}
                <span className="text-blue-600">Every Mile</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Experience lightning-fast courier services with real-time tracking, 
                secure handling, and nationwide coverage. Your packages, delivered with care.
              </p>
              
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                  Get Started Today
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium">
                  View Pricing
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Cities Covered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">On-time Delivery</div>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&h=600&fit=crop" 
                  alt="FedEx Delivery Truck" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              
              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">2-4 Hours</div>
                  <div className="text-sm text-gray-600">Express Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose courierKaro?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with reliable service to deliver your packages 
              safely and on time, every time.
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Express delivery within 2-4 hours in metro cities
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your packages in real-time with live updates
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600">
                100% insurance coverage for all your packages
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wide Coverage</h3>
              <p className="text-gray-600">
                Delivery across 500+ cities nationwide
              </p>
            </div>
          </div>

          {/* Built for Business Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-gray-400 text-6xl font-bold">//</div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Built for Your Business Needs
              </h2>
              <p className="text-gray-600 mb-8">
                Whether you're sending important documents or precious packages, our 
                comprehensive courier service has got you covered.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">No minimum order value</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Flexible pickup times</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Competitive pricing</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Professional handling</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">SMS & email notifications</span>
                </div>
              </div>
              
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                Start Shipping Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience Swift Delivery?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust us with their deliveries.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-medium">
              Sign Up Free
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Package className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-bold text-white">courierKaro</span>
              </div>
              <p className="text-sm">
                Your trusted partner for fast, reliable, and secure courier services.
              </p>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Express Delivery</a></li>
                <li><a href="#" className="hover:text-white">Standard Delivery</a></li>
                <li><a href="#" className="hover:text-white">International Shipping</a></li>
                <li><a href="#" className="hover:text-white">Bulk Orders</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Partners</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Track Package</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 SwiftCourier. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}