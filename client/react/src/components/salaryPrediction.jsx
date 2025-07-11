import React, { useState } from 'react';

function PredictedSalary() {
    const [jobRole, setJobRole] = useState('');
    const [workLocation, setWorkLocation] = useState('');
    const [predictedSalary, setPredictedSalary] = useState(null);

    const handlePredict = async () => {
        try {
            const response = await fetch('http://localhost:3000/predict-salary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobRole, workLocation }),
            });
            const data = await response.json();
            setPredictedSalary(data.predictedSalary);
        } catch (error) {
            console.error('Error fetching predicted salary:', error);
        }
    };

    return (
        <div>
            <h1>Salary Predictor</h1>
            <input
                type="text"
                placeholder="Job Role"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
            />
            <input
                type="text"
                placeholder="Work Location"
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
            />
            <button onClick={handlePredict}>Predict Salary</button>
            {predictedSalary && <p>Predicted Salary: ${predictedSalary.toFixed(2)}</p>}
        </div>
    );
}

export default PredictedSalary;