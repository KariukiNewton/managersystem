import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./_sidebar.scss"; // Ensure styles are correctly applied

const Sidebar = ({ isOpen, toggleSidebar, navItems, user }) => {
    const [activeTab, setActiveTab] = useState(navItems[0]?.name || "");

    return (
        <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
            {/* Toggle Button */}

            <div className="sidebar-content">
                {isOpen && (
                    <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                        <FiChevronLeft />
                    </button>
                )}
                {/* Sidebar Logo */}
                <div className="sidebar-logo">
                    {isOpen && <h2>Farmers Choice</h2>}
                </div>

                {/* Sidebar Profile */}
                {isOpen && (
                    <div className="sidebar-profile">
                        <img src={user?.profilePic || "/assets/profile.jpg"} alt="User Profile" />
                        <p>{user?.name || "Admin"}</p>
                    </div>
                )}

                {/* Sidebar Menu */}
                <ul className="sidebar-menu">
                    {navItems.map((item) => (
                        <li
                            key={item.name}
                            className={activeTab === item.name ? "active" : ""}
                            onClick={() => setActiveTab(item.name)}
                            title={!isOpen ? item.name : ""}
                        >
                            <NavLink to={item.path} className="sidebar-link">
                                <span className="icon" aria-hidden="true">{item.icon}</span>
                                {isOpen && <span className="text">{item.name}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
