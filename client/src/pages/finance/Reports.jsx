import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Reports = () => {
    const [reportType, setReportType] = useState("payroll");
    const [period, setPeriod] = useState("Feb 2025");
    const [payrollData, setPayrollData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (reportType === "payroll") {
            fetchPayrollData();
        }
    }, [reportType, period]);

    const fetchPayrollData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/payroll");
            setPayrollData(response.data);
        } catch (error) {
            toast.error("Failed to load payroll data");
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = () => {
        if (!payrollData || payrollData.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const doc = new jsPDF('landscape');

        // Title and Period
        doc.setFontSize(18);
        doc.text(`Payroll Report - ${period}`, 14, 22);

        // Summary Statistics
        const totalPayroll = payrollData.reduce((sum, record) => sum + record.grossPay, 0);
        const totalBasicSalary = payrollData.reduce((sum, record) => sum + record.basicSalary, 0);
        const totalAllowances = payrollData.reduce((sum, record) =>
            sum + Object.values(record.allowances).reduce((a, b) => a + b, 0), 0
        );
        const totalDeductions = payrollData.reduce((sum, record) =>
            sum + Object.values(record.deductions).reduce((a, b) => a + b, 0), 0
        );

        // Summary Section
        doc.setFontSize(10);
        doc.text(`Total Payroll: Ksh. ${totalPayroll.toLocaleString()}`, 14, 35);
        doc.text(`Total Basic Salaries: Ksh. ${totalBasicSalary.toLocaleString()}`, 14, 42);
        doc.text(`Total Allowances: Ksh. ${totalAllowances.toLocaleString()}`, 14, 49);
        doc.text(`Total Deductions: Ksh. ${totalDeductions.toLocaleString()}`, 14, 56);

        // Prepare table data
        const tableData = payrollData.map(record => [
            record.name.username,
            record.department,
            `Ksh. ${record.basicSalary.toLocaleString()}`,
            `Ksh. ${Object.values(record.allowances).reduce((a, b) => a + b, 0).toLocaleString()}`,
            `Ksh. ${Object.values(record.deductions).reduce((a, b) => a + b, 0).toLocaleString()}`,
            `Ksh. ${record.netPay.toLocaleString()}`
        ]);

        // Create table
        autoTable(doc, { // <-- Correct usage
            startY: 65,
            head: [["Name", "Department", "Basic Salary", "Allowances", "Deductions", "Net Pay"]],
            body: tableData,
            theme: "striped",
            styles: {
                fontSize: 8,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 30 },
                2: { cellWidth: 25 },
                3: { cellWidth: 25 },
                4: { cellWidth: 25 },
                5: { cellWidth: 25 },
            },
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
        }

        // Save the PDF
        doc.save(`Payroll_Report_${period.replace(/\s+/g, '_')}.pdf`);
    };

    const exportToExcel = () => {
        if (!payrollData || payrollData.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const ws = XLSX.utils.json_to_sheet(payrollData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payroll Report");
        XLSX.writeFile(wb, `Payroll_Report_${period.replace(/\s+/g, '_')}.xlsx`);
    };

    const payrollChart = payrollData ? {
        labels: payrollData.map(record => record.name.username),
        datasets: [{
            label: "Gross Pay (Ksh.)",
            data: payrollData.map(record => record.grossPay),
            backgroundColor: "rgba(54, 162, 235, 0.6)"
        }]
    } : null;

    const payrollPieChart = payrollData ? {
        labels: ["Basic Salary", "Allowances", "Deductions", "Net Pay"],
        datasets: [{
            data: [
                payrollData.reduce((sum, record) => sum + record.basicSalary, 0),
                payrollData.reduce((sum, record) => sum + Object.values(record.allowances).reduce((a, b) => a + b, 0), 0),
                payrollData.reduce((sum, record) => sum + Object.values(record.deductions).reduce((a, b) => a + b, 0), 0),
                payrollData.reduce((sum, record) => sum + record.netPay, 0)
            ],
            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4CAF50"]
        }]
    } : null;

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
                    >
                        <option>Jan 2025</option>
                        <option>Feb 2025</option>
                        <option>Q1 2025</option>
                        <option>2024</option>
                    </select>
                </div>
            </div>

            <div className="reports__preview">
                <h2 className="reports__subtitle">
                    {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - {period}
                </h2>

                {loading ? (
                    <p>Loading payroll data...</p>
                ) : reportType === "payroll" && payrollData ? (
                    <div className="reports__content">
                        <div className="summary-boxes">
                            <SummaryBox title="Total Payroll" value={payrollData.reduce((sum, record) => sum + record.grossPay, 0)} />
                            <SummaryBox title="Basic Salaries" value={payrollData.reduce((sum, record) => sum + record.basicSalary, 0)} />
                            <SummaryBox title="Total Allowances" value={payrollData.reduce((sum, record) => sum + Object.values(record.allowances).reduce((a, b) => a + b, 0), 0)} />
                            <SummaryBox title="Total Deductions" value={payrollData.reduce((sum, record) => sum + Object.values(record.deductions).reduce((a, b) => a + b, 0), 0)} />
                        </div>

                        <div className="chart-container">
                            <Bar data={payrollChart} />
                            <Pie data={payrollPieChart} />
                        </div>

                        <div className="reports__actions">
                            <button className="btn-export" onClick={exportToPDF}>Export PDF & Print</button>
                            <button className="btn-export" onClick={exportToExcel}>Export Excel & Print</button>
                        </div>
                    </div>
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
};

const SummaryBox = ({ title, value }) => (
    <div className="summary-box">
        <h3>{title}</h3>
        <p className="value">Ksh. {value.toLocaleString()}</p>
    </div>
);

export default Reports;