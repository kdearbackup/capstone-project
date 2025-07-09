// App.js
import React from 'react';
import Home from './components/Home';
import LookupPage from './components/LookupPage';
import SettingsPage from './components/SettingsPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
    <nav>
      <Link to="/">Home</Link> | 
      <Link to="/lookup">Lookup Page</Link> | 
      <Link to="/settings">Settings</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lookup" element={<LookupPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
