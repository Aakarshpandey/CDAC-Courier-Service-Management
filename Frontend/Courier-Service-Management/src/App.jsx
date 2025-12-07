import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import BecomePartner from "./pages/BecomePartner/BecomePartner";
import PriceCalculator from "./pages/PriceCalculator/PriceCalculator";
import Navbar from "./components/Navbar/Navbar";
import PageDashboard from "./pages/PartnerDashboard/PartnerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/price-calculator" element={<PriceCalculator />} />
        <Route path="/become-partner" element={<BecomePartner />}></Route>
        <Route path="/partner-dashboard" element={<PageDashboard />} />
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
