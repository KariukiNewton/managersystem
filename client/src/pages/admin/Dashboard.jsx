import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from "axios";
import {
    UsersIcon,
    DollarSignIcon,
    ClipboardListIcon,
    ClockIcon,
    TrendingUpIcon,
    ServerIcon,
    AlertTriangleIcon,
    MailIcon,
    CalendarIcon,
    ActivityIcon,
    DatabaseIcon
} from 'lucide-react';
import Users from './UserPage';
import Finance from './FinancePage';
import Departments from './DepartmentsPage';
import Attendance from './AttendancePage';
import Performance from './Performance';
import "./_admDashboard.scss";

const AdminDashboard = () => {
    return (
        <Routes>
            {/* Index route for the dashboard */}
            <Route index element={<DashboardHome />} />

            {/* Dashboard content routes */}
            <Route path="users" element={<Users />} />
            <Route path="finance" element={<Finance />} />
            <Route path="departments" element={<Departments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="performance" element={<Performance />} />
        </Routes>
    );
};

// Dashboard home component
const DashboardHome = () => {
    const navigate = useNavigate();
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        fetchTotalUsers();
    }, []);


    const fetchTotalUsers = async () => {
        try {
            const response = await axios.get("/users/total-users");
            setTotalUsers(response.data.totalUsers);
        } catch (error) {
            console.error("Error fetching total users:", error);
        }
    };
    // Sample data (would typically come from backend APIs)
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'warning', message: 'Inventory levels low in Agricultural Department', time: '2 hours ago' },
        { id: 2, type: 'info', message: 'New employee onboarding scheduled', time: '1 day ago' },
        { id: 3, type: 'alert', message: 'Finance report requires review', time: '3 hours ago' }
    ]);

    const summaryData = {
        totalDepartments: 5,
        pendingLeaveRequests: 3,
        activeProjects: 7,
        monthlyRevenue: 125750
    };

    const systemHealth = {
        serverStatus: 'Operational',
        databaseConnections: 98,
        cpuUsage: 45,
        memoryUsage: 60
    };

    const QuickStatCard = ({ icon: Icon, title, value, className = '' }) => (
        <div className={`dashboard-card ${className}`}>
            <div className="dashboard-card__header">
                <span className="dashboard-card__header-title">{title}</span>
                <Icon className="dashboard-card__header-icon" size={24} />
            </div>
            <div className="dashboard-card__content">{value}</div>
        </div>
    );

    const SystemHealthCard = () => (
        <div className="dashboard-card system-health-card">
            <div className="dashboard-card__header">
                <span className="dashboard-card__header-title flex items-center">
                    <ServerIcon className="mr-2 dashboard-card__header-icon" size={20} />
                    System Health
                </span>
            </div>
            <div className="system-health-content">
                <div className="health-stat">
                    <DatabaseIcon size={16} />
                    <span>Server Status: {systemHealth.serverStatus}</span>
                </div>
                <div className="health-stat">
                    <ActivityIcon size={16} />
                    <span>CPU Usage: {systemHealth.cpuUsage}%</span>
                </div>
                <div className="health-stat">
                    <MailIcon size={16} />
                    <span>Memory Usage: {systemHealth.memoryUsage}%</span>
                </div>
            </div>
        </div>
    );

    const NotificationsCard = () => (
        <div className="dashboard-card notifications-card">
            <div className="dashboard-card__header">
                <span className="dashboard-card__header-title flex items-center">
                    <AlertTriangleIcon className="mr-2 dashboard-card__header-icon" size={20} />
                    Notifications
                </span>
            </div>
            <ul className="notifications-list">
                {notifications.map(notification => (
                    <li key={notification.id} className={`notification notification-${notification.type}`}>
                        <div className="notification-content">
                            {notification.message}
                        </div>
                        <span className="notification-time">{notification.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    const QuickAccessCard = () => (
        <div className="dashboard-card quick-access-card">
            <div className="dashboard-card__header">
                <span className="dashboard-card__header-title flex items-center">
                    <CalendarIcon className="mr-2 dashboard-card__header-icon" size={20} />
                    Quick Access
                </span>
            </div>
            <div className="quick-access-content">
                <div className="quick-access-grid">
                    <a href="/admin/users" className="quick-access-item">
                        <UsersIcon size={20} />
                        <span>User Management</span>
                    </a>
                    <a href="/admin/finance" className="quick-access-item">
                        <DollarSignIcon size={20} />
                        <span>Financial Overview</span>
                    </a>
                    <a href="/admin/departments" className="quick-access-item">
                        <ClipboardListIcon size={20} />
                        <span>Department Stats</span>
                    </a>
                    <a href="/admin/attendance" className="quick-access-item">
                        <ClockIcon size={20} />
                        <span>Attendance Logs</span>
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <div className="dashboard-home">
            <h1 className="dashboard-home__title">Admin Dashboard Overview</h1>

            <div className="dashboard-home__stats-grid">
                {/* Existing Quick Stats */}
                <QuickStatCard
                    icon={UsersIcon}
                    title="Total Users"
                    value={totalUsers}
                />
                <QuickStatCard
                    icon={DollarSignIcon}
                    title="Monthly Revenue"
                    value={`Ksh.${summaryData.monthlyRevenue.toLocaleString()}`}
                />
                <QuickStatCard
                    icon={ClipboardListIcon}
                    title="Departments"
                    value={summaryData.totalDepartments}
                />

                {/* Recent Activity Card */}
                <div className="dashboard-card">
                    <div className="dashboard-card__header">
                        <span className="dashboard-card__header-title flex items-center">
                            <ClockIcon className="mr-2 dashboard-card__header-icon" size={20} />
                            Recent Activity
                        </span>
                    </div>
                    <ul className="recent-activity__list">
                        <li>
                            <span>Pending Leave Requests:</span> {summaryData.pendingLeaveRequests}
                        </li>
                        <li>
                            <span>Active Projects:</span> {summaryData.activeProjects}
                        </li>
                        <li>
                            <span>Performance Reviews:</span> Upcoming this quarter
                        </li>
                    </ul>
                </div>

                {/* Performance Insights Card */}
                <div className="dashboard-card">
                    <div className="dashboard-card__header">
                        <span className="dashboard-card__header-title flex items-center">
                            <TrendingUpIcon className="mr-2 dashboard-card__header-icon" size={20} />
                            Performance Insights
                        </span>
                    </div>
                    <div className="dashboard-card__content">
                        <p>Top Performing Department: Production and Processing</p>
                        <p>Employee of the Month: Frank MAtho</p>
                    </div>
                </div>

                {/* New System Health Card */}
                <SystemHealthCard />

                {/* New Notifications Card */}
                <NotificationsCard />

                {/* New Quick Access Card */}
                <QuickAccessCard />
            </div>

            <div className="quick-links">
                <p>Quick Links:</p>
                <div className="quick-links__links">
                    <button onClick={() => navigate("/admin/dashboard/users")}>
                        Manage Users
                    </button>
                    <button onClick={() => navigate("/admin/dashboard/finance")}>
                        Financial Reports
                    </button>
                    <button onClick={() => navigate("/admin/dashboard/departments")}>
                        Department Management
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;