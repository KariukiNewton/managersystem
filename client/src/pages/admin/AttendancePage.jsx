import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tag, Space, Button, Modal, Form, Input, DatePicker, Select, message, Popconfirm } from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./_admAttendancePage.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

const Attendance = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        fetchLeaveRequests();
    }, [pagination.current, pagination.pageSize, searchText, selectedStatus, selectedDateRange]);

    const fetchLeaveRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("/leaves/admin", {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: pagination.current,
                    limit: pagination.pageSize,
                    search: searchText,
                    status: selectedStatus !== "all" ? selectedStatus : undefined,
                    startDate: selectedDateRange[0]?.toISOString(),
                    endDate: selectedDateRange[1]?.toISOString()
                }
            });
            setLeaveRequests(data.requests);
            setPagination({
                ...pagination,
                total: data.total
            });
        } catch (error) {
            message.error("Failed to fetch leave requests");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`/leaves/${requestId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success("Leave request approved");
            fetchLeaveRequests();
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to approve request");
        }
    };

    const handleReject = async () => {
        if (!rejectionReason) {
            message.warning("Please provide a rejection reason");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put(`/leaves/${selectedRequest._id}/reject`, {
                reason: rejectionReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success("Leave request rejected");
            setIsModalVisible(false);
            setRejectionReason("");
            fetchLeaveRequests();
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to reject request");
        }
    };

    const showRejectModal = (record) => {
        setSelectedRequest(record);
        setIsModalVisible(true);
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const columns = [
        {
            title: "User ID",
            dataIndex: ["user", "_id"],
            key: "userId",
        },
        {
            title: "Email",
            dataIndex: ["user", "email"],
            key: "email"
        },
        {
            title: "Leave Type",
            dataIndex: "leaveType",
            key: "leaveType",
            render: (text) => (
                <Tag color={
                    text === "annual" ? "blue" :
                        text === "sick" ? "orange" :
                            text === "personal" ? "green" :
                                text === "maternity" ? "pink" : "cyan"
                }>
                    {text.toUpperCase()}
                </Tag>
            )
        },
        {
            title: "Dates",
            dataIndex: "dates",
            key: "dates",
            render: (_, record) => (
                <>
                    {dayjs(record.startDate).format("DD/MM/YYYY")} - {dayjs(record.endDate).format("DD/MM/YYYY")}
                    {record.halfDay && (
                        <Tag style={{ marginLeft: 8 }}>
                            {record.halfDayOption === "first" ? "Morning" : "Afternoon"}
                        </Tag>
                    )}
                </>
            )
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (_, record) => {
                const days = dayjs(record.endDate).diff(dayjs(record.startDate), "day") + 1;
                return `${days} day${days > 1 ? "s" : ""}`;
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={
                    status === "approved" ? "green" :
                        status === "rejected" ? "red" : "orange"
                }>
                    {status.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: "Pending", value: "pending" },
                { text: "Approved", value: "approved" },
                { text: "Rejected", value: "rejected" }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: "Submitted On",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm")
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    {record.status === "pending" && (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => handleApprove(record._id)}
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                size="small"
                                onClick={() => showRejectModal(record)}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    <Button
                        type="link"
                        size="small"
                        onClick={() => viewDetails(record)}
                    >
                        Details
                    </Button>
                </Space>
            )
        }
    ];

    const viewDetails = (record) => {
        Modal.info({
            title: "Leave Request Details",
            width: 800,
            open: true,
            content: (
                <div className="leave-details">
                    <div className="detail-row">
                        <span className="label">Employee:</span>
                        <span>{record.user.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Department:</span>
                        <span>{record.user.department}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Leave Type:</span>
                        <span>
                            <Tag color={
                                record.leaveType === "annual" ? "blue" :
                                    record.leaveType === "sick" ? "orange" :
                                        record.leaveType === "personal" ? "green" :
                                            record.leaveType === "maternity" ? "pink" : "cyan"
                            }>
                                {record.leaveType.toUpperCase()}
                            </Tag>
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Dates:</span>
                        <span>
                            {dayjs(record.startDate).format("DD/MM/YYYY")} to {dayjs(record.endDate).format("DD/MM/YYYY")}
                            {record.halfDay && (
                                <Tag style={{ marginLeft: 8 }}>
                                    {record.halfDayOption === "first" ? "Morning" : "Afternoon"}
                                </Tag>
                            )}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Reason:</span>
                        <span>{record.reason}</span>
                    </div>
                    {record.attachment && (
                        <div className="detail-row">
                            <span className="label">Attachment:</span>
                            <a href={record.attachment} target="_blank" rel="noopener noreferrer">
                                View Attachment
                            </a>
                        </div>
                    )}
                    <div className="detail-row">
                        <span className="label">Contact During Leave:</span>
                        <span>{record.contactInfo || "Not provided"}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Status:</span>
                        <span>
                            <Tag color={
                                record.status === "approved" ? "green" :
                                    record.status === "rejected" ? "red" : "orange"
                            }>
                                {record.status.toUpperCase()}
                            </Tag>
                        </span>
                    </div>
                    {record.status !== "pending" && (
                        <>
                            <div className="detail-row">
                                <span className="label">Processed By:</span>
                                <span>{record.approvedBy?.name || "System"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Processed On:</span>
                                <span>{dayjs(record.approvedOn).format("DD/MM/YYYY HH:mm")}</span>
                            </div>
                        </>
                    )}
                </div>
            )
        });
    };

    return (
        <div className="admin-leave-requests">
            <div className="attendance-header">
                <h2>Leave Requests Management</h2>
                <div className="filters">
                    <Input
                        placeholder="Search by employee name"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Select
                        defaultValue="all"
                        style={{ width: 150 }}
                        onChange={(value) => setSelectedStatus(value)}
                    >
                        <Option value="all">All Status</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                    <RangePicker
                        onChange={(dates) => setSelectedDateRange(dates)}
                        style={{ width: 250 }}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={leaveRequests}
                rowKey="_id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: true }}
            />

            <Modal
                title="Reject Leave Request"
                open={isModalVisible}
                onOk={handleReject}
                onCancel={() => {
                    setIsModalVisible(false);
                    setRejectionReason("");
                }}
                okText="Confirm Rejection"
                okButtonProps={{ danger: true }}
            >
                <p>Please provide a reason for rejecting this leave request:</p>
                <Input.TextArea
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                />
            </Modal>
        </div>
    );
};

export default Attendance;