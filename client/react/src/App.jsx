// App.js
import React, { useState } from 'react';
import Home from './components/Home';
import LookupPage from './components/LookupPage';
import SettingsPage from './components/SettingsPage';
import Login from './components/Login';
import PredictedSalary from './components/salaryPrediction';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [permissionLevel, setPermissionLevel] = useState('')

  //Split stuff so it forms an array
  const fullAccessUsers = import.meta.env.VITE_FULL_ACCESS_USERS.split(',');
  const partialAccessUsers = import.meta.env.VITE_PARTIAL_ACCESS_USERS.split(',');
  const limitedAccessUsers = import.meta.env.VITE_LIMITED_ACCESS_USERS.split(',');

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user);

    // Check if user is in list for different access levels
    if (fullAccessUsers.includes(user)) {
      setPermissionLevel('full');
    } else if (partialAccessUsers.includes(user)) {
      setPermissionLevel('partial');
    } else if (limitedAccessUsers.includes(user)) {
      setPermissionLevel('limited');
    }

  };

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
        <Link className="navbar-brand" to="/">
            <img src="/travImage.png" alt="Logo" style={{ height: '40px' }} />
          </Link>          
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/lookup">Lookup Page</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settings">Settings</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/predict-salary">Predict Salary </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Home username={username}/>} />
            <Route path="/lookup" element={<LookupPage />} />
            <Route path="/settings" element={<SettingsPage username={username} permissionLevel={permissionLevel}/>} />
            <Route path="/predict-salary" element={<PredictedSalary />} />
          </Routes>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
