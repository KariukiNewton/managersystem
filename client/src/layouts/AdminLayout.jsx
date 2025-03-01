import React, { useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from "../components/Footer";
import { FiUsers, FiDollarSign, FiBriefcase, FiClock, FiCalendar } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import "../styles/styles.scss";

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { name: "Home", path: "/admin/dashboard", icon: <IoHome /> },
        { name: "Users", path: "/admin/dashboard/users", icon: <FiUsers /> },
        { name: "Finance", path: "/admin/dashboard/finance", icon: <FiDollarSign /> },
        { name: "Departments", path: "/admin/dashboard/departments", icon: <FiBriefcase /> },
        { name: "Attendance & Leaves", path: "/admin/dashboard/attendance", icon: <FiClock /> },
        { name: "Performance", path: "/admin/dashboard/performance", icon: <FiCalendar /> }
    ];

    const user = {
        id: "admin123",
        name: "Admin",
        profilePic: "/assets/profile.jpg",
        role: "admin"
    };

    return (
        <div className="admin-dashboard-container">
            <Header
                userRole="admin"
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
                <Outlet /> {/* This will render the child routes */}
            </main>
            <Footer user={user} />
        </div>
    );
};

export default AdminLayout;