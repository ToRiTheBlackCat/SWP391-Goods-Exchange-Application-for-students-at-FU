import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance.js';
import img from '../../assets/img.jpg';

import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Charts() {
    const [productData, setProductData] = useState([]);
    const [accountData, setAccountData] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [exchangeData, setExchangeData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        axiosInstance.get('/api/Product/Admin/DashboardProducts')
            .then(response => {
                const responseData = response.data;
                const barChartData = [
                    // { name: 'Total Products', value: responseData.totalProducts },
                    { name: 'Electronics', value: responseData.electronics },
                    { name: 'Books', value: responseData.books },
                    { name: 'Accessories', value: responseData.accessories },
                    { name: 'Housewares', value: responseData.housewares },
                    { name: 'Supplies', value: responseData.supplies },
                    { name: 'Clothes', value: responseData.clothes },
                ];
                setProductData(barChartData);
                setTotalProducts(responseData.totalProducts);
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });

        axiosInstance.get('/api/User/Admin/DashboardAccount')
            .then(response => {
                const responseData = response.data;
                const accountChartData = [
                    { name: 'All Accounts', value: responseData.allAccounts },
                    { name: 'Mod Accounts', value: responseData.modAccounts },
                    { name: 'Admin Accounts', value: responseData.adminAccount },
                ];
                setAccountData(accountChartData);
                setTotalAccounts(responseData.allAccounts);
            })
            .catch(error => {
                console.error('Error fetching account data:', error);
            });
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.get(`/api/Exchange/Admin/DashboardExchange?fromDate=${fromDate}&toDate=${toDate}`)
            .then(response => {
                const responseData = response.data;
                const chartData = [
                    { name: 'All Exchanges', value: responseData.allExchanges },
                    { name: 'Waiting Exchanges', value: responseData.waitingExchanges },
                    { name: 'Accepted Exchanges', value: responseData.acceptedExchanges },
                    { name: 'Declined Exchanges', value: responseData.declinedExchanges },
                ];
                setExchangeData(chartData);
            })
            .catch(error => {
                console.error('Error fetching exchange data:', error);
            });
    };

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57']; // Define colors for each bar

    return (
        <main className="main-container">
            <div className="main-title">
                <h3 className='title' style={{color: 'black'}}>DASHBOARD</h3>
            </div>
            <div className="main-cards">
                <div className='card'>
                    <div className="card-inner">
                        <h3>Products</h3>
                        <BsFillArchiveFill className='card-icon' />
                    </div>
                    <h1>{totalProducts}</h1>
                </div>
                <div className='card'>
                    <div className="card-inner">
                        <h3>Categories</h3>
                        <BsFillGrid3X3GapFill className='card-icon' />
                    </div>
                    <h1>6</h1>
                </div>
                <div className='card'>
                    <div className="card-inner">
                        <h3>Accounts</h3>
                        <BsPeopleFill className='card-icon' />
                    </div>
                    <h1>{totalAccounts}</h1>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="date-form" style={{color: 'black'}}>
                <label style={{marginRight: '74px'}}>
                    From Date:
                    <input 
                        type="date" 
                        value={fromDate} 
                        onChange={(e) => setFromDate(e.target.value)} 
                        
                    />
                </label>
                <label style={{marginRight:'100px'}}>
                    To Date:
                    <input 
                        type="date" 
                        value={toDate} 
                        onChange={(e) => setToDate(e.target.value)} 
                        
                    />
                </label>
                <button type="submit">View dashboard</button>
            </form>
            <div className='charts'>
            <h2 className="chart-title" style={{color:'black'}}>Exchange Dashboard</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={exchangeData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value">
                            {exchangeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                <h2 className="chart-title" style={{color:'black'}}>Account Dashboard</h2> {/* Add title for the account dashboard */}
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={accountData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value">
                            {accountData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                <h2 className="chart-title" style={{color:'black'}}>Product Dashboard</h2> {/* Add title for the product dashboard */}
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={productData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value">
                            {productData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div style={{display:'flex'}}>
               
                    <PieChart width={500} height={500}>
                        <Pie data={productData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={200} fill="#82ca9d" label>
                            {productData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                            
                        </Pie>
                    </PieChart>
                
                    <img style={{width:'200px', height:'400px'}} src={img}/>
                </div>
            </div>
        </main>
    );
}

export default Charts;
