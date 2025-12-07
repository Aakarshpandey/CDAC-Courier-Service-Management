import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import BecomePartner from "./pages/BecomePartner/BecomePartner";
import TrackPackage from "./pages/TrackPackage/TrackPackage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />}></Route>
        <Route path="/" element={ <Home />} />
        <Route path="/becomepartner" element={<BecomePartner />}></Route>
        <Route path="/trackpackage" element={<TrackPackage/>}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}></Route>
      </Routes>
      {/* <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />}></Route>
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router> */}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
