import { createContext, useEffect, useState } from "react";
import fetchInstance from "../api/fetchInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const response = await fetchInstance("/user-details/me");

				if (response && response.data) {
					// If the request is successful, we have a valid session
					setUser({
						userId: response.data._id,
						role: response.data.role,
						firstName: response.data?.userDetails?.name?.firstName,
					});
				}
			} catch (error) {
				console.log("No active session found.");
				setUser(null);
			} finally {
				// We are done loading, whether we found a user or not
				setLoading(false);
			}
		};

		fetchCurrentUser();
	}, [user]);

	// This function is called by the Login page with data from the login response
	const login = (userData) => {
		if (userData && userData.id && userData.role) {
			setUser({
				userId: userData.id,
				role: userData.role,
				firstName: "",
			});
		}
	};

	const logout = async () => {
		try {
			await fetchInstance("/auth/logout", { method: "POST" });
		} catch (error) {
			console.error("Logout API call failed:", error);
		} finally {
			// Always clear the user state on the client
			setUser(null);
		}
	};

	// We pass down the loading state so other components can use it
	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
