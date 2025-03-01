import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import "./_userProfile.scss";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                // If there's no userId, we're viewing our own profile
                const targetId = userId || "admin123";

                // Replace with your actual API call
                const response = await fetch(`/api/users/${targetId}`);
                if (!response.ok) {
                    // If API isn't ready, use mock data for development
                    console.warn("Using mock data for development");
                    setTimeout(() => {
                        const mockUser = {
                            id: targetId,
                            username: targetId === "admin123" ? "Admin User" : `User ${targetId}`,
                            email: `${targetId}@farmerschoice.com`,
                            role: targetId === "admin123" ? "Administrator" : "Employee",
                            department: "Management",
                            age: 35,
                            gender: "Male",
                            lastLogin: new Date().toISOString()
                        };
                        setUser(mockUser);
                        setLoading(false);
                    }, 500);
                    return;
                }

                const data = await response.json();
                setUser(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Use mock data on error for development
                const mockUser = {
                    id: userId || "admin123",
                    username: "Test User",
                    email: "test@example.com",
                    role: "Administrator",
                    department: "IT",
                    age: 30,
                    gender: "Other",
                    lastLogin: new Date().toISOString()
                };
                setUser(mockUser);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, navigate]);

    if (loading) return (
        <div className="user-profile-container">
            <div className="profile-card">
                <p>Loading profile...</p>
            </div>
        </div>
    );

    if (!user) return (
        <div className="user-profile-container">
            <div className="profile-card">
                <p>User not found</p>
                <button onClick={() => navigate("/admin/dashboard")}>Return to Dashboard</button>
            </div>
        </div>
    );

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
            </div>
        </div>
    );
};

export default UserProfile;