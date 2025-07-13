import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchInstance from "../api/fetchInstance";
import { AuthContext } from "../context/AuthContext";
import { normalizeUserData } from "../utils/normalizeUserData";

const Directory = () => {
	const [employees, setEmployees] = useState([]);
	const [searchCategory, setSearchCategory] = useState("firstName");
	const [searchValue, setSearchValue] = useState("");
	const auth = useContext(AuthContext);

	// Define the options for the search dropdown
	const searchOptions = [
		{ value: "firstName", label: "First Name" },
		{ value: "lastName", label: "Last Name" },
		{ value: "email", label: "Email" },
		{ value: "role", label: "Role (hr, manager, employee)" },
		{ value: "city", label: "City" },
		{ value: "phoneNo", label: "Phone Number" },
		{ value: "jobTitle", label: "Job Title" },
	];

	const fetchEmployees = async () => {
		try {
			const response = await fetchInstance("/user-details/employees");
			const normalizedData = response.data.map(normalizeUserData);
			setEmployees(normalizedData);
		} catch (error) {
			console.error("Failed to fetch employees", error);
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	const handleSearch = async (e) => {
		e.preventDefault();

		// If the search value is empty, reset and show all employees
		if (!searchValue.trim()) {
			fetchEmployees();
			return;
		}

		// Construct the payload in the format { field: value }
		const payload = {
			[searchCategory]: searchValue,
		};

		try {
			const response = await fetchInstance("/user-details/employees/search", {
				method: "POST",
				body: payload,
			});

			const normalizedData = response.data.map(normalizeUserData);
			setEmployees(normalizedData);
		} catch (error) {
			console.error("Search failed", error);
			Swal.fire("Error", `Search failed: ${error.message}`, "error");
		}
	};

	const currentPlaceholder =
		searchOptions.find((opt) => opt.value === searchCategory)?.label ||
		"Search";

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-4xl font-bold mb-5 mt-2">Employee Directory</h1>

			<form
				onSubmit={handleSearch}
				className="mb-6 p-4 pb-8 bg-base-200 rounded-lg flex flex-col md:flex-row gap-3 items-center w-22/23"
			>
				<div className="form-control">
					<label className="label pb-0">
						<span className="label-text mb-2">Search By</span>
					</label>
					<select
						className="select select-bordered"
						value={searchCategory}
						onChange={(e) => setSearchCategory(e.target.value)}
					>
						{searchOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div className="form-control flex-grow w-full md:w-auto">
					<label className="label pb-0">
						<span className="label-text mb-2">Value</span>
					</label>
					<input
						type="text"
						placeholder={`Enter ${currentPlaceholder}...`}
						className="input input-bordered w-full"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</div>

				<div className="form-control self-end">
					<button
						type="submit"
						className="btn w-[115px] px-7 btn-primary mr-2 text-black"
					>
						Search
					</button>
				</div>
			</form>

			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
						<tr>
							<th>First name</th>
							<th>Last name</th>
							<th>Job Role</th>
							<th>Job Title</th>
							<th>Location</th>
							<th>Phone</th>
							<th>Salary</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{employees.map((emp) => (
							<tr key={emp.id}>
								<td>{emp.firstName}</td>
								<td>{emp.lastName}</td>
								<td>{emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}</td>
								<td>{emp.jobTitle}</td>
								<td>{`${emp.location?.city}, ${emp.location?.state}`}</td>
								<td>{emp.phoneNo}</td>
								<td>{emp.salary ? `$${emp.salary}` : "*****"}</td>
								<td>
									<Link
										to={`/employee/${emp.id}`}
										className="btn btn-outline btn-info"
									>
										View Profile
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Directory;
