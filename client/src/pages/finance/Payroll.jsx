import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./_financePayroll.scss";

// Utility functions moved outside component for better organization
const generatePayPeriods = () => {
    const today = new Date();
    return Array.from({ length: 6 }, (_, i) => {
        const month = today.getMonth() + i;
        const year = today.getFullYear() + Math.floor((today.getMonth() + i) / 12);
        const monthName = new Date(year, month % 12).toLocaleString("default", { month: "long" });
        return `${monthName} ${year}`;
    });
};

const getCurrentPayPeriod = () => {
    const today = new Date();
    const monthName = today.toLocaleString("default", { month: "long" });
    return `${monthName} ${today.getFullYear()}`;
};

const getDefaultPayDate = (payPeriod) => {
    const [monthName, year] = payPeriod.split(" ");
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    const payYear = parseInt(year);
    return `${payYear}-${String(monthIndex + 1).padStart(2, "0")}-28`;
};

const PayrollTable = ({ data, loading }) => {
    if (loading) {
        return <p>Loading payroll data...</p>;
    }

    if (data.length === 0) {
        return <p>No payroll data found</p>;
    }

    return (
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
                {data.map((employee) => (
                    <tr key={employee._id}>
                        <td>{employee.name.username}</td>
                        <td>{employee.department}</td>
                        <td>${employee.basicSalary.toLocaleString()}</td>
                        <td>${Object.values(employee.allowances).reduce((a, b) => a + b, 0).toLocaleString()}</td>
                        <td>${employee.grossPay.toLocaleString()}</td>
                        <td>${Object.values(employee.deductions).reduce((a, b) => a + b, 0).toLocaleString()}</td>
                        <td>${employee.netPay.toLocaleString()}</td>
                        <td>
                            <Link to={`/finance/employee-finances/${employee.name._id}`} className="btn-view">
                                Details
                            </Link>
                            <Link to={`/finance/invoice/${employee.name._id}`} className="btn-invoice">
                                Invoice
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const Payroll = () => {
    const [payPeriod, setPayPeriod] = useState(getCurrentPayPeriod());
    const [payDate, setPayDate] = useState(getDefaultPayDate(payPeriod));
    const [payrollData, setPayrollData] = useState([]);
    const [filterTerm, setFilterTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Available pay periods
    const payPeriods = useMemo(() => generatePayPeriods(), []);

    // Fetch payroll data from backend
    useEffect(() => {
        const fetchPayrollData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/payroll");

                // Ensure response.data is an array before setting it
                if (Array.isArray(response.data)) {
                    setPayrollData(response.data);
                } else {
                    console.error("Expected an array, but got:", typeof response.data, response.data);
                    setPayrollData([]); // Default to an empty array to prevent errors
                }

            } catch (error) {
                console.error("Error fetching payroll data:", error);
                toast.error("Failed to fetch payroll data");
            } finally {
                setLoading(false);
            }
        };

        fetchPayrollData();
    }, []);

    // Handle payroll processing request
    const handleRunPayroll = async () => {
        try {
            setIsProcessing(true);
            await axios.post("/payroll/process", { payPeriod, payDate });
            toast.success(`Payroll processed successfully for ${payPeriod}`);

            // Refresh payroll data after processing
            const response = await axios.get("/payroll");
            setPayrollData(response.data);
        } catch (error) {
            console.error("Error processing payroll:", error);
            toast.error("Failed to process payroll: " + (error.response?.data?.message || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    // Filter payroll data based on search input
    const filteredPayroll = useMemo(() => {
        return payrollData.filter((employee) =>
            (employee.name?.username || "").toLowerCase().includes(filterTerm.toLowerCase()) ||
            (employee.department || "").toLowerCase().includes(filterTerm.toLowerCase())
        );
    }, [payrollData, filterTerm]);

    return (
        <div className="payroll">
            <h1>Payroll Management</h1>

            <div className="payroll-controls">
                <div className="control-group">
                    <label>Pay Period:</label>
                    <select
                        value={payPeriod}
                        onChange={(e) => {
                            setPayPeriod(e.target.value);
                            setPayDate(getDefaultPayDate(e.target.value));
                        }}
                    >
                        {payPeriods.map((period) => (
                            <option key={period} value={period}>{period}</option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label>Pay Date:</label>
                    <input
                        type="date"
                        value={payDate}
                        onChange={(e) => setPayDate(e.target.value)}
                    />
                </div>

                <button
                    className={`btn-primary ${isProcessing ? 'btn-processing' : ''}`}
                    onClick={handleRunPayroll}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Run Payroll'}
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search employees or departments..."
                    value={filterTerm}
                    onChange={(e) => setFilterTerm(e.target.value)}
                />
            </div>

            <PayrollTable data={filteredPayroll} loading={loading} />
        </div>
    );
};

export default Payroll;
