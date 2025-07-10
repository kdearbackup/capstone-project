// Login.js
import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fullAccessUsers = import.meta.env.VITE_FULL_ACCESS_USERS.split(',');
  const partialAccessUsers = import.meta.env.VITE_PARTIAL_ACCESS_USERS.split(',');
  const limitedAccessUsers = import.meta.env.VITE_LIMITED_ACCESS_USERS.split(',');


  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication logic (replace with real authentication)
    if ((fullAccessUsers.includes(username) || partialAccessUsers.includes(username) || limitedAccessUsers.includes(username)) && password === 'password') {
      onLogin(username);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
