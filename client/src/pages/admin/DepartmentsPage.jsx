import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { Button, Table, Modal, Form, Input, Select } from 'antd';
import "../../styles/styles.scss";

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/departments');
            setDepartments(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setDepartments([]);
        }
        setLoading(false);
    };

    const handleAddDepartment = () => {
        setSelectedDepartment(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEditDepartment = (department) => {
        setSelectedDepartment(department);
        form.setFieldsValue(department);
        setModalVisible(true);
    };

    const handleDeleteDepartment = async (departmentId) => {
        try {
            await axios.delete(`/departments/${departmentId}`);
            toast.success('Department deleted successfully');
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
            toast.error('Failed to delete department');
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            if (selectedDepartment) {
                await axios.put(`/departments/${selectedDepartment._id}`, values);
                toast.success('Department updated successfully');
            } else {
                await axios.post('/departments', values);
                toast.success('Department added successfully');
            }
            setModalVisible(false);
            fetchDepartments();
        } catch (error) {
            console.error('Error saving department:', error);
            toast.error('Failed to save department');
        }
    };

    const columns = [
        {
            title: 'Department ID',
            dataIndex: 'departmentId',
            key: 'departmentId',
        },
        {
            title: 'Department Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Manager',
            dataIndex: 'manager',
            key: 'manager',
        },
        {
            title: 'Performance',
            dataIndex: 'performance',
            key: 'performance',
        },
        {
            title: 'Number of Employees',
            dataIndex: 'employeeCount',
            key: 'employeeCount',
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleEditDepartment(record)} style={{ marginRight: 8 }}>Edit</Button>
                    <Button onClick={() => handleDeleteDepartment(record._id)} danger>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <h2>Department Management</h2>
            <Button type="primary" onClick={handleAddDepartment} style={{ marginBottom: 16 }}>Add Department</Button>
            <Table dataSource={departments || []} columns={columns} loading={loading} rowKey="_id" />

            <Modal
                title={selectedDepartment ? 'Edit Department' : 'Add Department'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item name="name" label="Department Name" rules={[{ required: true, message: 'Please enter department name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="manager" label="Manager" rules={[{ required: true, message: 'Please enter manager name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="performance" label="Performance" rules={[{ required: true, message: 'Please enter Performance' }]}>
                        <Select>
                            <Select.Option value="good">Good</Select.Option>
                            <Select.Option value="average">Average</Select.Option>
                            <Select.Option value="poor">Poor</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="employeeCount" label="Number of Employees" rules={[{ required: true, message: 'Please enter employee count' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="budget" label="Budget" rules={[{ required: true, message: 'Please enter budget' }]}>
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DepartmentsPage;
