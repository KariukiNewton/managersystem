// EmployeeFinance.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './_financeEmpFinancials.scss';

// Mock data - replace with actual API calls to your MongoDB
const mockEmployees = [
    {
        id: '1',
        name: 'John Doe',
        position: 'Software Engineer',
        department: 'Engineering',
        joinDate: '2023-01-15',
        basicSalary: 5000,
        allowances: { housing: 500, transport: 300, medical: 200 },
        deductions: { tax: 750, insurance: 250, pension: 300 }
    },
    {
        id: '2',
        name: 'Jane Smith',
        position: 'HR Manager',
        department: 'Human Resources',
        joinDate: '2022-05-20',
        basicSalary: 6000,
        allowances: { housing: 600, transport: 350, medical: 250 },
        deductions: { tax: 900, insurance: 300, pension: 350 }
    }
];

const EmployeeFinance = () => {
    const { id } = useParams();
    const [employees, setEmployees] = useState(mockEmployees);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filterTerm, setFilterTerm] = useState('');

    // Fetch employees and set selected employee if ID is provided
    useEffect(() => {
        // In a real app, this would be fetched from the API
        // Example: fetchEmployees().then(data => setEmployees(data));

        if (id) {
            const employee = employees.find(emp => emp.id === id);
            if (employee) {
                setSelectedEmployee(employee);
            }
        }
    }, [id, employees]);

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(filterTerm.toLowerCase())
    );

    const handleSelectEmployee = (emp) => {
        setSelectedEmployee(emp);
    };

    const handleUpdateSalary = () => {
        toast.success(`Salary updated successfully for ${selectedEmployee.name}`);
    };

    return (
        <div className="employee-finances">
            <h1>Employee Finances</h1>

            <div className="finance-container">
                <div className="employee-list">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={filterTerm}
                            onChange={(e) => setFilterTerm(e.target.value)}
                        />
                    </div>

                    <ul className="employees">
                        {filteredEmployees.map(emp => (
                            <li
                                key={emp.id}
                                className={selectedEmployee && selectedEmployee.id === emp.id ? 'selected' : ''}
                                onClick={() => handleSelectEmployee(emp)}
                            >
                                <span>{emp.name}</span>
                                <span>{emp.position}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {selectedEmployee ? (
                    <div className="employee-details">
                        <h2>{selectedEmployee.name}</h2>
                        <p className="position">{selectedEmployee.position} - {selectedEmployee.department}</p>

                        <div className="detail-section">
                            <h3>Salary Information</h3>
                            <div className="form-group">
                                <label>Basic Salary:</label>
                                <input type="number" defaultValue={selectedEmployee.basicSalary} />
                            </div>

                            <h4>Allowances</h4>
                            {Object.entries(selectedEmployee.allowances).map(([key, value]) => (
                                <div className="form-group" key={key}>
                                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                    <input type="number" defaultValue={value} />
                                </div>
                            ))}

                            <h4>Deductions</h4>
                            {Object.entries(selectedEmployee.deductions).map(([key, value]) => (
                                <div className="form-group" key={key}>
                                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                    <input type="number" defaultValue={value} />
                                </div>
                            ))}

                            <button className="btn-primary" onClick={handleUpdateSalary}>Update Salary</button>
                        </div>

                        <div className="detail-section">
                            <h3>Payment History</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Date</th>
                                        <th>Gross</th>
                                        <th>Net</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>February 2025</td>
                                        <td>2025-02-28</td>
                                        <td>${(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td>${(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0) - Object.values(selectedEmployee.deductions).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td><Link to={`/finance/invoice/${selectedEmployee.id}`} className="btn-view">View</Link></td>
                                    </tr>
                                    <tr>
                                        <td>January 2025</td>
                                        <td>2025-01-31</td>
                                        <td>${(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td>${(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0) - Object.values(selectedEmployee.deductions).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td><Link to={`/finance/invoice/${selectedEmployee.id}`} className="btn-view">View</Link></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="no-selection">
                        <p>Select an employee to view and manage their financial details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeFinance;