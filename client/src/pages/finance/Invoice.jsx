import React from "react";

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

export default Invoice;