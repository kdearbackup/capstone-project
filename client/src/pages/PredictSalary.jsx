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

			{predictedSalary !== null && lastPredictionInputs && (
				<div className="card bg-base-100 shadow-xl mt-15 animate-fade-in">
					<div className="card-body items-center text-center">
						<h2 className="card-title text-lg">Prediction Result</h2>
						<p className="text-sm text-gray-500">
							A{" "}
							<span className="font-semibold capitalize">
								{lastPredictionInputs.jobTitle}
							</span>{" "}
							<span className="font-semibold capitalize">
								({lastPredictionInputs.jobRole})
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
