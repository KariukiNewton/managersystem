import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiSettings, FiBell, FiSun, FiMoon, FiChevronLeft } from "react-icons/fi";
import { CgDetailsMore } from "react-icons/cg";
import { ThemeContext } from "../context/ThemeContext";
import UserContext from "../context/UserContext";
import "./_header.scss";

const Header = ({ userRole, isSidebarOpen, toggleSidebar }) => {
    const [userDropdown, setUserDropdown] = useState(false);
    const [settingsDropdown, setSettingsDropdown] = useState(false);
    const [notifications, setNotifications] = useState(3);

    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, setUser } = useContext(UserContext);
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
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getDashboardTitle = () => {
        switch (userRole) {
            case "admin":
                return "Admin Dashboard";
            case "finance":
                return "Finance Dashboard";
            case "employee":
                return "Employee Portal";
            default:
                return "Dashboard";
        }
    };

    const roleRoutes = {
        admin: "admin",
        finance: "finance",
        employee: "employee"
    };

    const handleViewProfile = () => {
        const rolePath = roleRoutes[user?.role] || "employee"; // Default to employee
        if (user?.id) {
            navigate(`/${rolePath}/profile/${user.id}`);
        } else {
            navigate(`/${rolePath}/profile`);
        }
        setUserDropdown(false);
    };

    return (
        <header className={`header ${isSidebarOpen ? "shifted" : ""}`}>
            <div className="header-left">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isSidebarOpen ? <FiChevronLeft /> : <CgDetailsMore />}
                </button>
                <h1 className="dashboard-title">{getDashboardTitle()}</h1>
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
                            <button className="dropdown-item" onClick={handleViewProfile}>
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

export default Header;
