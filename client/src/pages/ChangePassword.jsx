import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import fetchInstance from "../api/fetchInstance";

const isPasswordValid = (password) => {
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const isLongEnough = password.length >= 5;

	return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
};

const ChangePassword = () => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	const wasForced = location.state?.needsPasswordChange ? true : false;

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			Swal.fire(
				"Error",
				"The new passwords do not match. Please try again.",
				"error"
			);
			return;
		}

		// Check if the new password meets the complexity requirements
		if (!isPasswordValid(newPassword)) {
			Swal.fire({
				icon: "error",
				title: "Password Not Strong Enough",
				html: `
				Your new password must meet the following requirements:
				<ul class="list-disc list-inside text-left mt-2">
					<li>At least 5 characters long</li>
					<li>At least 1 uppercase letter (A-Z)</li>
					<li>At least 1 lowercase letter (a-z)</li>
					<li>At least 1 number (0-9)</li>
				</ul>
			`,
			});
			return;
		}

		try {
			await fetchInstance("/auth/change-password", {
				method: "POST",
				body: { oldPassword, newPassword },
			});

			Swal.fire({
				title: "Success!",
				text: "Your password has been updated. You will now be redirected to the login page.",
				icon: "success",
				timer: 3000,
				showConfirmButton: false,
			});

			setTimeout(() => navigate("/login"), 3000);
		} catch (error) {
			Swal.fire(
				"Error",
				`Failed to change password: ${error.message}`,
				"error"
			);
		}
	};

	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="card shrink-0 w-full max-w-[600px] shadow-2xl bg-base-100 py-10">
				<form className="card-body mx-auto w-11/12" onSubmit={handleSubmit}>
					<h1 className="text-4xl font-bold text-center mb-8">
						{wasForced ? "Change" : "Reset"} Your Password
					</h1>
					{wasForced && (
						<p className="text-center text-sm mb-4 text-red-400">
							For security reasons, you must change your temporary password
							before proceeding.
						</p>
					)}

					<div className="form-control mb-2">
						<p className="label-text ml-2">Old Password</p>
						<input
							type="password"
							placeholder="Current Password"
							className="input input-bordered w-14/16"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							required
						/>
					</div>

					<div className="form-control mb-2">
						<p className="label-text ml-2">New Password</p>
						<input
							type="password"
							placeholder="New Strong Password"
							className="input input-bordered w-14/16"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
						/>
					</div>
					<div className="form-control">
						<p className="label-text ml-2">Confirm New Password</p>
						<input
							type="password"
							placeholder="Confirm New Password"
							className="input input-bordered w-14/16"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>

					<div className="form-control mt-6">
						<button
							type="submit"
							className="btn btn-primary text-black font-semibold"
						>
							Update Password
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ChangePassword;
