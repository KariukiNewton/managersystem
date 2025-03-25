import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Payroll from "./Payroll";
import EmployeeFinances from "./EmployeeFinance";
import Settings from "./Settings";
import Reports from "./Reports";
import Invoice from "./Invoice";

const FinanceDashboard = () => {
    return (
        <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="home" element={<DashboardHome />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="employee-finances" element={<EmployeeFinances />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="invoice" element={<Invoice />} />
        </Routes>
    );
};

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalPayroll: 0,
        avgSalary: 0,
        pendingPayments: 0
    });

    const [recentPayments, setRecentPayments] = useState([]);

    useEffect(() => {
        // Fetch payroll stats
        const fetchStats = async () => {
            try {
                const response = await fetch("/payroll");
                const data = await response.json();

                if (response.ok) {
                    const totalEmployees = data.length;
                    const totalPayroll = data.reduce((sum, record) => sum + record.netPay, 0);
                    const avgSalary = totalEmployees ? totalPayroll / totalEmployees : 0;
                    const pendingPayments = data.filter(record => record.netPay < record.grossPay).length;

                    setStats({ totalEmployees, totalPayroll, avgSalary, pendingPayments });
                } else {
                    console.error("Failed to fetch payroll data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching payroll data:", error);
            }
        };

        // Fetch recent payments
        const fetchRecentPayments = async () => {
            try {
                const response = await fetch("/api/payroll?limit=5&sort=-payDate");
                const data = await response.json();

                if (response.ok) {
                    setRecentPayments(data);
                } else {
                    console.error("Failed to fetch recent payments:", data.message);
                }
            } catch (error) {
                console.error("Error fetching recent payments:", error);
            }
        };

        fetchStats();
        fetchRecentPayments();
    }, []);

    return (
        <div className="dashboard">
            <h1>Finance Dashboard</h1>
            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total Employees</h3>
                    <p className="stat-value">{stats.totalEmployees}</p>
                </div>
                <div className="stat-card">
                    <h3>Monthly Payroll</h3>
                    <p className="stat-value">Ksh.{stats.totalPayroll.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Average Salary</h3>
                    <p className="stat-value">Ksh.{stats.avgSalary.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Payments</h3>
                    <p className="stat-value">{stats.pendingPayments}</p>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="section">
                    <h2>Recent Payments</h2>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Employee</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPayments.map((payment) => (
                                <tr key={payment._id}>
                                    <td>{payment._id}</td>
                                    <td>{payment.name.username}</td>
                                    <td>${payment.netPay.toLocaleString()}</td>
                                    <td>{new Date(payment.payDate).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/finance/dashboard/invoice/${payment._id}`} className="btn-view">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Link to="/finance/dashboard/payroll" className="btn-primary">
                        View All Payments
                    </Link>
                </div>

                <div className="section">
                    <h2>Payroll Summary</h2>
                    <div className="summary-chart">
                        {/* Chart placeholder - replace with actual chart component */}
                        <div className="chart-placeholder">
                            <p>Payroll distribution by department</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;
