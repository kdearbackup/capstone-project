import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-9xl font-bold text-primary">404</h1>
					<p className="text-2xl font-semibold mt-4">Page Not Found</p>
					<p className="py-6">
						Sorry, the page you are looking for does not exist or has been
						moved.
					</p>
					<Link to="/directory" className="btn btn-primary">
						Go to Homepage
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
