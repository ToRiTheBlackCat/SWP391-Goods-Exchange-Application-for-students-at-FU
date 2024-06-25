import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ManageExchanges.module.css';
const ManageExchanges = () => {
    const [exchanges, setExchanges] = useState([]);

    /*useEffect(() => {
        fetchExchanges();
    }, []);*/

  /*  const fetchExchanges = async () => {
        try {
            const response = await axios.get();
            setExchanges(response.data);
        } catch (error) {
            console.error('Error fetching exchanges:', error);
        }
    };*/

    return (
        <div className="manage-exchanges">
            <h1>Manage Exchanges</h1>
            <div className="exchange-list">
                <h2>All Exchanges</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Owner</th>
                            <th>Price</th>
                            <th>Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        {exchanges.map((exchange) => (
                            <tr key={exchange.id}>
                                <td>{exchange.id}</td>
                                <td>{exchange.name}</td>
                                <td>{exchange.country}</td>
                                <td>{exchange.established}</td>
                                <td><a href={exchange.website} target="_blank" rel="noopener noreferrer">{exchange.website}</a></td>
                                <td>
                                    <button onClick={() => handleDeleteExchange(exchange.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const handleDeleteExchange = async (exchangeId) => {
    try {
        await axios.delete(`/api/exchanges/${exchangeId}`);
        fetchExchanges();
    } catch (error) {
        console.error('Error deleting exchange:', error);
    }
};

export default ManageExchanges;
