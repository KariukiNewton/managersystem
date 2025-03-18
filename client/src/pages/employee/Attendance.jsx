import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './_empAttendance.scss';

const AttendancePage = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [attendanceStatus, setAttendanceStatus] = useState('pending'); // pending, checked-in, checked-out
    const [checkinTime, setCheckinTime] = useState(null);
    const [checkoutTime, setCheckoutTime] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);





    // Mock attendance history data - would fetch from API in real application
    const [attendanceHistory, setAttendanceHistory] = useState([
        { date: '2025-03-13', checkin: '08:02:15', checkout: '17:05:32', status: 'present', hours: '9:03' },
        { date: '2025-03-12', checkin: '08:00:45', checkout: '17:15:22', status: 'present', hours: '9:15' },
        { date: '2025-03-11', checkin: '08:10:12', checkout: '17:30:41', status: 'present', hours: '9:20' },
        { date: '2025-03-10', checkin: '08:15:33', checkout: '17:00:12', status: 'present', hours: '8:45' },
        { date: '2025-03-07', checkin: '08:05:10', checkout: '17:10:05', status: 'present', hours: '9:05' },
        { date: '2025-03-06', checkin: null, checkout: null, status: 'absent', hours: '0:00' },
        { date: '2025-03-05', checkin: '08:29:45', checkout: '17:05:39', status: 'late', hours: '8:36' },
    ]);

    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const paginatedRecords = attendanceHistory.slice(firstIndex, lastIndex);

    // Mock weekly summary data
    const [weeklySummary, setWeeklySummary] = useState({
        totalHours: '36:28',
        regularHours: '35:00',
        overtimeHours: '1:28',
        lateArrivalCount: 1,
        earlyDepartureCount: 0,
        absenceCount: 1
    });

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Check if already checked in for today
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayRecord = attendanceHistory.find(record => record.date === today);

        if (todayRecord) {
            if (todayRecord.checkin && !todayRecord.checkout) {
                setAttendanceStatus('checked-in');
                setCheckinTime(todayRecord.checkin);
            } else if (todayRecord.checkin && todayRecord.checkout) {
                setAttendanceStatus('checked-out');
                setCheckinTime(todayRecord.checkin);
                setCheckoutTime(todayRecord.checkout);
            }
        }

        return () => {
            clearInterval(timer);
        };
    }, [attendanceHistory]);

    const handleCheckin = () => {
        const now = new Date();
        const timeString = format(now, 'HH:mm:ss');
        const dateString = format(now, 'yyyy-MM-dd');

        setCheckinTime(timeString);
        setAttendanceStatus('checked-in');

        // In a real app, this would be an API call to record the checkin
        const updatedHistory = [
            {
                date: dateString,
                checkin: timeString,
                checkout: null,
                status: now.getHours() >= 8 && now.getMinutes() > 30 ? 'late' : 'present',
                hours: '0:00'
            },
            ...attendanceHistory
        ];

        setAttendanceHistory(updatedHistory);
    };

    const handleCheckout = () => {
        const now = new Date();
        const timeString = format(now, 'HH:mm:ss');
        const dateString = format(now, 'yyyy-MM-dd');

        setCheckoutTime(timeString);
        setAttendanceStatus('checked-out');

        // In a real app, this would be an API call to record the checkout
        const updatedHistory = attendanceHistory.map(record => {
            if (record.date === dateString) {
                const checkinHours = parseInt(record.checkin.split(':')[0]);
                const checkinMinutes = parseInt(record.checkin.split(':')[1]);
                const checkoutHours = now.getHours();
                const checkoutMinutes = now.getMinutes();

                const totalMinutes = (checkoutHours * 60 + checkoutMinutes) - (checkinHours * 60 + checkinMinutes);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                return {
                    ...record,
                    checkout: timeString,
                    hours: `${hours}:${minutes < 10 ? '0' + minutes : minutes}`
                };
            }
            return record;
        });

        setAttendanceHistory(updatedHistory);
    };

    return (
        <div className="attendance-page">
            <div className="time-tracking-panel">
                <div className="current-time-display">
                    <div className="time">{format(currentDateTime, 'HH:mm:ss')}</div>
                    <div className="date">{format(currentDateTime, 'EEEE, MMMM dd, yyyy')}</div>
                </div>

                <div className="attendance-actions">
                    {attendanceStatus === 'pending' && (
                        <button className="checkin-btn" onClick={handleCheckin}>
                            Check In
                        </button>
                    )}

                    {attendanceStatus === 'checked-in' && (
                        <div className="status-container">
                            <div className="status">
                                <div className="status-label">Checked In</div>
                                <div className="status-time">{checkinTime}</div>
                            </div>
                            <button className="checkout-btn" onClick={handleCheckout}>
                                Check Out
                            </button>
                        </div>
                    )}

                    {attendanceStatus === 'checked-out' && (
                        <div className="status-container complete">
                            <div className="status">
                                <div className="status-label">Checked In</div>
                                <div className="status-time">{checkinTime}</div>
                            </div>
                            <div className="status">
                                <div className="status-label">Checked Out</div>
                                <div className="status-time">{checkoutTime}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="attendance-summary">
                <div className="section-header">
                    <h3>Weekly Summary</h3>
                    <select className="period-selector">
                        <option>This Week</option>
                        <option>Last Week</option>
                        <option>This Month</option>
                    </select>
                </div>

                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="summary-value">{weeklySummary.totalHours}</div>
                        <div className="summary-label">Total Hours</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-value">{weeklySummary.regularHours}</div>
                        <div className="summary-label">Regular Hours</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-value">{weeklySummary.overtimeHours}</div>
                        <div className="summary-label">Overtime</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-value">{weeklySummary.lateArrivalCount}</div>
                        <div className="summary-label">Late Arrivals</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-value">{weeklySummary.absenceCount}</div>
                        <div className="summary-label">Absences</div>
                    </div>
                </div>
            </div>

            <div className="attendance-history">
                <div className="section-header">
                    <h3>Attendance History</h3>
                    <input type="month" className="month-picker" defaultValue="2025-03" />
                </div>

                <div className="history-table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Status</th>
                                <th>Working Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceHistory.map((record, index) => (
                                <tr key={index} className={record.status}>
                                    <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                                    <td>{record.checkin || '-'}</td>
                                    <td>{record.checkout || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${record.status}`}>{record.status}</span>
                                    </td>
                                    <td>{record.hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                    <span className="pagination-info">Page 1 of 4</span>
                    <button disabled={lastIndex >= attendanceHistory.length} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>                </div>
            </div>
        </div>
    );
};

export default AttendancePage;