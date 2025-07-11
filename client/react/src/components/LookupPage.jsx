import React, { useState } from 'react';
import QueryForm from "./QueryForm"
import mockData from '../mockData.json';

const LookupPage = () => {

      const [results, setResults] = useState([]);

      const handleQuery = (queryParams) => {
      // Simulate querying the mock data
      const filteredResults = mockData.filter(user => {
        console.log(user)
        let nameStringLower = `${user.name.firstName} ${user.name.lastName}`.toLowerCase()
        return user.workLocation.city.toLowerCase() === queryParams.location.toLowerCase() || user.userId.email === queryParams.email || queryParams.name.toLowerCase() === nameStringLower || user.jobTitle === queryParams.jobTitle ;
      });
  
      setResults(filteredResults);
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
                <td>{user.name.firstName} {user.name.lastName}</td>
                <td>{user.userId.email}</td>
                <td>{user.phoneNo}</td>
                <td>{user.salary}</td>
                <td>{user.jobTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        </div>
      );
}

export default LookupPage