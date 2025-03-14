import React, { useState } from "react";
import { Routes, Route, useNavigate, Outlet, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from "../../components/Footer";
import UserProfile from '../../components/UserProfile';
import "../../styles/styles.scss";

import { IoHome } from "react-icons/io5";
import { FcLeave } from "react-icons/fc";
import { FaMoneyBillWave } from "react-icons/fa";
import { FcDepartment } from "react-icons/fc";
import { CgPerformance } from "react-icons/cg";
import { MdAnnouncement } from "react-icons/md";

import LeaveRequest from "./LeaveRequests";
import FinanceDetails from "./FinanceDetails";
import DepartmentTasks from "./DepartmentTasks";
import PerformancePage from "./PerformancePage";
import Announcements from "./Announcements";

const EmployeeDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const user = {
        id: "FinTech101",
        name: "Employee",
        profilePic: "",
        role: "employee"
    };

    const navItems = [
        { name: "Home", path: "/employee/dashboard/home", icon: <IoHome /> },
        { name: "Leave Requests", path: "/employee/dashboard/leave-request", icon: <FcLeave /> },
        { name: "Finance Details", path: "/employee/dashboard/finance-details", icon: <FaMoneyBillWave /> },
        { name: "Department Tasks", path: "/employee/dashboard/department-tasks", icon: <FcDepartment /> },
        { name: "Performance", path: "/employee/dashboard/performance", icon: <CgPerformance /> },
        { name: "Announcements", path: "/employee/dashboard/announcements", icon: <MdAnnouncement /> }
    ];

    return (
        <div className="employee-dashboard-container">
            <Header
                userRole={"employee"}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                user={user}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                navItems={navItems}
                user={user}
            />

            <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
                <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="leave-request" element={<LeaveRequest />} />
                    <Route path="finance-details" element={<FinanceDetails />} />
                    <Route path="department-tasks" element={<DepartmentTasks />} />
                    <Route path="performance" element={<PerformancePage />} />
                    <Route path="announcements" element={<Announcements />} />

                </Routes>
            </main>

            <Footer user={user} />

        </div>
    );
};

const DashboardHome = () => {
    // Mock data - would be fetched from API in production
    const [userData, setUserData] = useState({
        name: 'John Doe',
        position: 'Senior Developer',
        department: 'IT Department',
        employeeId: 'EMP-2023-001',
        avatar: '/assets/profile.jpg'
    });

    const [stats, setStats] = useState({
        attendance: { present: 18, absent: 2, late: 1 },
        tasks: { completed: 12, pending: 3, overdue: 1 },
        leave: { used: 5, remaining: 15 }
    });

    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Company Picnic',
            date: '2025-03-30',
            content: 'Annual company picnic scheduled for the end of the month.',
            priority: 'normal'
        },
        {
            id: 2,
            title: 'System Maintenance',
            date: '2025-03-20',
            content: 'IT systems will be offline from 10 PM to 2 AM for scheduled maintenance.',
            priority: 'high'
        }
    ]);

    // Sample events for calendar
    const calendarEvents = [
        { id: 1, title: 'Team Meeting', date: '2025-03-15', type: 'meeting' },
        { id: 2, title: 'Project Deadline', date: '2025-03-25', type: 'deadline' },
        { id: 3, title: 'Company Picnic', date: '2025-03-30', type: 'event' }
    ];

    // Get current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="employee-dashboard">
            <div className="welcome-section">
                <div className="greeting">
                    <h1>Welcome back, {userData.name}</h1>
                    <p className="date">{currentDate}</p>
                    <p className="employee-info">{userData.position} | {userData.department} | ID: {userData.employeeId}</p>
                </div>
                <div className="profile-summary">
                    <UserProfile user={userData} />
                </div>
            </div>

            <div className="quick-stats">
                <div className="stat-card attendance">
                    <h3>Attendance Summary</h3>
                    <div className="stat-content">
                        <div className="stat-item">
                            <span className="stat-value">{stats.attendance.present}</span>
                            <span className="stat-label">Present</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.attendance.absent}</span>
                            <span className="stat-label">Absent</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.attendance.late}</span>
                            <span className="stat-label">Late</span>
                        </div>
                    </div>
                    <Link to="/employee/attendance" className="view-more">View Details</Link>
                </div>

                <div className="stat-card tasks">
                    <h3>Task Status</h3>
                    <div className="stat-content">
                        <div className="stat-item">
                            <span className="stat-value">{stats.tasks.completed}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.tasks.pending}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.tasks.overdue}</span>
                            <span className="stat-label">Overdue</span>
                        </div>
                    </div>
                    <Link to="/employee/tasks" className="view-more">View All Tasks</Link>
                </div>

                <div className="stat-card leave">
                    <h3>Leave Balance</h3>
                    <div className="stat-content">
                        <div className="stat-item">
                            <span className="stat-value">{stats.leave.used}</span>
                            <span className="stat-label">Used</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.leave.remaining}</span>
                            <span className="stat-label">Remaining</span>
                        </div>
                    </div>
                    <Link to="/employee/leave" className="view-more">Request Leave</Link>
                </div>
            </div>

            <div className="dashboard-widgets">
                <div className="widget announcements">
                    <div className="widget-header">
                        <h3>Recent Announcements</h3>
                        <Link to="/employee/announcements" className="view-all">View All</Link>
                    </div>
                    <div className="announcement-list">
                        {announcements.map(announcement => (
                            <div key={announcement.id} className={`announcement-item ${announcement.priority}`}>
                                <div className="announcement-header">
                                    <h4>{announcement.title}</h4>
                                    <span className="date">{new Date(announcement.date).toLocaleDateString()}</span>
                                </div>
                                <p>{announcement.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="widget upcoming-events">
                    <div className="widget-header">
                        <h3>Upcoming Events</h3>
                        <Link to="/employee/calendar" className="view-all">Full Calendar</Link>
                    </div>
                    <div className="events-list">
                        {calendarEvents.map(event => (
                            <div key={event.id} className={`event-item ${event.type}`}>
                                <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
                                <span className="event-title">{event.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <Link to="/employee/attendance" className="action-button">
                        Check In/Out
                    </Link>
                    <Link to="/employee/leave" className="action-button">
                        Request Leave
                    </Link>
                    <Link to="/employee/finance" className="action-button">
                        View Pay Slip
                    </Link>
                    <Link to="/employee/tasks" className="action-button">
                        Update Task
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default EmployeeDashboard;
