import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import UserContext from "../context/UserContext";
import "./_login.scss";
import logo from "../auth/assets/logo.png"; // Import the logo

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

            toast.success("Login successful!");

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
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img src={logo} alt="Company Logo" className="login-logo" />
                <h2>Login to Farmers Choice</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
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
        </div>
    );
};

export default Login;
