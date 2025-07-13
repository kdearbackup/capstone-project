import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import fetchInstance from "../api/fetchInstance";
import { AuthContext } from "../context/AuthContext";
import { normalizeUserData } from "../utils/normalizeUserData";

const MyProfile = () => {
	// const { id } = useParams();
	const [employee, setEmployee] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const auth = useContext(AuthContext);

	const [formData, setFormData] = useState({
		name: { firstName: "", lastName: "" },
		phoneNo: "",
		workLocation: { city: "", state: "", country: "" },
	});

	const fetchEmployee = async () => {
		try {
			const response = await fetchInstance(`/user-details/me`);
			const normalizedData = normalizeUserData(response.data);

			setEmployee(normalizedData);
			setFormData({
				name: {
					firstName: normalizedData.firstName,
					lastName: normalizedData.lastName,
				},
				phoneNo: normalizedData.phoneNo,
				workLocation: { ...normalizedData.location },
			});
		} catch (error) {
			console.error("Failed to fetch employee data", error);
			Swal.fire("Error", "Could not load employee profile.", "error");
		}
	};

	useEffect(() => {
		fetchEmployee();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		const [field, subfield] = name.split(".");

		if (subfield) {
			setFormData((prev) => ({
				...prev,
				[field]: { ...prev[field], [subfield]: value },
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		const payload = {
			name: formData.name,
			phoneNo: formData.phoneNo,
			workLocation: formData.workLocation,
		};

		try {
			const url =
				auth.user.userId === employee.userId
					? "/user-details/update-me"
					: `/user-details/employee/${employee.userId}`;

			await fetchInstance(url, {
				method: "PATCH",
				body: payload,
			});

			Swal.fire("Success", "Profile updated successfully!", "success");
			setIsEditing(false);
			fetchEmployee();
		} catch (error) {
			Swal.fire("Error", `Failed to update profile: ${error.message}`, "error");
		}
	};

	// const canEdit = auth.user?.role === "hr" || auth.user?.userId === id;

	if (!employee)
		return (
			<div className="text-center p-10">
				<span className="loading loading-lg"></span>
			</div>
		);

	return (
		<div className="container mx-auto p-4 mt-10">
			<div className="card lg:card-side bg-base-200 shadow-xl rounded-lg">
				<div className="card-body">
					{isEditing ? (
						<form onSubmit={handleUpdate} className="space-y-4">
							<h2 className="card-title text-2xl mb-4">Editing Profile</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="form-control">
									<label className="label">
										<span className="label-text">First Name</span>
									</label>
									<input
										type="text"
										name="name.firstName"
										value={formData.name.firstName}
										onChange={handleChange}
										className="input input-bordered w-full"
									/>
								</div>
								<div className="form-control">
									<label className="label">
										<span className="label-text">Last Name</span>
									</label>
									<input
										type="text"
										name="name.lastName"
										value={formData.name.lastName}
										onChange={handleChange}
										className="input input-bordered w-full"
									/>
								</div>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Phone Number</span>
								</label>
								<input
									type="text"
									name="phoneNo"
									value={formData.phoneNo}
									onChange={handleChange}
									className="input input-bordered w-full"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="form-control">
									<label className="label">
										<span className="label-text">City</span>
									</label>
									<input
										type="text"
										name="workLocation.city"
										value={formData.workLocation.city}
										onChange={handleChange}
										className="input input-bordered w-full"
									/>
								</div>
								<div className="form-control">
									<label className="label">
										<span className="label-text">State</span>
									</label>
									<input
										type="text"
										name="workLocation.state"
										value={formData.workLocation.state}
										onChange={handleChange}
										className="input input-bordered w-full"
									/>
								</div>
								<div className="form-control">
									<label className="label">
										<span className="label-text">Country</span>
									</label>
									<input
										type="text"
										name="workLocation.country"
										value={formData.workLocation.country}
										onChange={handleChange}
										className="input input-bordered w-full"
									/>
								</div>
							</div>

							<div className="flex gap-2 mt-6">
								<button type="submit" className="btn btn-primary">
									Save Changes
								</button>
								<button
									type="button"
									onClick={() => setIsEditing(false)}
									className="btn btn-ghost"
								>
									Cancel
								</button>
							</div>
						</form>
					) : (
						<>
							<h2 className="card-title text-5xl mb-5">{`${employee.firstName} ${employee.lastName}`}</h2>
							<p className="text-lg">
								<strong>Role:</strong>{" "}
								{employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
							</p>
							<p className="text-lg">
								<strong>Title:</strong> {employee.jobTitle}
							</p>
							<p className="text-lg">
								<strong>Email:</strong> {employee.email}
							</p>
							<p className="text-lg">
								<strong>Phone:</strong> {employee.phoneNo}
							</p>
							<p className="text-lg">
								<strong>Location:</strong>{" "}
								{`${employee.location.city}, ${employee.location.state}`}
							</p>
							{employee.salary != null && (
								<p className="text-lg">
									<strong>Salary:</strong> ${employee.salary.toLocaleString()}
								</p>
							)}
							<div className="card-actions justify-end">
								<button
									onClick={() => setIsEditing(true)}
									className="btn btn-primary"
								>
									Edit Profile
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default MyProfile;
