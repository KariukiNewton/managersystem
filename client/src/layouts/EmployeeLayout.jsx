import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from "../components/Footer";
import UserContext from "../context/UserContext";
import { IoHome } from "react-icons/io5";
import { FcLeave, FcDepartment } from "react-icons/fc";
import { FaMoneyBillWave } from "react-icons/fa";
import { CgPerformance } from "react-icons/cg";
import { MdAnnouncement } from "react-icons/md";
import "../styles/styles.scss";

const generateAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;

const EmployeeLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !user.profilePic) {
            setUser((prevUser) => ({
                ...prevUser,
                profilePic: generateAvatar(prevUser.name)
            }));
        }
    }, [user, setUser]);

    useEffect(() => {
        console.log("User in EmployeeLayout:", user); // Debugging
        const token = localStorage.getItem("token");
        console.log("User in EmployeeLayout User Token:", token);
        if (user === undefined) return; // Avoid unnecessary redirects
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    const navItems = [
        { name: "Home", path: "/employee/dashboard/home", icon: <IoHome /> },
        { name: "Attendance", path: "/employee/dashboard/attendance", icon: <CgPerformance /> },
        { name: "Leave Requests", path: "/employee/dashboard/leave-request", icon: <FcLeave /> },
        { name: "Finance Details", path: "/employee/dashboard/finance-details", icon: <FaMoneyBillWave /> },
        { name: "Department Tasks", path: "/employee/dashboard/department-tasks", icon: <FcDepartment /> },
        { name: "Announcements", path: "/employee/dashboard/announcements", icon: <MdAnnouncement /> }
    ];

    return (
        <div className="employee-dashboard-container">
            <Header
                userRole={user?.role}
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

export default EmployeeLayout;
