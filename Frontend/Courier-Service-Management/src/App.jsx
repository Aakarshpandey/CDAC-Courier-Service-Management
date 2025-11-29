import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration/Registration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;