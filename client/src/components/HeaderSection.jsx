import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiSettings, FiBell, FiMenu, FiSun, FiMoon } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext"; // Theme Context
import '../styles/_admHeaderSection.scss';


const HeaderSection = ({ toggleSidebar }) => {
    const [userDropdown, setUserDropdown] = useState(false);
    const [settingsDropdown, setSettingsDropdown] = useState(false);
    const [notifications, setNotifications] = useState(3); // Example notification count
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    // References for dropdowns
    const userDropdownRef = useRef(null);
    const settingsDropdownRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                userDropdownRef.current && !userDropdownRef.current.contains(event.target)
            ) {
                setUserDropdown(false);
            }
            if (
                settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)
            ) {
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
        <header className="header-section">
            <div className="header-left">
                <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                    <FiMenu size={24} />
                </button>
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
                    <button className="icon-btn" onClick={() => setSettingsDropdown(!settingsDropdown)} aria-label="Settings">
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
                    <button className="icon-btn" onClick={() => setUserDropdown(!userDropdown)} aria-label="User Profile">
                        <FiUser size={24} />
                    </button>
                    {userDropdown && (
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => navigate("/userProfile")}>
                                View Profile
                            </button>
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderSection;
