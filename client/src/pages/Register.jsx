import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import fetchInstance from "../api/fetchInstance";

const isPasswordValid = (password) => {
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const isLongEnough = password.length >= 5;

	return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
};

const Register = () => {
	const [managers, setManagers] = useState([]);
	const [formData, setFormData] = useState({
		name: { firstName: "", lastName: "" },
		email: "",
		phoneNo: "",
		role: "employee", // Default role
		password: "",
		workLocation: { city: "", state: "", country: "" },
		salary: "",
		jobTitle: "",
		managerId: "",
	});

	// Fetch managers on mount
	useEffect(() => {
		const fetchManagers = async () => {
			try {
				const response = await fetchInstance("/user-details/managers");
				if (response && response.data) {
					setManagers(response.data);
				}
			} catch (error) {
				Swal.fire(
					"Error",
					`Failed to fetch managers: ${error.message}`,
					"error"
				);
			}
		};
		fetchManagers();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;

		// Nested updates for 'name' and 'workLocation'
		if (name === "firstName" || name === "lastName") {
			setFormData((prev) => ({
				...prev,
				name: { ...prev.name, [name]: value },
			}));
		} else if (name === "city" || name === "state" || name === "country") {
			setFormData((prev) => ({
				...prev,
				workLocation: { ...prev.workLocation, [name]: value },
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isPasswordValid(formData.password)) {
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

		const payload = {
			...formData,
			salary: Number(formData.salary),
			managerId: formData.managerId || null,
		};

		try {
			await fetchInstance("/auth/register", {
				method: "POST",
				body: payload,
			});
			Swal.fire("Success", "Employee registered successfully!", "success");

			e.target.reset();

			setFormData({
				name: { firstName: "", lastName: "" },
				email: "",
				phoneNo: "",
				role: "employee",
				password: "",
				workLocation: { city: "", state: "", country: "" },
				salary: "",
				jobTitle: "",
				managerId: "",
			});
		} catch (error) {
			Swal.fire(
				"Error",
				`Failed to register employee: ${error.message}`,
				"error"
			);
		}
	};

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Register New Employee
			</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Name */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<input
						type="text"
						name="firstName"
						placeholder="First Name"
						className="input input-bordered w-full"
						onChange={handleChange}
						required
					/>
					<input
						type="text"
						name="lastName"
						placeholder="Last Name"
						className="input input-bordered w-full"
						onChange={handleChange}
						required
					/>
				</div>

				{/* Contact and Auth */}
				<input
					type="email"
					name="email"
					placeholder="Email"
					className="input input-bordered w-full"
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="phoneNo"
					placeholder="Phone Number"
					className="input input-bordered w-full"
					onChange={handleChange}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					className="input input-bordered w-full"
					onChange={handleChange}
					required
				/>

				{/* Work Location */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<input
						type="text"
						name="city"
						placeholder="City"
						className="input input-bordered w-full"
						onChange={handleChange}
						required
					/>
					<input
						type="text"
						name="state"
						placeholder="State"
						className="input input-bordered w-full"
						onChange={handleChange}
						required
					/>
					<input
						type="text"
						name="country"
						placeholder="Country"
						className="input input-bordered w-full"
						onChange={handleChange}
						required
					/>
				</div>

				{/* Job and Salary */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<input
						type="text"
						name="jobTitle"
						placeholder="Job Title"
						className="input input-bordered w-full"
						onChange={handleChange}
						required
					/>
					<input
						type="number"
						name="salary"
						placeholder="Salary"
						className="input input-bordered w-full"
						onChange={handleChange}
						required
					/>
				</div>

				{/* Role and Manager */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<select
						name="role"
						value={formData.role}
						className="select select-bordered w-full"
						onChange={handleChange}
					>
						<option value="employee">Employee</option>
						<option value="manager">Manager</option>
						<option value="hr">HR</option>
					</select>

					<select
						name="managerId"
						value={formData.managerId}
						className="select select-bordered w-full"
						onChange={handleChange}
						required
					>
						<option value="">Select a Manager</option>
						{managers.map((manager) => (
							<option
								key={manager.userDetails._id}
								value={manager.userDetails._id}
							>
								{manager.userDetails.name.firstName}{" "}
								{manager.userDetails.name.lastName}
							</option>
						))}
					</select>
				</div>

				<button type="submit" className="btn btn-primary w-full mt-6">
					Register Employee
				</button>
			</form>
		</div>
	);
};

export default Register;
