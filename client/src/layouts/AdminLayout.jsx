import React, { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from "../components/Footer";
import { FiUsers, FiDollarSign, FiBriefcase, FiClock, FiCalendar } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import UserContext from "../context/UserContext"; // Import UserContext
import "../styles/styles.scss";

const generateAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("User in AdminLayout:", user); // Debugging
        if (user === null) return; // Avoid unnecessary redirects
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    // Ensure user has a profile picture
    useEffect(() => {
        if (user && !user.profilePic) {
            setUser((prevUser) => ({
                ...prevUser,
                profilePic: generateAvatar(prevUser.name)
            }));
        }
    }, [user, setUser]);


    const navItems = [
        { name: "Home", path: "/admin/dashboard", icon: <IoHome /> },
        { name: "Users", path: "/admin/dashboard/users", icon: <FiUsers /> },
        { name: "Finance", path: "/admin/dashboard/finance", icon: <FiDollarSign /> },
        { name: "Departments", path: "/admin/dashboard/departments", icon: <FiBriefcase /> },
        { name: "Attendance & Leaves", path: "/admin/dashboard/attendance", icon: <FiClock /> },
        { name: "Performance", path: "/admin/dashboard/performance", icon: <FiCalendar /> }
    ];

    return (
        <div className="admin-dashboard-container">
            <Header
                userRole={user?.role} // Get role from context
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            />
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                navItems={navItems}
            />
            <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default AdminLayout;
