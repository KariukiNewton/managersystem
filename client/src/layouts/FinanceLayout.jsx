import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from "../components/Footer";
import UserContext from "../context/UserContext";
import { FaMoneyBillWave, FaFileInvoice } from "react-icons/fa";
import { IoHome, IoSettings } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { TbReportSearch } from "react-icons/tb";
import "../styles/styles.scss";

const generateAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;

const FinanceLayout = () => {
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
        console.log("User in FinanceLayout:", user); // Debugging
        if (user === null) return; // Avoid unnecessary redirects
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    const navItems = [
        { name: "Home", path: "/finance/dashboard/home", icon: <IoHome /> },
        { name: "Payroll", path: "/finance/dashboard/payroll", icon: <FaMoneyBillWave /> },
        { name: "Employee Finance", path: "/finance/dashboard/employee-finances", icon: <GrUserWorker /> },
        { name: "Reports", path: "/finance/dashboard/reports", icon: <TbReportSearch /> },
        { name: "Settings", path: "/finance/dashboard/settings", icon: <IoSettings /> },
        { name: "Invoice", path: "/finance/dashboard/invoice", icon: <FaFileInvoice /> }
    ];

    return (
        <div className="finance-dashboard-container">
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

export default FinanceLayout;
