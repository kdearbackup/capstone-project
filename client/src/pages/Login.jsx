import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import fetchInstance from "../api/fetchInstance";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const auth = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetchInstance("/auth/login", {
				method: "POST",
				body: { email, password },
			});

			// The backend sets the HttpOnly cookie.
			// We use the response data to set the client-side user state.
			auth.login(response?.data);

			// Check if the user needs to change their password
			if (response.data.needsPasswordChange) {
				Swal.fire({
					title: "Password Change Required",
					text: "Please update your password to continue.",
					icon: "info",
					confirmButtonText: "OK",
				}).then((result) => {
					if (result.isConfirmed) {
						navigate("/change-password", {
							state: { needsPasswordChange: true },
						});
					} else {
						navigate("/login");
					}
				});
			} else {
				if (response?.success) {
					Swal.fire("Success", "Logged in successfully!", "success");
					navigate("/directory");
				}
			}
		} catch (error) {
			Swal.fire("Error", `Failed to login: ${error.message}`, "error");
		}
	};

	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="card shrink-0 w-full max-w-lg shadow-2xl bg-base-100 py-10">
				<h1 className="text-center text-4xl font-bold">Enterprise Directory</h1>
				<form className="card-body mx-auto w-11/12" onSubmit={handleSubmit}>
					<h1 className="text-4xl font-bold text-center mb-5">Login</h1>
					<div className="form-control">
						<p className="label-text">Email</p>
						<input
							type="email"
							placeholder="Email"
							className="input input-bordered w-14/16"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
							required
						/>
					</div>
					<div className="form-control">
						<p className="label-text">Password</p>
						<input
							type="password"
							placeholder="Password"
							className="input input-bordered w-14/16"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="form-control mt-6">
						<button type="submit" className="btn btn-primary">
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
