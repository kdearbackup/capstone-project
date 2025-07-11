import mockData from "../mockData.json"

const Home = ({ username }) => {
    return (
    <div>
      <div className="home-container">
        <h2 className="home-title">Home Page</h2>
        <h5 className="home-greeting">Hi {username}!</h5>
        <p className="home-description">
          Welcome to the Directory App, where you're able to look up employee information.
        </p>
        <p className="home-footer">
          This app was designed by Kam, Adam, and Sakhawat as part of the Learning Accelerator Capstone Project.
        </p>
      </div>
      <div className="home-container">
        <h5 className="home-greeting">How it Works</h5>
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
            {mockData.map((user, index) => (
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
  