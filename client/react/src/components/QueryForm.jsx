import React, { useState } from 'react';

const QueryForm = ({ onQuery }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the query parameters to the parent component or function
    onQuery({ name, phoneNumber, jobRole, location });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label>Full Name :</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Phone Number :</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Job Role :</label>
        <select value={jobRole} onChange={(e) => setJobRole(e.target.value)}>
          <option value="">Select a job role</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
          <option value="analyst">Analyst</option>
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Location :</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select a location</option>
          <option value="new-york">New York</option>
          <option value="washington-dc">Washington DC</option>
          <option value="boston">Boston</option>
          <option value="hartford">Hartford</option>
        </select>
      </div>
      <button type="submit">Search</button>
    </form>
  );
};

export default QueryForm;
