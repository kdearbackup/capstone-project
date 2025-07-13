import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import fetchInstance from "../api/fetchInstance";
import { AuthContext } from "../context/AuthContext";
import { normalizeUserData } from "../utils/normalizeUserData";

const EmployeeProfile = () => {
	const { id } = useParams(); // This is the userDetails ID
	const [employee, setEmployee] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [managers, setManagers] = useState([]);
	const auth = useContext(AuthContext);

	const [formData, setFormData] = useState({
		role: "",
		salary: "",
		jobTitle: "",
		managerId: "",
	});

	const fetchEmployeeData = async () => {
		try {
			const employeeRes = await fetchInstance(`/user-details/employees/${id}`);
			const normalizedData = normalizeUserData(employeeRes.data);
			setEmployee(normalizedData);

			const managersRes = await fetchInstance("/user-details/managers");
			setManagers(managersRes.data);

			setFormData({
				role: normalizedData.role,
				salary: normalizedData.salary,
				jobTitle: normalizedData.jobTitle,
				managerId: employeeRes.data.managerId,
			});
		} catch (error) {
			console.error("Failed to fetch data", error);
			Swal.fire("Error", "Could not load employee profile.", "error");
		}
	};

	const canEdit = auth.user.role == "hr" || auth.user.role == "manager";

	useEffect(() => {
		fetchEmployeeData();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		const payload = {
			role: formData.role,
			salary: Number(formData.salary),
			jobTitle: formData.jobTitle,
			managerId: formData?.managerId || null,
		};

		try {
			await fetchInstance(`/user-details/employee/${employee.id}`, {
				method: "PATCH",
				body: payload,
			});

			Swal.fire("Success", "Employee details updated successfully!", "success");
			setIsEditing(false);
			fetchEmployeeData();
		} catch (error) {
			Swal.fire(
				"Error",
				`Failed to update employee: ${error.message}`,
				"error"
			);
		}
	};

	if (!employee)
		return (
			<div className="text-center p-10">
				<span className="loading loading-lg"></span>
			</div>
		);

	const currentManager = managers.find(
		(m) => m.userDetails._id === employee.managerId
	);

	const managerName = `${currentManager?.userDetails?.name.firstName} ${currentManager?.userDetails?.name.lastName}`;

	return (
		<div className="container mx-auto p-4 mt-10">
			<div className="card lg:card-side bg-base-200 shadow-xl rounded-lg">
				<div className="card-body">
					{isEditing ? (
						<form onSubmit={handleUpdate} className="space-y-4">
							<h2 className="card-title text-2xl mb-4">
								Managing: {employee.firstName} {employee.lastName}
							</h2>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Job Title</span>
								</label>
								<input
									type="text"
									name="jobTitle"
									value={formData.jobTitle}
									onChange={handleChange}
									className="input input-bordered w-full"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="form-control">
									<label className="label">
										<span className="label-text">Role</span>
									</label>
									<select
										name="role"
										value={formData.role}
										onChange={handleChange}
										className="select select-bordered w-full"
									>
										<option value="employee">Employee</option>
										<option value="manager">Manager</option>
										<option value="hr">HR</option>
									</select>
								</div>
								<div className="form-control">
									<label className="label">
										<span className="label-text">Salary</span>
									</label>
									<input
										type="number"
										name="salary"
										value={formData.salary}
										onChange={handleChange}
										className="input input-bordered w-full"
									/>
								</div>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Assign Manager</span>
								</label>
								<select
									name="managerId"
									value={formData.managerId}
									onChange={handleChange}
									className="select select-bordered w-full"
								>
									<option value="">No Manager</option>
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
							<p className="text-lg">
								<strong>Manager:</strong> {managerName}
							</p>
							{employee.salary !== 0 ? (
								<p className="text-lg">
									<strong>Salary:</strong> ${employee.salary.toLocaleString()}
								</p>
							) : (
								<p className="text-lg">
									<strong>Salary:</strong> *****
								</p>
							)}
							<div className="card-actions justify-end">
								{canEdit && (
									<button
										onClick={() => setIsEditing(true)}
										className="btn btn-primary"
									>
										Manage Employee
									</button>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default EmployeeProfile;
