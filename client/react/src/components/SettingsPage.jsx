const SettingsPage = ({ username, permissionLevel }) => {
    let color = "black";
    let permissionDescription = "";
  
    if (permissionLevel === 'full') {
      color = "green";
      permissionDescription = "With this level of access, you are able to look up full information on all employees, including salary.";
    } else if (permissionLevel === "partial") {
      color = "orange";
      permissionDescription = "With this level of access, you are able to look up partial information on all employees, including the salaries of fellow team-members.";
    } else {
      color = "red";
      permissionDescription = "With this level of access, you are able to look up partial information on all employees, including your own salary.";
    }
  
    console.log(username);
  
    return (
      <div className="settings-container">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-info">User information goes here (coming soon)</p>
        <p className="settings-username">Username: {username}</p>
        <p className="settings-access-level">
          Access Level: <span style={{ color: color }}>{permissionLevel}</span>
        </p>
        <p className="settings-description" style={{ color: "grey" }}>{permissionDescription}</p>
      </div>
    );
  };
  
  export default SettingsPage;
  