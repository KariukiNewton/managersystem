import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/styles.scss";

const Invoice = ({ employee: propEmployee }) => {
    const { employeeId } = useParams();
    const dummyEmployee = {
        name: "John Doe",
        position: "Software Engineer",
        department: "IT",
        basicSalary: 5000,
        allowances: { housing: 1000, transport: 500 },
        deductions: { tax: 800, insurance: 200 }
    };
    const [employee, setEmployee] = useState(propEmployee || dummyEmployee);
    const [loading, setLoading] = useState(false); //!propEmployee && !employeeId

    useEffect(() => {
        if (!propEmployee && employeeId) {
            fetch(`/api/employees/${employeeId}`)
                .then(response => response.json())
                .then(data => {
                    setEmployee(data);
                    setLoading(false);
                })
                .catch(error => console.error("Error fetching employee data:", error));
        }
    }, [employeeId, propEmployee]);

    const companyInfo = {
        name: "TechCorp Inc.",
        logo: "/logo.png",
        address: "123 Tech Avenue, Silicon Valley, CA 94043",
        phone: "+1 (555) 123-4567",
        email: "finance@techcorp.com"
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!employee) {
        return <div>Error: Employee not found</div>;
    }

    const totalAllowances = Object.values(employee.allowances).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(employee.deductions).reduce((sum, val) => sum + val, 0);
    const grossPay = employee.basicSalary + totalAllowances;
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
                        <p>Pay Period: February 1-28, 2025</p>
                        <p>Pay Date: February 28, 2025</p>
                    </div>
                </div>

                <div className="employee-details">
                    <h3>Employee Information</h3>
                    <div className="details-grid">
                        <div>
                            <p><strong>Name:</strong> {employee.name}</p>
                            <p><strong>Position:</strong> {employee.position}</p>
                        </div>
                        <div>
                            <p><strong>Department:</strong> {employee.department}</p>
                            <p><strong>Payment Method:</strong> Direct Deposit</p>
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
                                    <td>${employee.basicSalary.toLocaleString()}</td>
                                </tr>
                                {Object.entries(employee.allowances).map(([key, value]) => (
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
                                {Object.entries(employee.deductions).map(([key, value]) => (
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
                        Payment processed via Direct Deposit on February 28, 2025
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

export default Invoice;
