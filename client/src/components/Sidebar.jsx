import React, { useState } from "react";
import { FiUsers, FiDollarSign, FiBriefcase, FiCalendar, FiClock } from "react-icons/fi";
import "../styles/_admSidebar.scss";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [activeTab, setActiveTab] = useState("Users");

    return (
        <>
            <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
                <button className="close-btn" onClick={toggleSidebar}>
                    &times;
                </button>

                {/* Top Section: Company Logo */}
                <div className="sidebar-logo">
                    <h2>Farmer Choice</h2>
                </div>

                {/* Middle Section: User Profile */}
                <div className="sidebar-profile">
                    <img src="/assets/profile.jpg" alt="User Profile" />
                    <p>Admin Name</p>
                </div>

                {/* Bottom Section: Business Details */}
                <ul className="sidebar-menu">
                    {[
                        { name: "Users", icon: <FiUsers /> },
                        { name: "Finance", icon: <FiDollarSign /> },
                        { name: "Departments", icon: <FiBriefcase /> },
                        { name: "Attendance & Leaves", icon: <FiClock /> },
                        { name: "Business Calendar", icon: <FiCalendar /> },
                    ].map((item) => (
                        <li
                            key={item.name}
                            className={activeTab === item.name ? "active" : ""}
                            onClick={() => setActiveTab(item.name)}
                        >
                            {item.icon} {item.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Overlay for mobile closing */}
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
};

export default Sidebar;
