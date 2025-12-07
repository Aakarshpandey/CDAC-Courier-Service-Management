import React, { useState } from 'react';
import { Package, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Package className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">courierKaro</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNavigation('/price-calculator')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Price Calculator
            </button>
            <button 
              onClick={() => handleNavigation('/track-package')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Track Package
            </button>
            <button 
              onClick={() => handleNavigation('/become-partner')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Become Partner
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => handleNavigation('/login')}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Login
            </button>
            <button 
              onClick={() => handleNavigation('/register')}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleNavigation('/price-calculator')}
                className="text-gray-700 hover:text-blue-600 font-medium text-left"
              >
                Price Calculator
              </button>
              <button 
                onClick={() => handleNavigation('/track-package')}
                className="text-gray-700 hover:text-blue-600 font-medium text-left"
              >
                Track Package
              </button>
              <button 
                onClick={() => handleNavigation('/become-partner')}
                className="text-gray-700 hover:text-blue-600 font-medium text-left"
              >
                Become Partner
              </button>
              <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="text-gray-700 hover:text-blue-600 font-medium text-left"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNavigation('/register')}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium text-center"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}