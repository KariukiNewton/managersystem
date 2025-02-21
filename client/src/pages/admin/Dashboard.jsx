import React, { useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import Sidebar from "../../components/Sidebar";
import "../../styles/styles.scss";

const AdminDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-dashboard">
            <HeaderSection toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
                <p>Welcome to the Admin Dashboard</p>
            </main>
        </div>
    );
};

export default AdminDashboard;
