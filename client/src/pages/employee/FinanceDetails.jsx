import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/styles.scss";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const invoiceRef = useRef(null);

    const generatePDF = async () => {
        if (!invoiceRef.current) {
            console.error("Invoice content is not available for PDF generation.");
            return;
        }

        try {
            // Use html2canvas to convert the invoice div to a canvas
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2, // Increases resolution
                useCORS: true, // Helps with rendering images
                logging: false // Disables logging
            });

            // Create a new jsPDF instance
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Convert canvas to image data
            const imgData = canvas.toDataURL('image/png');

            // Get PDF page dimensions
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate image dimensions to fit the page
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add the image to the PDF
            pdf.addImage(
                imgData,
                'PNG',
                0,
                0,
                imgWidth,
                imgHeight
            );

            // Generate filename using employee details
            const filename = `Payslip_${employee.name.username}_${employee.payPeriod}.pdf`;

            // Save the PDF
            pdf.save(filename);

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const companyInfo = {
        name: "Farmers Choice Co.",
        logo: "/src/pages/employee/assets/logo.png",
        address: "Nairobi, Kahawa West, LA 94043",
        phone: "+254 12345678",
        email: "farmerchoice@co-op.com"
    };

    useEffect(() => {
        const fetchPayrollData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Unauthorized: Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("/payroll/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                setEmployee(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch payroll data");
            } finally {
                setLoading(false);
            }
        };

        fetchPayrollData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!employee) return <div>Error: Payroll data not found</div>;

    const totalAllowances = Object.values(employee.allowances).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(employee.deductions).reduce((sum, val) => sum + val, 0);
    const grossPay = employee.basicSalary + totalAllowances;
    const netPay = grossPay - totalDeductions;

    return (
        <div className="invoice-page" ref={invoiceRef}>
            <div className="invoice-actions non-printable">
                <button className="btn-primary" onClick={generatePDF}>
                    <i className="fas fa-file-pdf"></i> Generate PDF
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
                        <p>Pay Period: {employee.payPeriod}</p>
                        <p>Pay Date: {new Date(employee.payDate).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="employee-details">
                    <h3>Employee Information</h3>
                    <div className="details-grid">
                        <div>
                            <p><strong>Name:</strong> {employee.name.username}</p>
                            <p><strong>Position:</strong> {employee.department}</p>
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
                                    <td>Ksh.{employee.basicSalary.toLocaleString()}</td>
                                </tr>
                                {Object.entries(employee.allowances).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key.charAt(0).toUpperCase() + key.slice(1)} Allowance</td>
                                        <td>Ksh.{value.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <td><strong>Gross Pay</strong></td>
                                    <td><strong>Ksh.{grossPay.toLocaleString()}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="details-section">
                        <h3>Deductions</h3>
                        <table className="invoice-table">
                            <tbody>
                                {Object.entries(employee.deductions).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                        <td>Ksh.{value.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <td><strong>Total Deductions</strong></td>
                                    <td><strong>Ksh.{totalDeductions.toLocaleString()}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="net-pay">
                    <h3>Net Pay</h3>
                    <div className="net-pay-amount">Ksh.{netPay.toLocaleString()}</div>
                </div>

                <div className="invoice-footer">
                    <p>This is a computer-generated document. No signature is required.</p>
                    <p>&copy; 2025 {companyInfo.name}. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Invoice;