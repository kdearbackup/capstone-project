import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
	return (
		<div className="text-center my-20">
			<h1 className="text-4xl font-bold text-red-500">Access Denied</h1>
			<p className="text-lg mt-4">
				You do not have permission to view this page.
			</p>
			<Link to="/" className="btn btn-primary mt-8">
				Go to Homepage
			</Link>
		</div>
	);
};

export default Unauthorized;
