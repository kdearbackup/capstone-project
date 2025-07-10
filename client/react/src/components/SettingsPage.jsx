const SettingsPage = ({username, permissionLevel}) => {
    let color = "black"

    if (permissionLevel == 'full'){
        color = "green"
    }
    else if (permissionLevel == "partial"){
        color = "yellow"
    }
    else {
        color = "red"
    }
    console.log(username)
    return (
        <div>
            <h2>Settings</h2>
            <p>User information goes here (coming soon)</p>
            <p>Username: {username}</p>
            <p>Access Level: <span style={{ color: color }}>{permissionLevel}</span></p>
            </div>
        )
    
    

}

export default SettingsPage