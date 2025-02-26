import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import "./_userProfile.scss";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            console.error("User ID is missing in the URL.");
            navigate("/dashboard"); // Redirect if no user ID
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) throw new Error("User not found");
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate("/dashboard"); // Redirect if user not found
            }
        };

        fetchUserProfile();
    }, [userId, navigate]);

    if (!user) return <p>Loading profile...</p>;

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
