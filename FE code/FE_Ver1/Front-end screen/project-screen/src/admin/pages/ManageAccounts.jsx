import React, { useState, useEffect } from 'react';
import styles from '../styles/ManageAccounts.module.css';
import axiosInstance from '../../utils/axiosInstance';
import { confirmAlert } from 'react-confirm-alert';
import Navbar from '../components/Navbar';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import css

const ManageAccounts = () => {
    const [users, setUsers] = useState([]);
    const [newMod, setNewMod] = useState({
        email: '',
        password: '',
        userName: '',
        phoneNumber: '',
        address: '',
        gender: true,
        dob: '' // Change dob to a string
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/User/Admin/GetAllAccountList');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const formatPhoneNumber = (phoneNumber) => {
        // Format phone number as 0123.456.789
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
        if (match) {
            return `${match[1]}.${match[2]}.${match[3]}`;
        }
        return phoneNumber;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMod({
            ...newMod,
            [name]: name === 'phoneNumber' ? formatPhoneNumber(value) : value,
        });
    };

    const handleAddMod = async (e) => {
        e.preventDefault();
        console.log('Mod Data:', newMod);

        if (newMod.password.length < 5) {
            toast.error('Password must be greater than 5 characters.');
            return;
        }

        const emailExists = users.some(user => user.email === newMod.email);
        const usernameExists = users.some(user => user.userName === newMod.userName);

        if (emailExists || usernameExists) {
            if (emailExists) toast.error('Email already exists.');
            if (usernameExists) toast.error('Username already exists.');
            return;
        }

        try {
            const response = await axiosInstance.post('/api/User/Create-Modderator-Account', {
                ...newMod,
                phoneNumber: newMod.phoneNumber.replace(/\./g, ''), // Remove dots before sending to server
            });
            console.log('Response Status:', response.status); // Log the response status
            if (response.status === 200) {
                fetchUsers();
                setNewMod({
                    email: '',
                    password: '',
                    userName: '',
                    phoneNumber: '',
                    address: '',
                    gender: true,
                    dob: '' // Reset dob to an empty string
                });
                toast.success('Moderator account created successfully.');
            }
        } catch (error) {
            console.error('Error Response:', error.response); // Log the error response
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message || 'Username or email already exists.';
                if (errorMessage.includes('email')) {
                    toast.error('Email already exists.');
                } else if (errorMessage.includes('username')) {
                    toast.error('Username already exists.');
                } else {
                    toast.error(errorMessage);
                }
            } else {
                console.error('Error adding mod:', error);
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this account?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axiosInstance.post(`/api/User/Admin/DeleteAccount/${userId}`);
                            console.log('Delete Response Status:', response.status); // Log the response status
                            setUsers(users.filter(user => user.userId !== userId));
                        } catch (error) {
                            console.error('Error deleting user:', error);
                        }
                    }
                },
                {
                    label: 'No'
                }
            ]
        });
    };

    return (
        <>
            <Navbar />
            <div className={styles.manageAccounts}>
                <h1>Manage Accounts</h1>
                <div className={styles.addModContainer}>
                    <h2>Add Moderator</h2>
                    <form onSubmit={handleAddMod} className={styles.addModForm}>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={newMod.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={newMod.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Username</label>
                            <input
                                type="text"
                                name="userName"
                                placeholder="Username"
                                value={newMod.userName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={newMod.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={newMod.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={newMod.gender}
                                onChange={handleInputChange}
                            >
                                <option value="true">Male</option>
                                <option value="false">Female</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={newMod.dob}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.addButtonContainer}>
                            <button type="submit" className={styles.addButton}>Add Mod</button>
                        </div>
                    </form>
                </div>
                <div className={styles.userList}>
                    <h2>All Users</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>DOB</th>
                                <th>Role ID</th>
                                <th>Address</th>
                                <th>Average Score</th>
                                <th>Is Banned</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userId}>
                                    <td>{user.userId}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.password}</td>
                                    <td>{user.email}</td>
                                    <td>{formatPhoneNumber(user.phone)}</td>
                                    <td>{user.gender ? 'Male' : 'Female'}</td>
                                    <td>{user.dob}</td>
                                    <td>{user.roleId}</td>
                                    <td>{user.address}</td>
                                    <td>{user.averageScore}</td>
                                    <td>{user.isBanned ? 'Yes' : 'No'}</td>
                                    <td>
                                        <button className={styles.button} onClick={() => handleDeleteUser(user.userId)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default ManageAccounts;
