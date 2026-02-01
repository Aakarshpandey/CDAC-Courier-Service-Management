import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ============================================================================
// Auth Pages
// ============================================================================
import Login from "./pages/Login/Login";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Registration from "./pages/Registration/Registration";
import AuthCallback from "./components/AuthCallback/AuthCallback";

// ============================================================================
// Public Pages
// ============================================================================
import Home from "./pages/Home/Home";
import BecomePartner from "./pages/BecomePartner/BecomePartner";
import PriceCalculator from "./pages/PriceCalculator/PriceCalculator";
import TrackPackage from "./pages/TrackPackage/TrackPackage";

// ============================================================================
// User Pages
// ============================================================================
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import UserEditProfile from "./pages/UserEditProfile/UserEditProfile";
import AppSetting from "./pages/AppSetting/AppSetting";
import BookingDetails from "./pages/BookingDetails/BookingDetails";
import OrderDetails from "./pages/OrderDetails/OrderDetails";

// ============================================================================
// Partner Pages
// ============================================================================
import PartnerDashboard from "./pages/PartnerDashboard/PartnerDashboard";
import PartnerEditProfile from "./pages/PartnerEditProfile/PartnerEditProfile";
import PartnerAppSetting from "./pages/PartnerAppSettings/PartnerAppSettings";
import AcceptOrder from "./pages/AcceptOrder/AcceptOrder";
import DetailedEarnings from "./pages/DetailedEarnings/DetailedEarnings";
import PaymentSettings from "./pages/PaymentSettings/PaymentSettings";

// ============================================================================
// Admin Pages
// ============================================================================
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

// ============================================================================
// App Component
// ============================================================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================================================================ */}
        {/* Public Routes */}
        {/* ================================================================ */}
        <Route path="/" element={<Home />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/price-calculator" element={<PriceCalculator />} />
        <Route path="/track-package" element={<TrackPackage />} />

        {/* ================================================================ */}
        {/* Auth Routes */}
        {/* ================================================================ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/auth-callback" element={<AuthCallback />} />

        {/* ================================================================ */}
        {/* User Routes */}
        {/* ================================================================ */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-edit-profile" element={<UserEditProfile />} />
        <Route path="/app-setting" element={<AppSetting />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/order/:id" element={<OrderDetails />} />

        {/* ================================================================ */}
        {/* Partner Routes */}
        {/* ================================================================ */}
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
        <Route path="/partner-edit-profile" element={<PartnerEditProfile />} />
        <Route path="/partner-app-setting" element={<PartnerAppSetting />} />
        <Route path="/accept-order" element={<AcceptOrder />} />
        <Route path="/detailed-earnings" element={<DetailedEarnings />} />
        <Route path="/payment-settings" element={<PaymentSettings />} />

        {/* ================================================================ */}
        {/* Admin Routes */}
        {/* ================================================================ */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;

