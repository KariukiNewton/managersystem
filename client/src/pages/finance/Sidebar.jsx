import React from "react";
import { Link } from 'react-router-dom';
import './_financeSidebar.scss';

const Sidebar = ({ companyInfo }) => {
    return (
        <div className="sidebar">
            <div className="company-info">
                <img src={companyInfo.logo} alt="Company Logo" className="company-logo" />
                <h2>{companyInfo.name}</h2>
            </div>
            <nav className="nav-menu">
                <Link to="/finance" className="nav-item">
                    <i className="fas fa-chart-line"></i> Dashboard
                </Link>
                <Link to="/finance/payroll" className="nav-item">
                    <i className="fas fa-money-check-alt"></i> Payroll Management
                </Link>
                <Link to="/finance/employee-finances" className="nav-item">
                    <i className="fas fa-users"></i> Employee Finances
                </Link>
                <Link to="/finance/reports" className="nav-item">
                    <i className="fas fa-file-invoice"></i> Reports
                </Link>
                <Link to="/finance/settings" className="nav-item">
                    <i className="fas fa-cog"></i> Settings
                </Link>
            </nav>
            <div className="sidebar-footer">
                <p>Finance Department Portal</p>
                <p>Head of Finance</p>
            </div>
        </div>
    );
};

export default Sidebar;