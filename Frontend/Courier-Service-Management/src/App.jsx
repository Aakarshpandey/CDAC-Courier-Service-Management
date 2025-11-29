import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

function App() {
  return (
    <div>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />}></Route>
          <Route path="/home" element={<Home />} />
        </Routes>
      {/* <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />}></Route>
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router> */}
      <ToastContainer />
    </div>
  );
}

export default App;
