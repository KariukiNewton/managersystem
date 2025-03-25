import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './_empLeaveRequests.scss';
import { ToastContainer, toast } from 'react-toastify';

const LeaveRequests = () => {
    const [leaveForm, setLeaveForm] = useState({
        startDate: '',
        endDate: '',
        leaveType: 'annual',
        reason: '',
        attachment: null,
        contactInfo: '',
        halfDay: false,
        halfDayOption: 'first'
    });
    const token = localStorage.getItem("token");
    const fileInputRef = React.useRef(null);

    const [leaveBalance, setLeaveBalance] = useState({});
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const leaveTypes = ["annual", "sick", "personal", "maternity", "paternity"];


    useEffect(() => {
        fetchLeaveData();
    }, []);

    const fetchLeaveData = async () => {
        try {
            const [balanceRes, historyRes] = await Promise.all([
                axios.get('/leaves/balance', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/leaves/my-leaves', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            // Ensure all leave types exist in state
            const defaultBalances = {
                annual: { total: 15, used: 0, pending: 0, available: 15 },
                sick: { total: 8, used: 0, pending: 0, available: 8 },
                personal: { total: 5, used: 0, pending: 0, available: 5 },
                maternity: { total: 90, used: 0, pending: 0, available: 90 },
                paternity: { total: 14, used: 0, pending: 0, available: 14 }
            };

            // Merge API response with defaults
            const updatedBalance = Object.keys(defaultBalances).reduce((acc, type) => {
                acc[type] = {
                    total: balanceRes.data[type]?.total ?? defaultBalances[type].total,
                    used: balanceRes.data[type]?.used ?? defaultBalances[type].used,
                    pending: balanceRes.data[type]?.pending ?? defaultBalances[type].pending,
                    available: balanceRes.data[type]?.available ?? defaultBalances[type].available
                };
                return acc;
            }, {});

            setLeaveBalance(updatedBalance);
            setLeaveHistory(historyRes.data);
            console.log("Leave History API Response:", historyRes.data);

        } catch (err) {
            setError('Failed to fetch leave data');
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setLeaveForm(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
        }));
    };

    const calculateDays = () => {
        if (!leaveForm.startDate || !leaveForm.endDate) return 0;
        const start = new Date(leaveForm.startDate);
        const end = new Date(leaveForm.endDate);
        let diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Ensure min 1 day

        if (diffDays < 1) diffDays = 1; // Prevent negative values
        return leaveForm.halfDay ? diffDays - 0.5 : diffDays;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(leaveForm).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            formData.append('days', calculateDays());

            await axios.post('/leave', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            fetchLeaveData(); // Refresh data after submission
            toast.success('Leave request submitted successfully!', { position: "top-right", autoClose: 3000 }); setLeaveForm({
                startDate: '', endDate: '', leaveType: 'annual', reason: '',
                attachment: null, contactInfo: '', halfDay: false, halfDayOption: 'first'
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset file input
            }
        } catch (err) {
            setError('Failed to submit leave request');
        }
    };

    if (loading) return <p>Loading leave data...</p>;
    if (error) return <p className="error">{error}</p>;

    return (

        <div className="leave-requests-page">
            {/*Leave Balances*/}
            <div className="leave-balance-section">
                <h3>Leave Balance</h3>
                <div className="balance-cards">
                    {leaveTypes.map((type) => {
                        const balance = leaveBalance[type] || { total: 0, used: 0, pending: 0, available: 0 };

                        return (
                            <div className="balance-card" key={type}>
                                <div className="leave-type">{type.charAt(0).toUpperCase() + type.slice(1)} Leave</div>
                                <div className="balance-details">
                                    <span>Total: {balance.total}</span>
                                    <span>Used: {balance.used}</span>
                                    <span>Pending: {balance.pending}</span>
                                    <span>Available: {balance.available}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/*Leave Request Form*/}
            <div className="leave-request-form-section">
                <h3>Request Leave</h3>
                <form onSubmit={handleSubmit}>
                    {/* Start Date */}
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={leaveForm.startDate}
                        onChange={handleFormChange}
                        required
                    />

                    {/* End Date */}
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={leaveForm.endDate}
                        onChange={handleFormChange}
                        required
                    />

                    {/* Leave Type */}
                    <label htmlFor="leaveType">Leave Type:</label>
                    <select id="leaveType" name="leaveType" value={leaveForm.leaveType} onChange={handleFormChange}>
                        <option value="annual">Annual Leave</option>
                        <option value="sick">Sick Leave</option>
                        <option value="personal">Personal Leave</option>
                        <option value="maternity">Maternity Leave</option>
                        <option value="paternity">Paternity Leave</option>
                    </select>

                    {/* Reason for Leave */}
                    <label htmlFor="reason">Reason for Leave:</label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={leaveForm.reason}
                        onChange={handleFormChange}
                        required
                        placeholder="Briefly explain why you're requesting leave..."
                    ></textarea>

                    {/* Submit Button */}
                    <button type="submit">Submit Request</button>
                </form>
            </div>


            {/*Leave History*/}
            <div className="leave-history-section">
                <h3>Leave History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Days</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveHistory.map(leave => (
                            <tr key={leave._id}>
                                <td>{leave._id}</td>
                                <td>{leave.leaveType}</td>
                                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td>{leave.days}</td>
                                <td>{leave.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveRequests;
