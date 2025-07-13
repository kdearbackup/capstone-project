import React, { useState } from 'react';
import QueryForm from "./QueryForm";

const LookupPage = () => {
  const [results, setResults] = useState([]);

  const searchEmployees = async (searchCriteria) => {
    console.log(searchCriteria);
    try {
      const response = await fetch('http://localhost:4000/api/user-details/employees/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // IMPORTANT: Add this header
        },
        credentials: 'include',
        body: JSON.stringify(searchCriteria), // Stringify only once here
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      setResults(data.data || []);
    } catch (error) {
      console.error('Error searching employees:', error);
    }
  };

  const handleQuery = (queryParams) => {
    const filteredQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => value !== '')
    );

    // Pass the object directly, do NOT stringify here
    searchEmployees(filteredQueryParams);
  };

  return (
    <div className="lookup-container">
      <h2 className="lookup-title">Lookup Page</h2>
      <p className="lookup-description">Look up people's stuff (coming soon)</p>

      <QueryForm onQuery={handleQuery} />
      {results.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Salary</th>
              <th>Job Title</th>
            </tr>
          </thead>
          <tbody>
            {results.map((user, index) => (
              <tr key={index}>
                <td>{user.userDetails.name?.firstName} {user.userDetails.name?.lastName}</td>
                <td>{user.userDetails.userId?.email}</td>
                <td>{user.userDetails?.phoneNo}</td>
                <td>{user.userDetails?.salary}</td>
                <td>{user.userDetails?.jobTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LookupPage;
