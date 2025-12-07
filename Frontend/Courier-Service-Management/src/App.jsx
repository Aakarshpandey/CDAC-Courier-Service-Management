import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import BecomePartner from "./pages/BecomePartner/BecomePartner";
import TrackPackage from "./pages/TrackPackage/TrackPackage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import PriceCalculator from "./pages/PriceCalculator/PriceCalculator";
import PageDashboard from "./pages/PartnerDashboard/PartnerDashboard";
import BookingDetails from "./pages/BookingDetails/BookingDetails"
import UserDashboard from "./pages/UserDashboard/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />}></Route>
        <Route path="/" element={ <Home />} />
        <Route path="/trackpackage" element={<TrackPackage/>}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}></Route>
        <Route path="/price-calculator" element={<PriceCalculator />} />
        <Route path="/become-partner" element={<BecomePartner />}></Route>
        <Route path="/partner-dashboard" element={<PageDashboard />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
