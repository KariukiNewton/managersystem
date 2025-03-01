import React, { useState } from "react";
import { toast } from "react-toastify";

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

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCompanyInfo({ ...companyInfo, logo: imageUrl });
        }
    };

    const saveSettings = () => {
        localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
        localStorage.setItem("payrollSettings", JSON.stringify(payrollSettings));
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="settings">
            <h1 className="settings-title">Finance Settings</h1>

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
                        <input type="file" accept="image/*" onChange={handleFileUpload} />
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

            <button className="btn-primary save-btn" onClick={saveSettings}>Save Settings</button>
        </div>
    );
};

export default Settings;
