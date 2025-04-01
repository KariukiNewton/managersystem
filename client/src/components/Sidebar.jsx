import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import UserContext from "../context/UserContext"; // Import UserContext
import "./_sidebar.scss";

const generateAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;

const Sidebar = ({ isOpen, toggleSidebar, navItems }) => {
    const [activeTab, setActiveTab] = useState(navItems[0]?.name || "");
    const { user, setUser } = useContext(UserContext);

    // Ensure user has a profile picture
    useEffect(() => {
        if (user && !user.profilePic) {
            setUser((prevUser) => ({
                ...prevUser,
                profilePic: generateAvatar(prevUser?.username || "User")
            }));
        }
    }, [user, setUser]);

    return (
        <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
            {/* Toggle Button */}
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
            {isOpen && user && (
                <div className="sidebar-profile">
                    <img src={user.profilePic} alt="User Profile" />
                    <p>{user.name || "Admin"}</p>
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
        </aside>
    );
};

export default Sidebar;
