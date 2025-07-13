import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fullAccessUsers = import.meta.env.VITE_FULL_ACCESS_USERS.split(',');
  const partialAccessUsers = import.meta.env.VITE_PARTIAL_ACCESS_USERS.split(',');
  const limitedAccessUsers = import.meta.env.VITE_LIMITED_ACCESS_USERS.split(',');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple authentication logic (replace with real authentication)
    
      try {
        const response = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: username,
            password: password,
          }),
          credentials: 'include', // Ensure cookies are included in the request
        });

        const data = await response.json();

        if (data.success) {
          console.log("THis part worked")
          onLogin(username); 
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
    } 

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />
      </div>
      <button type="submit" className="form-button">Login</button>
    </form>
  );
}

export default Login;
