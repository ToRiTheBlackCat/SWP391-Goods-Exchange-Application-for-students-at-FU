import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Container, Row, Col, Button } from 'react-bootstrap';
import axiosInstance from '../authorized/axiosInstance'; // Sử dụng axiosInstance
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/ExchangeRequests.module.css'; // Import CSS module
import 'bootstrap/dist/css/bootstrap.min.css';

const ExchangeRequests = ({ productId, productName }) => {
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchExchangeRequests = async () => {
      setError(''); // Reset error message before fetching data
      try {
        const response = await axiosInstance.get(`/api/Exchange/ProductExchanges/${productId}`);
        if (response.data.length === 0) {
          setExchangeRequests([]); // Clear previous requests
          setError('This product does not have any exchange requests.');
        } else {
          setExchangeRequests(response.data);
        }
      } catch (error) {
        console.error('Error fetching exchange requests:', error);
        setError('Error fetching exchange requests.');
      }
    };

    fetchExchangeRequests();
  }, [productId]);

  const handleAcceptExchange = async (exchangeId) => {
    const isConfirmed = window.confirm('Are you sure you want to accept this exchange request?');
    if (!isConfirmed) {
      return;
    }

    console.log('Exchange ID:', exchangeId);
    try {
      const response = await axiosInstance.put(`/api/Exchange/AcceptExchange?exchangeId=${exchangeId}`);
      if (response.status === 200) {
        setSuccessMessage('Exchange accepted successfully!');
        toast.success('Exchange successful!');
        // Remove all exchange requests related to the same product
        setExchangeRequests([]);
      } else {
        setError('Failed to accept exchange.');
        toast.error('Failed to accept exchange.');
      }
    } catch (error) {
      console.error('Error accepting exchange:', error);
      setError('Error accepting exchange.');
      toast.error('Error accepting exchange.');
    }
  };

  return (
    <Container fluid className={styles.container}>
      <ToastContainer />
      <Row>
        <Col>
          <h3>Exchange Requests for Product: {productName}</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <Table striped bordered hover className={styles.table}>
            <thead>
              <tr>
                <th>Buyer Name</th>
                <th>Exchange Product Name</th>
                <th>Balance</th>
                <th>Create Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exchangeRequests.map((request) => (
                <tr key={request.exchangeId}>
                  <td>{request.buyerName}</td>
                  <td>{request.exProductName}</td>
                  <td>{request.balance.toLocaleString()} VND</td>
                  <td>{new Date(request.createDate).toLocaleDateString()}</td>
                  <td>
                    <Button variant="success" onClick={() => handleAcceptExchange(request.exchangeId)} className={styles.btn}>
                      Accept
                    </Button>
                    <Button variant="danger" className={styles.btn}>
                      Decline
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

ExchangeRequests.propTypes = {
  productId: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
};

export default ExchangeRequests;
