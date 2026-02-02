import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/NavBar/Navbar';
import CustomerOrders from '../../components/CustomerOrders/CustomerOrders';

const OrderHistory = () => {
  const navigate = useNavigate();
  const user = { name: localStorage.getItem('userName') };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/user-dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">View all your orders and rate completed deliveries</p>
        </div>

        {/* Order History Component */}
        <CustomerOrders />
      </div>
    </div>
  );
};

export default OrderHistory;
