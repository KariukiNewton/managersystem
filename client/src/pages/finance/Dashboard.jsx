import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './Sidebar';
import Payroll from './Payroll';
import EmployeeFinances from './EmployeeFinance';
import Settings from './Settings';
import Reports from './Reports';
import Invoice from './Invoice';


const FinanceDashboard = () => {
    const [companyInfo, setCompanyInfo] = useState({
        name: "TechCorp Inc.",
        logo: "/logo.png",
        address: "123 Tech Avenue, Silicon Valley, CA 94043"
    });

    return (
        <div>
            <div className="finance-module">
                <Sidebar companyInfo={companyInfo} />
                <div className="content-area">
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/payroll" element={<Payroll />} />
                        <Route path="/employee-finances/:id?" element={<EmployeeFinances />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/invoice/:id" element={<Invoice />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalEmployees: 85,
        totalPayroll: 425000,
        avgSalary: 5000,
        pendingPayments: 12
    });

    const [recentPayments, setRecentPayments] = useState([
        { id: 'P001', employee: 'John Doe', amount: 5750, date: '2025-02-20' },
        { id: 'P002', employee: 'Jane Smith', amount: 6350, date: '2025-02-20' },
        { id: 'P003', employee: 'Mark Johnson', amount: 4800, date: '2025-02-20' }
    ]);

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
                    <p className="stat-value">${stats.totalPayroll.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Average Salary</h3>
                    <p className="stat-value">${stats.avgSalary.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Payments</h3>
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
                            {recentPayments.map(payment => (
                                <tr key={payment.id}>
                                    <td>{payment.id}</td>
                                    <td>{payment.employee}</td>
                                    <td>${payment.amount.toLocaleString()}</td>
                                    <td>{payment.date}</td>
                                    <td>
                                        <Link to={`/invoice/${payment.id}`} className="btn-view">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Link to="/payroll" className="btn-primary">View All Payments</Link>
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
