import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { Button, Table, Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/users');
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.error('Error: Expected an array but got', response.data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
        setLoading(false);
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/departments'); // Adjust API endpoint if necessary
            if (Array.isArray(response.data)) {
                setDepartments(response.data);
            } else {
                console.error('Error: Expected an array but got', response.data);
                setDepartments([]);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            setDepartments([]);
        }
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        form.setFieldsValue(user);
        setModalVisible(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            if (selectedUser) {
                await axios.put(`/users/${selectedUser._id}`, values);
                toast.success('User updated successfully');
            } else {
                await axios.post('/auth/register', values);
                toast.success('User added successfully');
            }
            setModalVisible(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Failed to save user. Try again.');
        }
    };

    const columns = [
        { title: 'User ID', dataIndex: 'userId', key: 'userId' },
        { title: 'Username', dataIndex: 'username', key: 'username' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        { title: 'Department', dataIndex: 'department', key: 'department', render: (department) => department?.name || 'N/A' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender' },
        {
            title: 'Last Login',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            render: (text) => (text ? new Date(text).toLocaleString() : 'Never')
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleEditUser(record)} style={{ marginRight: 8 }}>Edit</Button>
                    <Button onClick={() => handleDeleteUser(record._id)} danger>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <h2>User Management</h2>
            <Button type="primary" onClick={handleAddUser} style={{ marginBottom: 16 }}>Add User</Button>
            <Table dataSource={users || []} columns={columns} loading={loading} rowKey="_id" />

            <Modal
                title={selectedUser ? 'Edit User' : 'Add User'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter username' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select role' }]}>
                        <Select>
                            <Option value="admin">Admin</Option>
                            <Option value="finance">Finance</Option>
                            <Option value="employee">Employee</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please select department' }]}>
                        <Select placeholder="Select a department">
                            {departments.map((dept) => (
                                <Option key={dept._id} value={dept.name}>{dept.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="age" label="Age" rules={[{ required: true, message: 'Please enter age' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select gender' }]}>
                        <Select>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter a password' }]}>
                        <Input type="password" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UsersPage;
