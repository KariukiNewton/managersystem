import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./_financePayroll.scss";

// Utility functions
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
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}-28`;
};

const PayrollTable = ({ data, departmentMap, loading }) => {
    if (loading) return <p>Loading payroll data...</p>;
    if (data.length === 0) return <p>No payroll data found</p>;

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
                        <td>{departmentMap[employee.department] || "Unknown"}</td>
                        <td>Ksh {employee.basicSalary.toLocaleString()}</td>
                        <td>Ksh {Object.values(employee.allowances).reduce((a, b) => a + b, 0).toLocaleString()}</td>
                        <td>Ksh {employee.grossPay.toLocaleString()}</td>
                        <td>Ksh {Object.values(employee.deductions).reduce((a, b) => a + b, 0).toLocaleString()}</td>
                        <td>Ksh {employee.netPay.toLocaleString()}</td>
                        <td>
                            <Link to={`/finance/employee-finances/${employee.name._id}`} className="btn-view">Details</Link>
                            <Link to={`/finance/invoice/${employee.name._id}`} className="btn-invoice">Invoice</Link>
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
    const [departments, setDepartments] = useState({});
    const [filterTerm, setFilterTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const payPeriods = useMemo(() => generatePayPeriods(), []);

    // Fetch Payroll Data
    useEffect(() => {
        const fetchPayrollData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/payroll");
                console.log("Fetched Payroll Data:", response.data);

                if (Array.isArray(response.data)) {
                    setPayrollData(response.data);
                } else {
                    console.error("Expected an array, but got:", typeof response.data, response.data);
                    setPayrollData([]);
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

    // Fetch Department Names
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("/departments"); // Assuming this API returns department names
                const departmentMap = response.data.reduce((acc, dept) => {
                    acc[dept._id] = dept.name; // Store department ID -> Name mapping
                    return acc;
                }, {});
                setDepartments(departmentMap);
            } catch (error) {
                console.error("Error fetching departments:", error);
                toast.error("Failed to fetch department data");
            }
        };

        fetchDepartments();
    }, []);

    // Handle payroll processing
    const handleRunPayroll = async () => {
        try {
            setIsProcessing(true);
            setPayrollData([]); // Clears old data to prevent stale UI

            await axios.post("/payroll/process", { payPeriod, payDate });
            toast.success(`Payroll processed successfully for ${payPeriod}`);

            // Fetch updated payroll data
            const response = await axios.get("/payroll");
            console.log("Updated Payroll Data:", response.data); // Check in console

            if (Array.isArray(response.data)) {
                setPayrollData(response.data);
            } else {
                console.error("Unexpected payroll data format:", response.data);
                setPayrollData([]); // Reset state if unexpected data is received
            }
        } catch (error) {
            console.error("Error processing payroll:", error);
            toast.error("Failed to process payroll: " + (error.response?.data?.message || error.message));
        } finally {
            setIsProcessing(false);
        }
    };


    // Filter payroll data
    const filteredPayroll = useMemo(() => {
        return payrollData.filter((employee) =>
            (employee.name?.username || "").toLowerCase().includes(filterTerm.toLowerCase()) ||
            (departments[employee.department] || "").toLowerCase().includes(filterTerm.toLowerCase()) // Filter by department name
        );
    }, [payrollData, filterTerm, departments]);

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
                            <option key={period} value={period}>
                                {period}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label>Pay Date:</label>
                    <input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
                </div>

                <button
                    className={`btn-primary ${isProcessing ? "btn-processing" : ""}`}
                    onClick={handleRunPayroll}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Run Payroll"}
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

            <PayrollTable data={filteredPayroll} departmentMap={departments} loading={loading} />
        </div>
    );
};

export default Payroll;


