import React, { useState,useEffect } from 'react';
import { Package, TrendingUp, Users, DollarSign, MapPin, Eye, Edit, Search, Filter, Download, Plus, Bike, Car, Truck, Star, Check, X, FileText, Phone, Mail, CreditCard } from 'lucide-react';
import Navbar from '../../components/NavBar/Navbar';
import { getShipments, getAllOrders } from '../../services/shipments';
import { getSuspendedPartners, approvePartner, rejectPartner } from '../../services/PartnerService';
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [tabData, setTabData] = useState({
    recentOrders: [],
    allOrders: [],
    applications: [],
    customers: [],
    analytics: []
  });

  const [loadingApplications, setLoadingApplications] = useState(false);


//useEffect to call API when tab changes
useEffect(() => {
  const fetchTabData = async () => {
    switch (activeTab) {
      case 'overview':
        if (!tabData.recentOrders || tabData.recentOrders.length === 0) {
          try {
            const response = await getShipments();
            setTabData(prev => ({ ...prev, recentOrders: response }));
          } catch (error) {
            console.error('Failed to fetch recent orders:', error);
          }
        }
        break;
      
      case 'orders':
        // Fetch all orders when orders tab is active
        if (!tabData.allOrders || tabData.allOrders.length === 0) {
          try {
            const response = await getAllOrders();
            setTabData(prev => ({ ...prev, allOrders: response }));
            console.log("All Orders:", response);
          } catch (error) {
            console.error('Failed to fetch all orders:', error);
          }
        }
        break;
      
      case 'applications':
        // Fetch suspended partners when applications tab is active
        if (!tabData.applications || tabData.applications.length === 0) {
          setLoadingApplications(true);
          try {
            const applicationsData = await getSuspendedPartners();
            setTabData(prev => ({ ...prev, applications: applicationsData }));
          } catch (error) {
            console.error('Failed to fetch partner applications:', error);
          } finally {
            setLoadingApplications(false);
          }
        }
        break;
      
      case 'customers':
        // Fetch customers when customers tab is active
        if (!tabData.customers || tabData.customers.length === 0) {
          // const customersData = await getCustomers();
          // setTabData(prev => ({ ...prev, customers: customersData }));
        }
        break;
      
      default:
        break;
    }
  };

  fetchTabData();
}, [activeTab]); // This runs whenever activeTab changes
  

  // Sample data

  // admin
  const adminUser = { name: "Rohan Sharma" };

  const stats = {
    totalOrders: 2847,
    ordersChange: '+12.5%',
    activeDeliveries: 156,
    activePartners: 89,
    partnersOnline: 67,
    todayRevenue: 45780,
    revenueChange: '+8.2%'
  };

 

  const allOrders = [
    { id: 'CK001234', customer: 'Priya Singh', route: 'Connaught Place, Delhi → Sector 62, Noida', partner: 'Rajesh Kumar', status: 'IN TRANSIT', amount: 450 },
    { id: 'CK001235', customer: 'Arjun Mehta', route: 'Bandra West, Mumbai → Andheri East, Mumbai', partner: 'Suresh Patil', status: 'DELIVERED', amount: 250 },
    { id: 'CK001236', customer: 'Sneha Reddy', route: 'Koramangala, Bangalore → Whitefield, Bangalore', partner: 'Unassigned', status: 'PENDING', amount: 380 }
  ];

  // Handler for approving a partner application
  const handleApprovePartner = async (partnerId) => {
    try {
      await approvePartner(partnerId);
      // Refresh the applications list
      const updatedApplications = await getSuspendedPartners();
      setTabData(prev => ({ ...prev, applications: updatedApplications }));
      alert('Partner approved successfully!');
    } catch (error) {
      console.error('Failed to approve partner:', error);
      alert('Failed to approve partner. Please try again.');
    }
  };

  // Handler for rejecting a partner application
  const handleRejectPartner = async (partnerId) => {
    if (window.confirm('Are you sure you want to reject this partner application?')) {
      try {
        await rejectPartner(partnerId);
        // Refresh the applications list
        const updatedApplications = await getSuspendedPartners();
        setTabData(prev => ({ ...prev, applications: updatedApplications }));
        alert('Partner application rejected.');
      } catch (error) {
        console.error('Failed to reject partner:', error);
        alert('Failed to reject partner. Please try again.');
      }
    }
  };

  const customers = [
    { id: 'CU001', name: 'Priya Singh', email: 'priya.singh@email.com', contact: '+91 98765 43210', totalOrders: 45, totalSpent: 12500, status: 'ACTIVE', lastOrder: '1/20/2024' },
    { id: 'CU002', name: 'Arjun Mehta', email: 'arjun.mehta@email.com', contact: '+91 87654 32109', totalOrders: 32, totalSpent: 8900, status: 'ACTIVE', lastOrder: '1/19/2024' },
    { id: 'CU003', name: 'Sneha Reddy', email: 'sneha.reddy@email.com', contact: '+91 76543 21098', totalOrders: 28, totalSpent: 7200, status: 'ACTIVE', lastOrder: '1/18/2024' },
    { id: 'CU004', name: 'Rahul Sharma', email: 'rahul.sharma@email.com', contact: '+91 65432 10987', totalOrders: 67, totalSpent: 18400, status: 'PREMIUM', lastOrder: '1/21/2024' },
    { id: 'CU005', name: 'Kavya Patel', email: 'kavya.patel@email.com', contact: '+91 54321 09876', totalOrders: 23, totalSpent: 5600, status: 'ACTIVE', lastOrder: '1/17/2024' }
  ];

  const weeklyData = [
    { day: 'Mon', orders: 45, revenue: 6750 },
    { day: 'Tue', orders: 52, revenue: 7800 },
    { day: 'Wed', orders: 38, revenue: 5700 },
    { day: 'Thu', orders: 61, revenue: 9150 },
    { day: 'Fri', orders: 55, revenue: 8250 },
    { day: 'Sat', orders: 73, revenue: 10950 },
    { day: 'Sun', orders: 67, revenue: 10050 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN TRANSIT': return 'bg-blue-100 text-blue-700';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'OFFLINE': return 'bg-gray-100 text-gray-700';
      case 'PREMIUM': return 'bg-purple-100 text-purple-700';
      case 'SUSPENDED': return 'bg-orange-100 text-orange-700';
      case 'INACTIVE': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar user={adminUser} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Admin! 📦
          </h1>
          <p className="text-gray-600">Manage your courier operations from one central dashboard.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Total Orders</span>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalOrders.toLocaleString()}</div>
            <div className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {stats.ordersChange} from last month
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Active Deliveries</span>
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.activeDeliveries}</div>
            <div className="text-orange-600 text-sm">⏱️ Real-time tracking</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Active Partners</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.activePartners}</div>
            <div className="text-green-600 text-sm">✓ {stats.partnersOnline} online now</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Today's Revenue</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold mb-1">₹{stats.todayRevenue.toLocaleString()}</div>
            <div className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {stats.revenueChange} from yesterday
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {['overview', 'orders', 'applications', 'customers', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Recent Orders</h2>
                <p className="text-gray-600 text-sm">Latest delivery requests and their status</p>
              </div>
              <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {tabData.recentOrders.map((order) => (
                <div key={order.shipmentId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{order.shipmentId}</div>
                      <div className="text-sm text-gray-600">{order.firstName + " " + order.lastName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <div className="text-right">
                      <div className="font-semibold">₹{order.amount}</div>
                      <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">All Orders</h2>
                <p className="text-gray-600 text-sm">Manage and track all delivery orders</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm flex items-center gap-2 hover:bg-gray-800">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr className="text-left">
                    <th className="pb-3 text-sm font-medium text-gray-600">Order ID</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Customer</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Route</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Partner</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Amount</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tabData.allOrders.map((order) => (
                    <tr key={order.shipmentId} className="border-b border-gray-100">
                      <td className="py-4 text-sm font-medium">{order.shipmentId}</td>
                      <td className="py-4 text-sm">{order.firstName + " " + order.lastName}</td>
                      <td className="py-4 text-sm text-gray-600 max-w-xs">
                        <div className="flex items-center gap-1">
                          <span className="truncate">{order.pickupAddress}</span>
                          <span>→</span>
                          <span className="truncate">{order.deliveryAddress}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm">{order.partnerFirstName + " " + order.partnerLastName}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-medium">₹{order.amount}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Partner Applications</h2>
                <p className="text-gray-600 text-sm">Review and approve pending partner applications</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {tabData.applications.length} pending application{tabData.applications.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            {loadingApplications ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading applications...</p>
              </div>
            ) : tabData.applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending applications</p>
              </div>
            ) : (
              <div className="space-y-6">
                {tabData.applications.map((application) => (
                  <div key={application.partnerId} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {application.userId?.firstName?.charAt(0) || 'P'}{application.userId?.lastName?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {application.userId?.firstName} {application.userId?.lastName}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprovePartner(application.partnerId)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectPartner(application.partnerId)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Contact Information */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact Information</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{application.userId?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{application.userId?.phoneNumber || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Vehicle Information */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Vehicle Details</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{application.vehicleTypeId?.typeName || 'N/A'}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Reg: {application.vehicleRegNumber || 'N/A'}</div>
                          <div>Model: {application.vehicleModel || 'N/A'}</div>
                        </div>
                      </div>

                      {/* Location Information */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Location</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{application.preferredCity || 'N/A'}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Pincode: {application.pincode || 'N/A'}
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Documents</h4>
                        <div className="text-sm text-gray-600">
                          <div>License: {application.drivingLiscenseNumber || 'N/A'}</div>
                          <div>PAN: {application.panNumber || 'N/A'}</div>
                          <div>Aadhar: {application.aadharNumber || 'N/A'}</div>
                        </div>
                      </div>

                      {/* Banking Information */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Banking</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CreditCard className="w-4 h-4" />
                          <span>{application.bankAccountNumber || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Info</h4>
                        <div className="text-sm text-gray-600">
                          <div>Insurance: {application.validInsurance ? '✓ Valid' : '✗ Invalid'}</div>
                          <div>Address: {application.driverAddress || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Customer Management</h2>
                <p className="text-gray-600 text-sm">View and manage customer accounts</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr className="text-left">
                    <th className="pb-3 text-sm font-medium text-gray-600">Customer ID</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Name</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Contact</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Total Orders</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Total Spent</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Last Order</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100">
                      <td className="py-4 text-sm font-medium">{customer.id}</td>
                      <td className="py-4">
                        <div>
                          <div className="text-sm font-medium">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{customer.contact}</td>
                      <td className="py-4 text-sm">{customer.totalOrders}</td>
                      <td className="py-4 text-sm font-medium">₹{customer.totalSpent.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{customer.lastOrder}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-1">Weekly Performance</h2>
              <p className="text-gray-600 text-sm mb-6">Orders and revenue for the past week</p>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {day.day.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{day.day}</div>
                      <div className="flex gap-8">
                        <div>
                          <span className="text-sm text-gray-600">Orders: </span>
                          <span className="font-semibold">{day.orders}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Revenue: </span>
                          <span className="font-semibold text-green-600">₹{day.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold mb-2">Popular Vehicles</h3>
                <p className="text-sm text-gray-600 mb-4">Vehicle type distribution</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bike className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">Bike</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Car</span>
                    </div>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-orange-600" />
                      <span className="text-sm">Truck</span>
                    </div>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold mb-2">Top Delivery Areas</h3>
                <p className="text-sm text-gray-600 mb-4">Most active delivery locations</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span className="text-sm">Mumbai</span>
                    </div>
                    <span className="text-sm font-medium">487 orders</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span className="text-sm">Delhi</span>
                    </div>
                    <span className="text-sm font-medium">423 orders</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span className="text-sm">Bangalore</span>
                    </div>
                    <span className="text-sm font-medium">389 orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}