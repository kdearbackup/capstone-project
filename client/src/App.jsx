import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

import ConditionalNavbar from "./components/ConditionalNavbar";
import ChangePassword from "./pages/ChangePassword";
import Directory from "./pages/Directory";
import EmployeeProfile from "./pages/EmployeeProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import MyTeam from "./pages/MyTeam";
import NotFound from "./pages/PageNotFound";
import PredictSalary from "./pages/PredictSalary";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

function App() {
	return (
		<AuthProvider>
			<Router>
				<ConditionalNavbar />
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/unauthorized" element={<Unauthorized />} />

					{/* Protected Routes */}
					<Route
						path="/directory"
						element={
							<PrivateRoute allowedRoles={["hr", "manager", "employee"]}>
								<Directory />
							</PrivateRoute>
						}
					/>
					<Route
						path="/my-profile"
						element={
							<PrivateRoute allowedRoles={["hr", "manager", "employee"]}>
								<MyProfile />
							</PrivateRoute>
						}
					/>
					<Route
						path="/employee/:id"
						element={
							<PrivateRoute allowedRoles={["hr", "manager", "employee"]}>
								<EmployeeProfile />
							</PrivateRoute>
						}
					/>
					<Route
						path="/register"
						element={
							<PrivateRoute allowedRoles={["hr"]}>
								<Register />
							</PrivateRoute>
						}
					/>
					<Route
						path="/predict-salary"
						element={
							<PrivateRoute allowedRoles={["hr", "manager", "employee"]}>
								<PredictSalary />
							</PrivateRoute>
						}
					/>
					<Route
						path="/change-password"
						element={
							<PrivateRoute allowedRoles={["hr", "manager", "employee"]}>
								<ChangePassword />
							</PrivateRoute>
						}
					/>
					<Route
						path="/my-team"
						element={
							<PrivateRoute allowedRoles={["manager"]}>
								<MyTeam />
							</PrivateRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
