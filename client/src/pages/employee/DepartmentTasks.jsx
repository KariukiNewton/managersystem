import React, { useState } from "react";
import "./_empDepartmentTasks.scss";

const tasksData = [
    { id: 1, title: "Prepare Monthly Report", priority: "High", dueDate: "2025-03-20", status: "Pending", assignedTo: "Alice Johnson" },
    { id: 2, title: "Update Client Database", priority: "Medium", dueDate: "2025-03-25", status: "In Progress", assignedTo: "Mark Spencer" },
    { id: 3, title: "Conduct Team Meeting", priority: "Low", dueDate: "2025-03-18", status: "Completed", assignedTo: "Sophia Davis" },
];

const DepartmentTasks = () => {
    const [filter, setFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("asc");

    const filteredTasks = tasksData.filter(task =>
        filter === "All" || task.priority === filter || task.status === filter
    );

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        return sortOrder === "asc"
            ? new Date(a.dueDate) - new Date(b.dueDate)
            : new Date(b.dueDate) - new Date(a.dueDate);
    });

    return (
        <div className="tasks-container">
            <h2 className="title">Department Tasks</h2>
            <div className="controls">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">All Tasks</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                    Sort by Due Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
                </button>
            </div>
            <div className="task-list">
                {sortedTasks.map(task => (
                    <div key={task.id} className={`task-card ${task.priority.toLowerCase()}`}>
                        <h3>{task.title}</h3>
                        <p>Due: {task.dueDate}</p>
                        <p>Assigned To: {task.assignedTo}</p>
                        <span className={`status ${task.status.toLowerCase()}`}>{task.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DepartmentTasks;
