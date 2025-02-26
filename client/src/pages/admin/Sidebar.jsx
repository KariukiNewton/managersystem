{/*
        import React, { useState } from "react";
    import { Link } from "react-router-dom";
    import { FiUsers, FiDollarSign, FiBriefcase, FiCalendar, FiClock, FiChevronRight, FiChevronLeft } from "react-icons/fi";

    const Sidebar = ({ isOpen, toggleSidebar }) => {
        const [activeTab, setActiveTab] = useState("Users");

        return (
            <div className={`sidebar ${isOpen ? "open" : "closed"}`}>

                <div className="sidebar-content">
                    {/* Top Section: Company Logo */}
<div className="sidebar-logo">
    {isOpen && <h2>Farmer Choice</h2>}
    {isOpen && (
        <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
    )}
</div>

{/* Middle Section: User Profile */ }
{
    isOpen && (
        <div className="sidebar-profile">
            <img src="/assets/profile.jpg" alt="User Profile" />
            <p>Admin Name</p>
        </div>
    )
}

{/* Bottom Section: Business Details */ }
<ul className="sidebar-menu">
    {[
        { name: "Users", icon: <FiUsers />, path: "/admin/dashboard/users" },
        { name: "Finance", icon: <FiDollarSign />, path: "/admin/dashboard/finance" },
        { name: "Departments", icon: <FiBriefcase />, path: "/admin/dashboard/departments" },
        { name: "Attendance & Leaves", icon: <FiClock />, path: "/admin/dashboard/attendance" },
        { name: "Performance", icon: <FiCalendar />, path: "/admin/dashboard/performance" },
    ].map((item) => (
        <li
            key={item.name}
            className={activeTab === item.name ? "active" : ""}
            onClick={() => setActiveTab(item.name)}
            title={!isOpen ? item.name : ""}
        >
            <Link to={item.path} className="sidebar-link">
                <span className="icon" aria-hidden="true">{item.icon}</span>
                {isOpen && <span className="text">{item.name}</span>}
            </Link>
        </li>
    ))}
</ul>
                </div >
            </div >
        );
    };

export default Sidebar;

*/}