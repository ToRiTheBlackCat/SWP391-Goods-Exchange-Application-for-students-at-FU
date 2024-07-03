import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import styles from '../styles/ManageExchanges.module.css';
import Navbar from '../components/Navbar';

const ManageExchanges = () => {
    const [exchanges, setExchanges] = useState([]);

    useEffect(() => {
        fetchExchanges();
    }, []);

    const fetchExchanges = async () => {
        try {
            const response = await axiosInstance.get('/api/Exchange/Admin/GetAllExchangeList');
            setExchanges(response.data);
        } catch (error) {
            console.error('Error fetching exchanges:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.manageExchanges}>
                <h1>Manage Exchanges</h1>
                <div className={styles.exchangeList}>
                    <h2>All Exchanges</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Exchange Receiver</th>
                                <th>Product Wanted</th>
                                <th>Exchange Sender</th>
                                <th>Product Used to Exchange</th>
                                <th>Balance</th>
                                <th>Create Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exchanges.map((exchange) => (
                                <tr key={exchange.exchangeId}>
                                    <td>{exchange.exchangeId}</td>
                                    <td>{exchange.exchangeReceiver}</td>
                                    <td>{exchange.productWantToGet}</td>
                                    <td>{exchange.exchangeSender}</td>
                                    <td>{exchange.productUseToExchange}</td>
                                    <td>{exchange.balance.toLocaleString()} VND</td>
                                    <td>{exchange.createDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageExchanges;
