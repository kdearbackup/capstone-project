import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import fetchInstance from "../api/fetchInstance";
import { normalizeUserData } from "../utils/normalizeUserData";

const MyTeam = () => {
	const [teamMembers, setTeamMembers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMyTeam = async () => {
			try {
				const response = await fetchInstance("/user-details/manager/my-team");
				if (response && response.data) {
					const normalizedData = response.data.map(normalizeUserData);
					setTeamMembers(normalizedData);
				}
			} catch (error) {
				console.error("Failed to fetch team data:", error);
				Swal.fire("Error", "Could not load your team data.", "error");
			} finally {
				setLoading(false);
			}
		};

		fetchMyTeam();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<span className="loading loading-lg loading-spinner text-primary"></span>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 mt-10">
			<h1 className="text-3xl font-bold mb-10">My Team</h1>

			<div className="overflow-x-auto">
				{teamMembers.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="table w-full">
							<thead>
								<tr>
									<th>Name</th>
									<th>Job Role</th>
									<th>Job Title</th>
									<th>Location</th>
									<th>Phone</th>
									<th>Salary</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{teamMembers.map((member) => (
									<tr key={member.id}>
										<td>{`${member.firstName} ${member.lastName}`}</td>
										<td>
											{member.role.charAt(0).toUpperCase() +
												member.role.slice(1)}
										</td>
										<td>{member.jobTitle}</td>
										<td>{`${member.location?.city}, ${member.location?.state}`}</td>
										<td>{member.phoneNo}</td>
										<td>{member.salary ? `$${member.salary}` : "*****"}</td>
										<td>
											<Link
												to={`/employee/${member.id}`}
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
				) : (
					<tr>
						<td colSpan="6" className="text-center p-4">
							You do not have any direct reports.
						</td>
					</tr>
				)}
			</div>
		</div>
	);
};

export default MyTeam;
