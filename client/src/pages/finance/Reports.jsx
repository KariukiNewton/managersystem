import React from "react";

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

export default Reports;