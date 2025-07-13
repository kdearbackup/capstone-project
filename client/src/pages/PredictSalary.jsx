import { useState } from "react";
import Swal from "sweetalert2";
import fetchInstance from "../api/fetchInstance";

const PredictSalary = () => {
	const [jobRole, setJobRole] = useState("employee");
	const [jobTitle, setJobTitle] = useState("");
	const [location, setLocation] = useState("");
	const [predictedSalary, setPredictedSalary] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lastPredictionInputs, setLastPredictionInputs] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setPredictedSalary(null);
		try {
			const response = await fetchInstance("/predict/salary", {
				method: "POST",
				body: { role: jobRole, jobTitle, location },
			});
			setPredictedSalary(response.data.predicted_salary);
			setLastPredictionInputs({ jobRole, jobTitle, location });
		} catch (error) {
			Swal.fire("Error", `Failed to predict salary: ${error.message}`, "error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-4">
			<h1 className="text-4xl font-bold mb-10 text-center">Predict Salary</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="form-control">
					<label className="label">
						<span className="label-text">Select Job Role</span>
					</label>
					<select
						className="select select-bordered w-full"
						value={jobRole}
						onChange={(e) => setJobRole(e.target.value)}
						required
					>
						<option value="employee">Employee</option>
						<option value="manager">Manager</option>
						<option value="hr">HR</option>
					</select>
				</div>

				<input
					type="text"
					placeholder="Job Title (e.g., Software Engineer)"
					className="input input-bordered w-full"
					value={jobTitle}
					onChange={(e) => setJobTitle(e.target.value)}
					required
				/>
				<input
					type="text"
					placeholder="Location (e.g., San Francisco)"
					className="input input-bordered w-full"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					required
				/>
				<button type="submit" className="btn btn-primary w-full">
					Predict
				</button>
			</form>
			{/* {predictedSalary !== null && (
				<div className="alert alert-success shadow-lg mt-5">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Predicted Salary: ${predictedSalary.toFixed(2)}</span>
					</div>
				</div>
			)} */}
			{predictedSalary !== null && lastPredictionInputs && (
				<div className="card bg-base-100 shadow-xl mt-15 animate-fade-in">
					<div className="card-body items-center text-center">
						<h2 className="card-title text-lg">Prediction Result</h2>
						<p className="text-sm text-gray-500">
							For a(an){" "}
							<span className="font-semibold capitalize">
								{lastPredictionInputs.jobRole}
							</span>{" "}
							in{" "}
							<span className="font-semibold">
								{lastPredictionInputs.location}
							</span>{" "}
							makes
						</p>
						<div className="text-4xl font-bold text-success mt-4">
							{predictedSalary.toLocaleString("en-US", {
								style: "currency",
								currency: "USD",
								minimumFractionDigits: 0,
								maximumFractionDigits: 0,
							})}
						</div>
						<p className="text-xs text-gray-400 mt-2">per year (estimated)</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default PredictSalary;
