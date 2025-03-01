import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import UserProfile from "./components/UserProfile";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";
import FinanceDashboard from "./pages/finance/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    {/* Default route directs to Login */}
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />

                    {/* Admin Routes with Layout */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" />} />
                        <Route path="dashboard/*" element={<AdminDashboard />} />
                        <Route path="profile/:userId" element={<UserProfile />} />
                        <Route path="profile" element={<UserProfile />} />
                    </Route>

                    {/* Other role-based dashboards */}
                    <Route path="/employee/dashboard/*" element={<EmployeeDashboard />} />
                    <Route path="/finance/dashboard/*" element={<FinanceDashboard />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;