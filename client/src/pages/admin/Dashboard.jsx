import React from "react";
import { Routes, Route } from 'react-router-dom';
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
    return (
        <div className="dashboard-home">
            <h1>Welcome to Admin Dashboard</h1>
            <p>Select a menu item from the sidebar to get started.</p>
            {/* Dashboard content goes here */}
        </div>
    );
};

export default AdminDashboard;