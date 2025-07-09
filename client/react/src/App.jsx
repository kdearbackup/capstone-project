// App.js
import React, { useState } from 'react';
import Home from './components/Home';
import LookupPage from './components/LookupPage';
import SettingsPage from './components/SettingsPage';
import Login from './components/Login';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    console.log(user)
    setUsername(user);
  };

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">MyApp</Link>
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
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lookup" element={<LookupPage />} />
            <Route path="/settings" element={<SettingsPage username={username}/>} />
          </Routes>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
