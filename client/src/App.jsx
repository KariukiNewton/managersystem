import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import UserProfile from "./components/UserProfile";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";

import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeLayout from "./layouts/EmployeeLAyout";

import FinanceLayout from "./layouts/FinanceLayout";
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

                    {/* Employee Routes with Layout */}
                    <Route path="/employee" element={<EmployeeLayout />}>
                        <Route index element={<Navigate to="/employee/dashboard" />} />
                        <Route path="dashboard/*" element={<EmployeeDashboard />} />
                        <Route path="profile/:userId" element={<UserProfile />} />
                        <Route path="profile" element={<UserProfile />} />
                    </Route>

                    {/* Finance Routes with Layout */}
                    <Route path="/finance" element={<FinanceLayout />}>
                        <Route index element={<Navigate to="/finance/dashboard/home" />} />
                        <Route path="dashboard/*" element={<FinanceDashboard />} />
                        <Route path="profile/:userId" element={<UserProfile />} />
                        <Route path="profile" element={<UserProfile />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;