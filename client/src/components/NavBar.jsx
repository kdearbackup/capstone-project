import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		auth.logout();
		Swal.fire(
			"Logged Out",
			"You have been successfully logged out.",
			"success"
		);
		navigate("/login");
	};

	return (
		<nav className="navbar bg-base-100 shadow-lg px-20">
			<div className="navbar-start">
				<Link to="/directory" className="btn btn-ghost normal-case text-2xl">
					<div className="max-w-10 mr-5">
						<img src="travImage.png" alt="travelers logo" />
					</div>
					Enterprise Directory
				</Link>
			</div>

			<div className="navbar-center hidden lg:flex">
				{auth.user && (
					<ul className="menu menu-horizontal px-1">
						<li>
							<Link to="/directory" className="text-lg">
								Directory
							</Link>
						</li>

						{auth.user.role === "hr" && (
							<li>
								<Link to="/register" className="text-lg">
									Register
								</Link>
							</li>
						)}

						{auth.user.role === "manager" && (
							<li>
								<Link to="/my-team" className="text-lg">
									My Team
								</Link>
							</li>
						)}

						<li>
							<Link to="/predict-salary" className="text-lg">
								Predict Salary
							</Link>
						</li>
					</ul>
				)}
			</div>

			<div className="navbar-end">
				{auth.user ? (
					<div>
						<span className="hidden sm:inline mr-5 font-semibold">
							Welcome, {auth.user?.firstName}
						</span>
						<div className="dropdown dropdown-end">
							<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
								<div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-10 h-10"
									>
										<path
											fillRule="evenodd"
											d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</label>

							<ul
								tabIndex={0}
								className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
							>
								<li>
									<Link to={`/my-profile`} className="justify-between text-lg">
										My Profile
									</Link>
								</li>
								<li>
									<Link to="/change-password" className="text-lg">
										Change Password
									</Link>
								</li>
								<li>
									<button onClick={handleLogout} className="text-lg">
										Logout
									</button>
								</li>
							</ul>
						</div>
					</div>
				) : (
					<Link to="/login" className="btn btn-ghost text-lg">
						Login
					</Link>
				)}
				<ThemeToggle />
			</div>
		</nav>
	);
};

export default Navbar;
