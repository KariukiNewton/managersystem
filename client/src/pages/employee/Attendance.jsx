import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import './_empAttendance.scss';
import { MdToken } from 'react-icons/md';

const AttendancePage = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [attendanceStatus, setAttendanceStatus] = useState('pending');
    const [checkinTime, setCheckinTime] = useState(null);
    const [checkoutTime, setCheckoutTime] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [weeklySummary, setWeeklySummary] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const token = localStorage.getItem('token');
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const paginatedRecords = attendanceHistory.slice(firstIndex, lastIndex);

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
        fetchAttendanceData();
        fetchWeeklySummary();
        return () => clearInterval(timer);
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/attendance/history', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAttendanceHistory(response.data.history);
            checkTodayStatus(response.data.history);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    const fetchWeeklySummary = async () => {
        try {
            const response = await axios.get('/attendance/weekly-summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWeeklySummary(response.data);
        } catch (error) {
            console.error('Error fetching weekly summary:', error);
        }
    };

    const checkTodayStatus = (history) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayRecord = history.find(record => record.date === today);

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
    };

    const handleCheckin = async () => {
        try {
            const now = new Date();
            const timeString = format(now, 'HH:mm:ss');
            await axios.post('/attendance/checkin',
                { time: timeString },
                { headers: { Authorization: `Bearer ${token}` } }

            );
            fetchAttendanceData();
            fetchWeeklySummary();
        } catch (error) {
            console.error('Error checking in:', error);
        }
    };

    const handleCheckout = async () => {
        try {
            const now = new Date();
            const timeString = format(now, 'HH:mm:ss');

            const response = await axios.post('/attendance/checkout',
                { time: timeString },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.attendance) {
                const updatedAttendance = response.data.attendance;

                setAttendanceHistory(prevHistory =>
                    prevHistory.map(record =>
                        record.date === updatedAttendance.date
                            ? { ...record, checkout: updatedAttendance.checkout, hours: updatedAttendance.hoursWorked }
                            : record
                    )
                );
            }

            fetchAttendanceData();
            fetchWeeklySummary();
        } catch (error) {
            console.error('Error checking out:', error);
        }
    };

    return (
        <div className="attendance-page">
            <div className="time-tracking-panel">
                <div className="current-time-display">
                    <div className="time">{format(currentDateTime, 'HH:mm:ss')}</div>
                    <div className="date">{format(currentDateTime, 'EEEE, MMMM dd, yyyy')}</div>
                </div>
                <div className="attendance-actions">
                    {attendanceStatus === 'pending' && <button onClick={handleCheckin}>Check In</button>}
                    {attendanceStatus === 'checked-in' && <button onClick={handleCheckout}>Check Out</button>}
                </div>
            </div>
            <div className="attendance-summary">
                <h3>Weekly Summary</h3>
                <div className="summary-cards">
                    <div className="summary-card"><span>Total Hours:</span> {weeklySummary.totalWeekHours}</div>
                    <div className="summary-card"><span>Regular Hours:</span> {weeklySummary.regularHours}</div>
                    <div className="summary-card"><span>Overtime:</span> {weeklySummary.overtimeHours}</div>
                    <div className="summary-card"><span>Late Arrivals:</span> {weeklySummary.lateCount}</div>
                    <div className="summary-card"><span>Absences:</span> {weeklySummary.absenceCount}</div>
                </div>
            </div>
            <div className="attendance-history">
                <h3>Attendance History</h3>
                <table>
                    <thead>
                        <tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Hours</th></tr>
                    </thead>
                    <tbody>
                        {paginatedRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.date}</td>
                                <td>{record.checkin || '-'}</td>
                                <td>{record.checkout || '-'}</td>
                                <td>{record.status}</td>
                                <td>{record.hours}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                    <span>Page {currentPage}</span>
                    <button disabled={lastIndex >= attendanceHistory.length} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;



















