import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import UserContext from "../context/UserContext"; // Import UserContext
import "./_userProfile.scss";

const UserProfile = () => {
    const { user } = useContext(UserContext); // Access user from context
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="user-profile-container">
                <div className="profile-card">
                    <p>User not found</p>
                    <button onClick={() => navigate("/")}>Return Home</button>
                </div>
            </div>
        );
    }

    // Function to handle dashboard navigation based on role
    const handleDashboardRedirect = () => {
        switch (user.role) {
            case "admin":
                navigate("/admin/dashboard");
                break;
            case "finance":
                navigate("/finance/dashboard");
                break;
            case "employee":
                navigate("/employee/dashboard");
                break;
            default:
                navigate("/");
        }
    };

    return (
        <div className="user-profile-container">
            <div className="profile-card">
                <FiUser className="profile-icon" />
                <h2>{user.username}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                {user.department && <p><strong>Department:</strong> {user.department}</p>}
                <p><strong>Age:</strong> {user.age}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</p>

                {/* Only navigate when user clicks the button */}
                <button onClick={handleDashboardRedirect}>Return to Dashboard</button>
            </div>
        </div>
    );
};

export default UserProfile;
