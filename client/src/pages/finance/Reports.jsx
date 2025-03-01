import React, { useState } from "react";
import { toast } from "react-toastify";

const Reports = () => {
    const [reportType, setReportType] = useState("payroll");
    const [period, setPeriod] = useState("Feb 2025");

    const generateReport = () => {
        toast.info(`Generating ${reportType} report for ${period}...`);
        setTimeout(() => {
            toast.success("Report generated successfully!");
        }, 1500);
    };

    return (
        <div className="reports">
            <h1 className="reports__title">Financial Reports</h1>

            <div className="reports__controls">
                <div className="control-group">
                    <label htmlFor="reportType">Report Type:</label>
                    <select
                        id="reportType"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        aria-label="Select report type"
                    >
                        <option value="payroll">Payroll Summary</option>
                        <option value="department">Department Expenditure</option>
                        <option value="tax">Tax Report</option>
                        <option value="allowances">Allowances Report</option>
                    </select>
                </div>

                <div className="control-group">
                    <label htmlFor="period">Period:</label>
                    <select
                        id="period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        aria-label="Select report period"
                    >
                        <option>Jan 2025</option>
                        <option>Feb 2025</option>
                        <option>Q1 2025</option>
                        <option>2024</option>
                    </select>
                </div>

                <button className="btn-primary" onClick={generateReport} aria-label="Generate report">
                    Generate Report
                </button>
            </div>

            <div className="reports__preview">
                <h2 className="reports__subtitle">
                    {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - {period}
                </h2>

                {reportType === "payroll" && (
                    <div className="reports__content">
                        <div className="summary-boxes">
                            <SummaryBox title="Total Payroll" value={425000} />
                            <SummaryBox title="Basic Salaries" value={350000} />
                            <SummaryBox title="Total Allowances" value={75000} />
                            <SummaryBox title="Total Deductions" value={125000} />
                        </div>

                        <div className="chart-placeholder">
                            <p>Payroll distribution chart</p>
                        </div>

                        <div className="reports__actions">
                            <button className="btn-export">Export PDF</button>
                            <button className="btn-export">Export Excel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SummaryBox = ({ title, value }) => (
    <div className="summary-box">
        <h3>{title}</h3>
        <p className="value">${value.toLocaleString()}</p>
    </div>
);

export default Reports;
