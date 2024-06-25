import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ManageAccounts.module.css';

const ManageAccounts = () => {
    const [users, setUsers] = useState([]);
    const [newMod, setNewMod] = useState({
        username: '',
        password: '',
        role: 'mod'
    });

    /*useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };*/

    const handleAddMod = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/users', newMod);
            fetchUsers();
            setNewMod({ username: '', password: '', role: 'mod' });
        } catch (error) {
            console.error('Error adding mod:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/api/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="manage-accounts">
            <h1>Manage Accounts</h1>
            <div className="add-mod">
                <h2>Add Moderator</h2>
                <form onSubmit={handleAddMod}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={newMod.username}
                        onChange={(e) => setNewMod({ ...newMod, username: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newMod.password}
                        onChange={(e) => setNewMod({ ...newMod, password: e.target.value })}
                        required
                    />
                    <button type="submit">Add Mod</button>
                </form>
            </div>
            <div className="user-list">
                <h2>All Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAccounts;
