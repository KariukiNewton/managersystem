import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
//const { setUser } = useContext(UserContext);
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toastify


const Login = () => {
    const [formData, setFormData] = useState({
        userId: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/auth/login", formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            //setUser(response.data.user);

            toast.success("Login successful!"); // Success notification

            // Redirect based on role
            switch (response.data.user.role) {
                case "admin":
                    navigate("/admin/dashboard");
                    window.location.reload();
                    break;
                case "finance":
                    navigate("/finance/dashboard");
                    window.location.reload();
                    break;
                case "employee":
                    navigate("/employee/dashboard");
                    window.location.reload();
                    break;
                default:
                    navigate("/login");
                    window.location.reload();
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
            toast.error(error.response?.data?.message || "Login failed"); // Error notification
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="userId">User ID</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
