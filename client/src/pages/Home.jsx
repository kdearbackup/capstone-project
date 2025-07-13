import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div
			className="hero min-h-screen"
			style={{
				backgroundImage:
					"url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)",
			}}
		>
			<div className="hero-overlay bg-opacity-60"></div>
			<div className="hero-content text-center text-neutral-content">
				<div className="max-w-md">
					<h1 className="mb-5 text-5xl font-bold">
						Welcome to the Enterprise Directory
					</h1>
					<p className="mb-5">
						A one-stop employee directory — empowering HR and managers to manage
						teams, and employees to find coworkers and update their profiles.
					</p>
					<Link
						to="/directory"
						className="btn btn-primary font-semibold text-black"
					>
						Get Started
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
