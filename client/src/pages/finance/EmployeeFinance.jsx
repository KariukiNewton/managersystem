import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './_financeEmpFinancials.scss';

const EmployeeFinance = () => {
    const { id } = useParams();
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filterTerm, setFilterTerm] = useState('');

    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("/payroll");
                console.log("Fetched Payroll Data:", response.data);

                if (Array.isArray(response.data)) {
                    setEmployees(response.data);
                } else {
                    console.error("Expected an array, but got:", typeof response.data, response.data);
                    setEmployees([]);
                }
            } catch (error) {
                console.error("Error fetching payroll data:", error);
                toast.error("Failed to fetch payroll data");
            }
        };

        fetchEmployees();
    }, []);

    // Set selected employee when ID is provided
    useEffect(() => {
        if (id && employees.length) {
            const employee = employees.find(emp => emp._id === id);
            if (employee) {
                setSelectedEmployee(employee);
            }
        }
    }, [id, employees]);

    const filteredEmployees = employees?.filter(employee =>
        employee.name?.username?.toLowerCase().includes(filterTerm.toLowerCase())

    ) || [];


    const handleSelectEmployee = (emp) => {
        setSelectedEmployee(emp);
    };

    const handleUpdateSalary = async () => {
        if (!selectedEmployee) return;

        try {
            await axios.put(`/payroll/${selectedEmployee._id}`, {
                basicSalary: selectedEmployee.basicSalary,
                allowances: selectedEmployee.allowances,
                deductions: selectedEmployee.deductions
            });

            toast.success(`Salary updated successfully for ${selectedEmployee.name}`);
        } catch (error) {
            toast.error('Failed to update salary');
            console.error('Error updating salary:', error);
        }
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
                                key={emp._id}
                                className={selectedEmployee && selectedEmployee._id === emp._id ? 'selected' : ''}
                                onClick={() => handleSelectEmployee(emp)}
                            >
                                <span>{emp.name.username}</span>
                                <span>{emp.position}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {selectedEmployee ? (
                    <div className="employee-details">
                        <h2>{selectedEmployee.name.username}</h2>
                        <p className="position">{selectedEmployee.position} - {selectedEmployee.department}</p>

                        <div className="detail-section">
                            <h3>Salary Information</h3>
                            <div className="form-group">
                                <label>Basic Salary:</label>
                                <input
                                    type="number"
                                    value={selectedEmployee.basicSalary}
                                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, basicSalary: Number(e.target.value) })}
                                />
                            </div>

                            <h4>Allowances</h4>
                            {Object.entries(selectedEmployee.allowances).map(([key, value]) => (
                                <div className="form-group" key={key}>
                                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setSelectedEmployee({
                                            ...selectedEmployee,
                                            allowances: { ...selectedEmployee.allowances, [key]: Number(e.target.value) }
                                        })}
                                    />
                                </div>
                            ))}

                            <h4>Deductions</h4>
                            {Object.entries(selectedEmployee.deductions).map(([key, value]) => (
                                <div className="form-group" key={key}>
                                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setSelectedEmployee({
                                            ...selectedEmployee,
                                            deductions: { ...selectedEmployee.deductions, [key]: Number(e.target.value) }
                                        })}
                                    />
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
                                        <td>Ksh.{(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td>Ksh.{(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0) - Object.values(selectedEmployee.deductions).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td><Link to={`/finance/invoice/${selectedEmployee._id}`} className="btn-view">View</Link></td>
                                    </tr>
                                    <tr>
                                        <td>January 2025</td>
                                        <td>2025-01-31</td>
                                        <td>Ksh.{(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td>Ksh.{(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0) - Object.values(selectedEmployee.deductions).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td><Link to={`/finance/invoice/${selectedEmployee._id}`} className="btn-view">View</Link></td>
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
