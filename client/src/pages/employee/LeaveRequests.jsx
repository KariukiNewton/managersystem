import React, { useState } from 'react';
import './_empLeaveRequests.scss';

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

    const [leaveBalance, setLeaveBalance] = useState({
        annual: { total: 20, used: 5, pending: 2, available: 13 },
        sick: { total: 12, used: 2, pending: 0, available: 10 },
        personal: { total: 5, used: 1, pending: 0, available: 4 },
        maternity: { total: 0, used: 0, pending: 0, available: 0 },
        paternity: { total: 0, used: 0, pending: 0, available: 0 }
    });

    // Mock leave history data
    const [leaveHistory, setLeaveHistory] = useState([
        {
            id: 'LR-2025-007',
            startDate: '2025-02-10',
            endDate: '2025-02-14',
            days: 5,
            type: 'annual',
            reason: 'Family vacation',
            status: 'approved',
            approvedBy: 'Jane Smith',
            approvedOn: '2025-01-15'
        },
        {
            id: 'LR-2025-012',
            startDate: '2025-03-05',
            endDate: '2025-03-06',
            days: 2,
            type: 'sick',
            reason: 'Medical appointment',
            status: 'approved',
            approvedBy: 'Jane Smith',
            approvedOn: '2025-03-04'
        },
        {
            id: 'LR-2025-018',
            startDate: '2025-04-15',
            endDate: '2025-04-16',
            days: 2,
            type: 'personal',
            reason: 'Personal matter',
            status: 'pending',
            approvedBy: null,
            approvedOn: null
        },
        {
            id: 'LR-2025-022',
            startDate: '2025-05-12',
            endDate: '2025-05-12',
            days: 1,
            type: 'annual',
            reason: 'Family event',
            status: 'pending',
            approvedBy: null,
            approvedOn: null
        }
    ]);

    const handleFormChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setLeaveForm(prev => ({ ...prev, [name]: files[0] }));
        } else if (type === 'checkbox') {
            setLeaveForm(prev => ({ ...prev, [name]: checked }));
        } else {
            setLeaveForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const calculateDays = () => {
        if (!leaveForm.startDate || !leaveForm.endDate) return 0;

        const start = new Date(leaveForm.startDate);
        const end = new Date(leaveForm.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (leaveForm.halfDay) {
            return diffDays - 0.5;
        }

        return diffDays;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // In a real app, this would be an API call to submit the leave request
        const newLeaveRequest = {
            id: `LR-2025-${Math.floor(Math.random() * 1000)}`,
            startDate: leaveForm.startDate,
            endDate: leaveForm.endDate,
            days: calculateDays(),
            type: leaveForm.leaveType,
            reason: leaveForm.reason,
            status: 'pending',
            approvedBy: null,
            approvedOn: null
        };

        setLeaveHistory(prev => [newLeaveRequest, ...prev]);

        // Update pending leave balance
        setLeaveBalance(prev => ({
            ...prev,
            [leaveForm.leaveType]: {
                ...prev[leaveForm.leaveType],
                pending: prev[leaveForm.leaveType].pending + calculateDays(),
                available: prev[leaveForm.leaveType].available - calculateDays()
            }
        }));

        // Reset form
        setLeaveForm({
            startDate: '',
            endDate: '',
            leaveType: 'annual',
            reason: '',
            attachment: null,
            contactInfo: '',
            halfDay: false,
            halfDayOption: 'first'
        });

        // Show success message (in a real app)
        alert('Leave request submitted successfully!');
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved': return 'status-approved';
            case 'pending': return 'status-pending';
            case 'rejected': return 'status-rejected';
            default: return '';
        }
    };

    return (
        <div className="leave-requests-page">
            <div className="leave-balance-section">
                <h3>Leave Balance</h3>
                <div className="balance-cards">
                    {Object.entries(leaveBalance).map(([type, balance]) => (
                        <div className="balance-card" key={type}>
                            <div className="leave-type">{type.charAt(0).toUpperCase() + type.slice(1)} Leave</div>
                            <div className="balance-details">
                                <div className="balance-item">
                                    <span className="value">{balance.total}</span>
                                    <span className="label">Total</span>
                                </div>
                                <div className="balance-item">
                                    <span className="value">{balance.used}</span>
                                    <span className="label">Used</span>
                                </div>
                                <div className="balance-item">
                                    <span className="value">{balance.pending}</span>
                                    <span className="label">Pending</span>
                                </div>
                                <div className="balance-item available">
                                    <span className="value">{balance.available}</span>
                                    <span className="label">Available</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="leave-request-form-section">
                <h3>Request Leave</h3>
                <form className="leave-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="leaveType">Leave Type</label>
                            <select
                                id="leaveType"
                                name="leaveType"
                                value={leaveForm.leaveType}
                                onChange={handleFormChange}
                                required
                            >
                                <option value="annual">Annual Leave</option>
                                <option value="sick">Sick Leave</option>
                                <option value="personal">Personal Leave</option>
                                <option value="maternity">Maternity Leave</option>
                                <option value="paternity">Paternity Leave</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="halfDay"
                                    checked={leaveForm.halfDay}
                                    onChange={handleFormChange}
                                />
                                Half Day
                            </label>
                            {leaveForm.halfDay && (
                                <select
                                    name="halfDayOption"
                                    value={leaveForm.halfDayOption}
                                    onChange={handleFormChange}
                                >
                                    <option value="first">First Half</option>
                                    <option value="second">Second Half</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={leaveForm.startDate}
                                onChange={handleFormChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={leaveForm.endDate}
                                onChange={handleFormChange}
                                required
                                min={leaveForm.startDate}
                            />
                        </div>

                        <div className="form-group">
                            <label>Duration</label>
                            <div className="duration-display">{calculateDays()} day(s)</div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reason">Reason for Leave</label>
                        <textarea
                            id="reason"
                            name="reason"
                            rows="3"
                            value={leaveForm.reason}
                            onChange={handleFormChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="contactInfo">Contact Information During Leave (Optional)</label>
                            <input
                                type="text"
                                id="contactInfo"
                                name="contactInfo"
                                value={leaveForm.contactInfo}
                                onChange={handleFormChange}
                                placeholder="Phone number or email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="attachment">Attachment (Optional)</label>
                            <input
                                type="file"
                                id="attachment"
                                name="attachment"
                                onChange={handleFormChange}
                                className="file-input"
                            />
                            <small>Attach medical certificate or other supporting documents if required</small>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Submit Request</button>
                        <button type="button" className="cancel-btn" onClick={() => {
                            setLeaveForm({
                                startDate: '',
                                endDate: '',
                                leaveType: 'annual',
                                reason: '',
                                attachment: null,
                                contactInfo: '',
                                halfDay: false,
                                halfDayOption: 'first'
                            });
                        }}>Cancel</button>
                    </div>
                </form>
            </div>

            <div className="leave-history-section">
                <h3>Leave History</h3>
                <div className="history-table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Type</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Days</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Approved By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveHistory.map(leave => (
                                <tr key={leave.id}>
                                    <td>{leave.id}</td>
                                    <td className="leave-type">{leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}</td>
                                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td>{leave.days}</td>
                                    <td>{leave.reason}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td>{leave.approvedBy || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequests;