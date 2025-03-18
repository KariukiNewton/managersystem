import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./_empAnnouncements.scss";

const announcementsData = [
    {
        id: 1,
        title: "Upcoming Maintenance",
        category: "IT",
        date: "2025-03-15",
        important: true,
        content: "Scheduled server maintenance will take place on March 20th.",
    },
    {
        id: 2,
        title: "New HR Policies",
        category: "HR",
        date: "2025-03-10",
        important: false,
        content: "Updated leave policies have been published. Please review.",
    },
    {
        id: 3,
        title: "Quarterly Earnings Report",
        category: "Finance",
        date: "2025-03-05",
        important: true,
        content: "Company earnings report for Q1 has been released.",
    },
];

const Announcements = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [readAnnouncements, setReadAnnouncements] = useState([]);

    useEffect(() => {
        const savedRead = JSON.parse(localStorage.getItem("readAnnouncements")) || [];
        setReadAnnouncements(savedRead);
    }, []);

    const handleMarkAsRead = (id) => {
        const updatedRead = [...readAnnouncements, id];
        setReadAnnouncements(updatedRead);
        localStorage.setItem("readAnnouncements", JSON.stringify(updatedRead));
    };

    const handleMarkAsUnread = (id) => {
        const updatedRead = readAnnouncements.filter((readId) => readId !== id);
        setReadAnnouncements(updatedRead);
        localStorage.setItem("readAnnouncements", JSON.stringify(updatedRead));
    };

    const filteredAnnouncements = announcementsData.filter((announcement) => {
        return (
            (filter === "All" || announcement.category === filter) &&
            announcement.title.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="announcements-container">
            <h2 className="title">Company Announcements</h2>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search announcements..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                </select>
            </div>
            <div className="announcement-list">
                {filteredAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="announcement-card">
                        <div className="announcement-header">
                            <h3 className="announcement-title">{announcement.title}</h3>
                            {announcement.important && (
                                <span className="badge important">
                                    <FaExclamationCircle className="icon" /> Important
                                </span>
                            )}
                        </div>
                        <p className="announcement-date">{announcement.date}</p>
                        <p className="announcement-content">{announcement.content}</p>
                        <div className="announcement-actions">
                            {readAnnouncements.includes(announcement.id) ? (
                                <button className="mark-unread" onClick={() => handleMarkAsUnread(announcement.id)}>
                                    <FaCheckCircle className="icon" /> Mark as Unread
                                </button>
                            ) : (
                                <button className="mark-read" onClick={() => handleMarkAsRead(announcement.id)}>
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;
