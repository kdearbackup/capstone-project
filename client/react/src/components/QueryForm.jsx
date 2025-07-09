import React, { useState } from 'react';

const QueryForm = ({onQuery}) => {
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the query parameters to the parent component or function
        onQuery({ name, department, employeeId });
    };
    
    return (
        <form onSubmit={handleSubmit}>
        <div>
            <label>Name:</label>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div>
            <label>Department:</label>
            <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            />
        </div>
        <div>
            <label>Employee ID:</label>
            <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            />
        </div>
        <button type="submit">Search</button>
        </form>
    );
    
}

export default QueryForm