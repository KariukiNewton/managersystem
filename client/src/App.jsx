import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";
import FinanceDashboard from "./pages/finance/Dashboard";
import { } from "./context/ThemeContext";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default route directs to Login */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/finance/dashboard" element={<FinanceDashboard />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
