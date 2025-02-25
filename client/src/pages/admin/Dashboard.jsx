import React, { useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import HeaderSection from "../../components/HeaderSection";
import Sidebar from "../../components/Sidebar";
import "../../styles/styles.scss";

import Users from './UserPage';
import Finance from './FinancePage';
import Departments from './DepartmentsPage';
import Attendance from './AttendancePage';
import Performance from './Performance';

const AdminDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    const menuItems = [
        { name: "Users", path: "/admin/dashboard/users", icon: "FiUsers" },
        { name: "Finance", path: "/admin/dashboard/finance", icon: "FiDollarSign" },
        { name: "Departments", path: "/admin/dashboard/departments", icon: "FiBriefcase" },
        { name: "Attendance & Leaves", path: "/admin/dashboard/attendance", icon: "FiClock" },
        { name: "Performance", path: "/admin/dashboard/performance", icon: "FiCalendar" }
    ];

    return (
        <div className="admin-dashboard-container">
            <HeaderSection toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                menuItems={menuItems}
                onNavigate={handleNavigate} />
            <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
                <Routes>
                    <Route path="" element={<DashboardHome />} />
                    <Route path="users" element={<Users />} />
                    <Route path="finance" element={<Finance />} />
                    <Route path="departments" element={<Departments />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="performance" element={<Performance />} />
                </Routes>
            </main>
        </div>
    );
};

const DashboardHome = () => {
    return (
        <div className="dashboard-home">
            <h1>Welcome to Admin Dashboard</h1>
            <p>Select a menu item from the sidebar to get started.</p>
        </div>
    );
};

export default AdminDashboard;
