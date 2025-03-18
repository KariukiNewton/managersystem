import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import UserContext from "../context/UserContext"; // Import UserContext
import "./_footer.scss";

const Footer = () => {
    const location = useLocation();
    const { user } = useContext(UserContext); // Get user from context

    // Extract module name from the path (e.g., "finance" from "/admin/dashboard/finance")
    const moduleName = location.pathname.split("/").pop();

    return (
        <footer className="footer">
            {/* Left Section: Company Info */}
            <div className="footer__section">
                <p>© {new Date().getFullYear()} Farmers Choice Ltd.</p>
                <p>All rights reserved.</p>
            </div>

            {/* Center Section: Display User Role & Module */}
            <div className="footer__section">
                {user ? (
                    <p>
                        Logged in as: <strong>{user.name} ({user.role})</strong>
                        {moduleName && moduleName !== "dashboard" && ` | ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`}
                    </p>
                ) : (
                    <p>Welcome to Farmers Choice Management System</p>
                )}
            </div>

            {/* Right Section: Useful Links */}
            <div className="footer__section">
                <a href="/help">Help</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms & Conditions</a>
            </div>
        </footer>
    );
};

export default Footer;
