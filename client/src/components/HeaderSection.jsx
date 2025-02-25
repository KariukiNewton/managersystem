import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiSettings, FiBell, FiMenu, FiSun, FiMoon } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";

const HeaderSection = ({ toggleSidebar, isSidebarOpen }) => {
    const [userDropdown, setUserDropdown] = useState(false);
    const [settingsDropdown, setSettingsDropdown] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const userDropdownRef = useRef(null);
    const settingsDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setUserDropdown(false);
            }
            if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
                setSettingsDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        console.log("Logging out...");
        navigate("/login");
    };

    return (
        <header className={`header-section ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <div className="header-left">
                <h1 className="dashboard-title">Admin Dashboard</h1>
            </div>

            <div className="search-bar">
                <input type="text" placeholder="Search..." aria-label="Search" />
            </div>

            <div className="header-right">
                <div className="icon-wrapper">
                    <button className="icon-btn" aria-label="Notifications">
                        <FiBell size={22} />
                        {notifications > 0 && <span className="notification-badge">{notifications}</span>}
                    </button>
                </div>

                <div className="dropdown-container" ref={settingsDropdownRef}>
                    <button
                        className="icon-btn"
                        onClick={() => setSettingsDropdown(!settingsDropdown)}
                        aria-label="Settings"
                    >
                        <FiSettings size={22} />
                    </button>
                    {settingsDropdown && (
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={toggleTheme}>
                                {theme === "light" ? <FiMoon /> : <FiSun />} Toggle Theme
                            </button>
                        </div>
                    )}
                </div>

                <div className="dropdown-container" ref={userDropdownRef}>
                    <button
                        className="icon-btn"
                        onClick={() => setUserDropdown(!userDropdown)}
                        aria-label="User Profile"
                    >
                        <FiUser size={24} />
                    </button>
                    {userDropdown && (
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => navigate("/userProfile")}>
                                <FiUser /> View Profile
                            </button>
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                <FiLogOut /> Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderSection;