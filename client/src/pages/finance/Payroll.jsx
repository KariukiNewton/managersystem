// Payroll.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './_financePayroll.scss';

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

const Payroll = () => {
    const [payPeriod, setPayPeriod] = useState('February 2025');
    const [payrollData, setPayrollData] = useState([]);
    const [filterTerm, setFilterTerm] = useState('');

    // Calculate payroll data on component mount
    useEffect(() => {
        // In a real app, this would be fetched from the API
        const calculatedPayroll = mockEmployees.map(emp => {
            const totalAllowances = Object.values(emp.allowances).reduce((sum, val) => sum + val, 0);
            const totalDeductions = Object.values(emp.deductions).reduce((sum, val) => sum + val, 0);
            const grossPay = emp.basicSalary + totalAllowances;
            const netPay = grossPay - totalDeductions;

            return {
                ...emp,
                totalAllowances,
                totalDeductions,
                grossPay,
                netPay
            };
        });

        setPayrollData(calculatedPayroll);
    }, []);

    const filteredPayroll = payrollData.filter(employee =>
        employee.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(filterTerm.toLowerCase())
    );

    const handleRunPayroll = () => {
        toast.success("Payroll processed successfully for " + payPeriod);
    };

    return (
        <div className="payroll">
            <h1>Payroll Management</h1>

            <div className="payroll-controls">
                <div className="control-group">
                    <label>Pay Period:</label>
                    <select value={payPeriod} onChange={(e) => setPayPeriod(e.target.value)}>
                        <option>January 2025</option>
                        <option>February 2025</option>
                        <option>March 2025</option>
                    </select>
                </div>

                <div className="control-group">
                    <label>Pay Date:</label>
                    <input type="date" defaultValue="2025-02-28" />
                </div>

                <button className="btn-primary" onClick={handleRunPayroll}>
                    Run Payroll
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={filterTerm}
                    onChange={(e) => setFilterTerm(e.target.value)}
                />
            </div>

            <table className="data-table payroll-table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Basic Salary</th>
                        <th>Allowances</th>
                        <th>Gross Pay</th>
                        <th>Deductions</th>
                        <th>Net Pay</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPayroll.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.department}</td>
                            <td>${employee.basicSalary.toLocaleString()}</td>
                            <td>${employee.totalAllowances.toLocaleString()}</td>
                            <td>${employee.grossPay.toLocaleString()}</td>
                            <td>${employee.totalDeductions.toLocaleString()}</td>
                            <td>${employee.netPay.toLocaleString()}</td>
                            <td>
                                <Link to={`/finance/employee-finances/${employee.id}`} className="btn-view">Details</Link>
                                <Link to={`/finance/invoice/${employee.id}`} className="btn-invoice">Invoice</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Payroll;