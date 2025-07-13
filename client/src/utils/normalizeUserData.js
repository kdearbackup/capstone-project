export const normalizeUserData = (employee) => {
	if (employee.userDetails) {
		return {
			id: employee.userDetails._id,
			userId: employee._id,
			firstName: employee.userDetails.name.firstName,
			lastName: employee.userDetails.name.lastName,
			email: employee.email,
			role: employee.role,
			phoneNo: employee.userDetails.phoneNo,
			jobTitle: employee.userDetails.jobTitle,
			salary: employee.userDetails.salary,
			location: employee.userDetails.workLocation,
			managerId: employee.userDetails.managerId,
		};
	} else {
		return {
			id: employee._id,
			userId: employee.userId._id,
			firstName: employee.name.firstName,
			lastName: employee.name.lastName,
			email: employee.userId.email,
			role: employee.userId.role,
			phoneNo: employee.phoneNo,
			jobTitle: employee.jobTitle,
			salary: employee.salary,
			location: employee.workLocation,
			managerId: employee.managerId,
		};
	}
};
