import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DollarSignIcon, TrendingUpIcon, DatabaseIcon } from 'lucide-react';
import "./_admFinancePage.scss";

const Finance = () => {
    const [payrollData, setPayrollData] = useState([]);
    const [departments, setDepartments] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterTerm, setFilterTerm] = useState("");

    // Financial Totals State
    const [financialSummary, setFinancialSummary] = useState({
        totalBasicSalary: 0,
        totalAllowances: 0,
        totalDeductions: 0,
        totalNetPay: 0,
        totalGrossPay: 0
    });

    // Fetch Payroll Data
    useEffect(() => {
        const fetchPayrollData = async () => {
            try {
                setLoading(true);
                const [payrollResponse, departmentsResponse] = await Promise.all([
                    axios.get("/payroll"),
                    axios.get("/departments")
                ]);

                // Department Mapping
                const departmentMap = departmentsResponse.data.reduce((acc, dept) => {
                    acc[dept._id] = dept.name;
                    return acc;
                }, {});
                setDepartments(departmentMap);

                // Calculate Financial Totals
                if (Array.isArray(payrollResponse.data)) {
                    const payrollRecords = payrollResponse.data;
                    setPayrollData(payrollRecords);

                    const summary = payrollRecords.reduce((totals, employee) => {
                        totals.totalBasicSalary += employee.basicSalary || 0;
                        totals.totalAllowances += Object.values(employee.allowances || {}).reduce((a, b) => a + b, 0);
                        totals.totalDeductions += Object.values(employee.deductions || {}).reduce((a, b) => a + b, 0);
                        totals.totalNetPay += employee.netPay || 0;
                        totals.totalGrossPay += employee.grossPay || 0;
                        return totals;
                    }, {
                        totalBasicSalary: 0,
                        totalAllowances: 0,
                        totalDeductions: 0,
                        totalNetPay: 0,
                        totalGrossPay: 0
                    });

                    setFinancialSummary(summary);
                }
            } catch (error) {
                console.error("Error fetching financial data:", error);
                toast.error("Failed to fetch financial records");
            } finally {
                setLoading(false);
            }
        };

        fetchPayrollData();
    }, []);

    // Filtered Payroll Data
    const filteredPayroll = useMemo(() => {
        return payrollData.filter((employee) =>
            (employee.name?.username || "").toLowerCase().includes(filterTerm.toLowerCase()) ||
            (departments[employee.department] || "").toLowerCase().includes(filterTerm.toLowerCase())
        );
    }, [payrollData, filterTerm, departments]);

    // Financial Summary Cards
    const FinancialSummaryCard = () => (
        <div className="financial-summary-grid">
            <div className="summary-card">
                <div className="summary-card__header">
                    <span>Total Basic Salary</span>
                    <DollarSignIcon className="summary-card__icon" />
                </div>
                <div className="summary-card__value">
                    Ksh {financialSummary.totalBasicSalary.toLocaleString()}
                </div>
            </div>
            <div className="summary-card">
                <div className="summary-card__header">
                    <span>Total Allowances</span>
                    <TrendingUpIcon className="summary-card__icon" />
                </div>
                <div className="summary-card__value">
                    Ksh {financialSummary.totalAllowances.toLocaleString()}
                </div>
            </div>
            <div className="summary-card">
                <div className="summary-card__header">
                    <span>Total Deductions</span>
                    <DatabaseIcon className="summary-card__icon" />
                </div>
                <div className="summary-card__value">
                    Ksh {financialSummary.totalDeductions.toLocaleString()}
                </div>
            </div>
            <div className="summary-card">
                <div className="summary-card__header">
                    <span>Total Net Pay</span>
                    <DollarSignIcon className="summary-card__icon" />
                </div>
                <div className="summary-card__value">
                    Ksh {financialSummary.totalNetPay.toLocaleString()}
                </div>
            </div>
        </div>
    );

    return (
        <div className="admin-finance-page">
            <h1>Financial Overview</h1>

            {/* Financial Summary Section */}
            <FinancialSummaryCard />

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search employees or departments..."
                    value={filterTerm}
                    onChange={(e) => setFilterTerm(e.target.value)}
                />
            </div>

            {/* Financial Records Table */}
            <div className="financial-records-table">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Basic Salary</th>
                            <th>Allowances</th>
                            <th>Deductions</th>
                            <th>Net Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="loading-message">
                                    Loading financial records...
                                </td>
                            </tr>
                        ) : filteredPayroll.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-records-message">
                                    No financial records found
                                </td>
                            </tr>
                        ) : (
                            filteredPayroll.map((employee) => (
                                <tr key={employee._id}>
                                    <td>{employee.name.username}</td>
                                    <td>{departments[employee.department] || "Unknown"}</td>
                                    <td>Ksh {employee.basicSalary.toLocaleString()}</td>
                                    <td>Ksh {Object.values(employee.allowances).reduce((a, b) => a + b, 0).toLocaleString()}</td>
                                    <td>Ksh {Object.values(employee.deductions).reduce((a, b) => a + b, 0).toLocaleString()}</td>
                                    <td>Ksh {employee.netPay.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Finance;