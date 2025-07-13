import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
	const { user, loading } = useContext(AuthContext);
	const location = useLocation();

	// While we are checking for a session, show a loading indicator
	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<span className="loading loading-lg loading-spinner text-primary"></span>
			</div>
		);
	}

	// After loading, if there is no user, redirect to login
	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// If the user's role is not allowed, redirect to unauthorized page
	if (!allowedRoles.includes(user.role)) {
		return <Navigate to="/unauthorized" replace />;
	}

	// If everything is fine, render the requested component
	return children;
};

export default PrivateRoute;
