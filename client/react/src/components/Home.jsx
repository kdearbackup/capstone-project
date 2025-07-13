import React, { useState, useEffect } from 'react';

const Home = ({ username }) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user-details/employees', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`, // Use cookie to get the token
          },
          credentials: 'include', // Ensure cookies are included in the request
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data.data); // Assuming the data is in the 'data' attribute
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to get a cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  return (
    <div>
      <div className="home-container">
        <h2 className="home-title">Home Page</h2>
        <h5 className="home-greeting">Hi {username}!</h5>
        <p className="home-description">
          Welcome to the Travelers Directory App, where you're able to look up employee information.
        </p>
        <p className="home-footer">
          This app was designed by Kam, Adam, and Sakhawat as part of the Learning Accelerator Capstone Project.
        </p>
      </div>
      <div className="home-container">
        <h5 className="home-greeting">Full Directory</h5>
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
            {userData.map((user, index) => (
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
      </div>
    </div>
  );
};

export default Home;
