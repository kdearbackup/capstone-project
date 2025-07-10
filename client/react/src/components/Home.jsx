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
        <p className="home-description"> You can search for employee information using any of the following
            <br/>- Full Name
            <br/>- Phone Number
            <br/>- Role
            <br/>- Location
        </p>
      </div>
      <div className="home-container">
        <h5 className="home-greeting">What It's Built With</h5>
        <p className="home-description">This app makes use of
            <br/>- React: Assembling Frontend 
            <br/>- MongoDB: Backend data
            <br/>- Express: Handling routes between React and MongoDB
            <br/>- Pandas: Linear Regression model for estimating salary
        </p>
      </div>
        </div>
    );
  };
  
  export default Home;
  