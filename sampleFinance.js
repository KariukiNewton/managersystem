// FinanceModule.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FinanceModule.scss';

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

// Main Finance Module Component
const FinanceModule = () => {
    const [companyInfo, setCompanyInfo] = useState({
        name: "TechCorp Inc.",
        logo: "/logo.png",
        address: "123 Tech Avenue, Silicon Valley, CA 94043"
    });

    return (
        <Router>
            <div className="finance-module">
                <Sidebar companyInfo={companyInfo} />
                <div className="content-area">
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/payroll" element={<Payroll />} />
                        <Route path="/employee-finances/:id?" element={<EmployeeFinances />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/invoice/:id" element={<Invoice />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

// Sidebar Component
const Sidebar = ({ companyInfo }) => {
    return (
        <div className="sidebar">
            <div className="company-info">
                <img src={companyInfo.logo} alt="Company Logo" className="company-logo" />
                <h2>{companyInfo.name}</h2>
            </div>
            <nav className="nav-menu">
                <Link to="/" className="nav-item">
                    <i className="fas fa-chart-line"></i> Dashboard
                </Link>
                <Link to="/payroll" className="nav-item">
                    <i className="fas fa-money-check-alt"></i> Payroll Management
                </Link>
                <Link to="/employee-finances" className="nav-item">
                    <i className="fas fa-users"></i> Employee Finances
                </Link>
                <Link to="/reports" className="nav-item">
                    <i className="fas fa-file-invoice"></i> Reports
                </Link>
                <Link to="/settings" className="nav-item">
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

// Dashboard Component
const Dashboard = () => {
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

// Payroll Management Component
const Payroll = () => {
    const [payPeriod, setPayPeriod] = useState('February 2025');
    const [payrollData, setPayrollData] = useState(mockEmployees.map(emp => {
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
    }));

    const [filterTerm, setFilterTerm] = useState('');

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
                                <Link to={`/employee-finances/${employee.id}`} className="btn-view">Details</Link>
                                <Link to={`/invoice/${employee.id}`} className="btn-invoice">Invoice</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Employee Finances Component
const EmployeeFinances = () => {
    const [employees, setEmployees] = useState(mockEmployees);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filterTerm, setFilterTerm] = useState('');

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
                                        <td><Link to={`/invoice/${selectedEmployee.id}`} className="btn-view">View</Link></td>
                                    </tr>
                                    <tr>
                                        <td>January 2025</td>
                                        <td>2025-01-31</td>
                                        <td>${(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td>${(selectedEmployee.basicSalary + Object.values(selectedEmployee.allowances).reduce((sum, val) => sum + val, 0) - Object.values(selectedEmployee.deductions).reduce((sum, val) => sum + val, 0)).toLocaleString()}</td>
                                        <td><Link to={`/invoice/${selectedEmployee.id}`} className="btn-view">View</Link></td>
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

// Reports Component
const Reports = () => {
    const [reportType, setReportType] = useState('payroll');
    const [period, setPeriod] = useState('Feb 2025');

    const generateReport = () => {
        toast.info(`Generating ${reportType} report for ${period}...`);
        setTimeout(() => {
            toast.success("Report generated successfully!");
        }, 1500);
    };

    return (
        <div className="reports">
            <h1>Financial Reports</h1>

            <div className="report-controls">
                <div className="control-group">
                    <label>Report Type:</label>
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option value="payroll">Payroll Summary</option>
                        <option value="department">Department Expenditure</option>
                        <option value="tax">Tax Report</option>
                        <option value="allowances">Allowances Report</option>
                    </select>
                </div>

                <div className="control-group">
                    <label>Period:</label>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option>Jan 2025</option>
                        <option>Feb 2025</option>
                        <option>Q1 2025</option>
                        <option>2024</option>
                    </select>
                </div>

                <button className="btn-primary" onClick={generateReport}>
                    Generate Report
                </button>
            </div>

            <div className="report-preview">
                <h2>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - {period}</h2>

                {reportType === 'payroll' && (
                    <div className="report-content">
                        <div className="summary-boxes">
                            <div className="summary-box">
                                <h3>Total Payroll</h3>
                                <p className="value">$425,000</p>
                            </div>
                            <div className="summary-box">
                                <h3>Basic Salaries</h3>
                                <p className="value">$350,000</p>
                            </div>
                            <div className="summary-box">
                                <h3>Total Allowances</h3>
                                <p className="value">$75,000</p>
                            </div>
                            <div className="summary-box">
                                <h3>Total Deductions</h3>
                                <p className="value">$125,000</p>
                            </div>
                        </div>

                        <div className="chart-placeholder">
                            <p>Payroll distribution chart</p>
                        </div>

                        <button className="btn-export">Export PDF</button>
                        <button className="btn-export">Export Excel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Settings Component
const Settings = () => {
    const [companyInfo, setCompanyInfo] = useState({
        name: "TechCorp Inc.",
        logo: "/logo.png",
        address: "123 Tech Avenue, Silicon Valley, CA 94043",
        phone: "+1 (555) 123-4567",
        email: "finance@techcorp.com"
    });

    const [payrollSettings, setPayrollSettings] = useState({
        payDay: 28,
        payPeriod: "monthly",
        defaultPaymentMethod: "directDeposit",
        taxRate: 15,
        pensionRate: 5
    });

    const saveSettings = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="settings">
            <h1>Finance Settings</h1>

            <div className="settings-section">
                <h2>Company Information</h2>
                <div className="form-group">
                    <label>Company Name:</label>
                    <input
                        type="text"
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Company Logo:</label>
                    <div className="logo-upload">
                        <img src={companyInfo.logo} alt="Company Logo" className="preview-logo" />
                        <button className="btn-upload">Upload New Logo</button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Company Address:</label>
                    <textarea
                        value={companyInfo.address}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Contact Phone:</label>
                    <input
                        type="text"
                        value={companyInfo.phone}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Contact Email:</label>
                    <input
                        type="email"
                        value={companyInfo.email}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="settings-section">
                <h2>Payroll Settings</h2>
                <div className="form-group">
                    <label>Default Pay Day:</label>
                    <input
                        type="number"
                        min="1"
                        max="31"
                        value={payrollSettings.payDay}
                        onChange={(e) => setPayrollSettings({ ...payrollSettings, payDay: parseInt(e.target.value) })}
                    />
                </div>

                <div className="form-group">
                    <label>Pay Period:</label>
                    <select
                        value={payrollSettings.payPeriod}
                        onChange={(e) => setPayrollSettings({ ...payrollSettings, payPeriod: e.target.value })}
                    >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Default Payment Method:</label>
                    <select
                        value={payrollSettings.defaultPaymentMethod}
                        onChange={(e) => setPayrollSettings({ ...payrollSettings, defaultPaymentMethod: e.target.value })}
                    >
                        <option value="directDeposit">Direct Deposit</option>
                        <option value="check">Check</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Default Tax Rate (%):</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={payrollSettings.taxRate}
                        onChange={(e) => setPayrollSettings({ ...payrollSettings, taxRate: parseInt(e.target.value) })}
                    />
                </div>

                <div className="form-group">
                    <label>Default Pension Rate (%):</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={payrollSettings.pensionRate}
                        onChange={(e) => setPayrollSettings({ ...payrollSettings, pensionRate: parseInt(e.target.value) })}
                    />
                </div>
            </div>

            <button className="btn-primary" onClick={saveSettings}>Save Settings</button>
        </div>
    );
};

// Invoice Component
const Invoice = () => {
    const [invoiceData, setInvoiceData] = useState({
        employee: mockEmployees[0],
        payPeriod: "February 1-28, 2025",
        payDate: "February 28, 2025",
        paymentMethod: "Direct Deposit"
    });

    const companyInfo = {
        name: "TechCorp Inc.",
        logo: "/logo.png",
        address: "123 Tech Avenue, Silicon Valley, CA 94043",
        phone: "+1 (555) 123-4567",
        email: "finance@techcorp.com"
    };

    const totalAllowances = Object.values(invoiceData.employee.allowances).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(invoiceData.employee.deductions).reduce((sum, val) => sum + val, 0);
    const grossPay = invoiceData.employee.basicSalary + totalAllowances;
    const netPay = grossPay - totalDeductions;

    const printInvoice = () => {
        window.print();
    };

    return (
        <div className="invoice-page">
            <div className="invoice-actions non-printable">
                <button className="btn-primary" onClick={printInvoice}>
                    <i className="fas fa-print"></i> Print Invoice
                </button>
                <button className="btn-secondary">
                    <i className="fas fa-download"></i> Download PDF
                </button>
                <button className="btn-secondary">
                    <i className="fas fa-envelope"></i> Email to Employee
                </button>
            </div>

            <div className="invoice">
                <div className="invoice-header">
                    <div className="company-details">
                        <img src={companyInfo.logo} alt="Company Logo" className="invoice-logo" />
                        <div>
                            <h2>{companyInfo.name}</h2>
                            <p>{companyInfo.address}</p>
                            <p>{companyInfo.phone}</p>
                            <p>{companyInfo.email}</p>
                        </div>
                    </div>
                    <div className="invoice-title">
                        <h1>Payslip</h1>
                        <p>Pay Period: {invoiceData.payPeriod}</p>
                        <p>Pay Date: {invoiceData.payDate}</p>
                    </div>
                </div>

                <div className="employee-details">
                    <h3>Employee Information</h3>
                    <div className="details-grid">
                        <div>
                            <p><strong>Name:</strong> {invoiceData.employee.name}</p>
                            <p><strong>Position:</strong> {invoiceData.employee.position}</p>
                        </div>
                        <div>
                            <p><strong>Department:</strong> {invoiceData.employee.department}</p>
                            <p><strong>Payment Method:</strong> {invoiceData.paymentMethod}</p>
                        </div>
                    </div>
                </div>

                <div className="payment-details">
                    <div className="details-section">
                        <h3>Earnings</h3>
                        <table className="invoice-table">
                            <tbody>
                                <tr>
                                    <td>Basic Salary</td>
                                    <td>${invoiceData.employee.basicSalary.toLocaleString()}</td>
                                </tr>
                                {Object.entries(invoiceData.employee.allowances).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key.charAt(0).toUpperCase() + key.slice(1)} Allowance</td>
                                        <td>${value.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <td><strong>Gross Pay</strong></td>
                                    <td><strong>${grossPay.toLocaleString()}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="details-section">
                        <h3>Deductions</h3>
                        <table className="invoice-table">
                            <tbody>
                                {Object.entries(invoiceData.employee.deductions).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                        <td>${value.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <td><strong>Total Deductions</strong></td>
                                    <td><strong>${totalDeductions.toLocaleString()}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="net-pay">
                    <h3>Net Pay</h3>
                    <div className="net-pay-amount">${netPay.toLocaleString()}</div>
                    <p className="payment-note">
                        Payment processed via {invoiceData.paymentMethod} on {invoiceData.payDate}
                    </p>
                </div>

                <div className="invoice-footer">
                    <p>This is a computer-generated document. No signature is required.</p>
                    <p>&copy; 2025 {companyInfo.name}. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default FinanceModule;