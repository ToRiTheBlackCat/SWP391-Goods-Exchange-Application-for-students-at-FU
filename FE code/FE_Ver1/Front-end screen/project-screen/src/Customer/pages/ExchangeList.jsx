import { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Button } from 'react-bootstrap';
import styles from '../styles/ExchangeList.module.css'; // Import CSS module
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../authorized/axiosInstance';
import Navbar from '../components/Navbar';

const ExchangeList = () => {
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExchanges = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please log in.');
        return;
      }

      try {
        const response = await axiosInstance.get(`/api/Exchange/EchangeRequests?userID=${userId}`);
        setExchanges(response.data);
      } catch (error) {
        console.error('Error fetching exchange requests:', error);
        setError('Error fetching exchange requests.');
      }
    };

    fetchExchanges();
  }, []);

  const handleSelectExchange = (exchange) => {
    setSelectedExchange(exchange);
  };

  const handleRateExchange = (exchangeId) => {
    // Handle the rating action
    console.log(`Rating exchange with ID: ${exchangeId}`);
    // Implement the rating functionality here
  };

  const handleCancelExchange = (exchangeId) => {
    // Handle the cancel action
    console.log(`Cancelling exchange with ID: ${exchangeId}`);
    // Implement the cancel functionality here
  };
  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return styles['status-accepted'];
      case 2:
        return styles['status-waiting'];
      case 0:
        return styles['status-rejected'];
      default:
        return '';
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Accepted';
      case 2:
        return 'Waiting';
      case 0:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <Navbar/>
      <Container fluid className={styles.container}>
        <Row>
          <Col md={3} className={styles.colMd3}>
            <h3>Your exchange request</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <Table striped bordered hover className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Your product</th>
                  <th>Exchange product</th>
                </tr>
              </thead>
              <tbody>
                {exchanges.map((exchange, index) => (
                  <tr key={exchange.exchangeId} onClick={() => handleSelectExchange(exchange)} className={selectedExchange === exchange ? styles.selected : ''}>
                    <td>{index + 1}</td>
                    <td>{exchange.exProductName}</td>
                    <td>{exchange.productName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col md={9} className={styles.selectedExchange}>
            {selectedExchange ? (
              <>
                <h3>Exchange Details</h3>
                <div className={styles.exchangeDetails}>
                  <div>
                    <span>Exchange Product</span>
                    <span>{selectedExchange.productName}</span>
                  </div>
                  <div>
                    <span>Your product</span>
                    <span>{selectedExchange.exProductName}</span>
                  </div>
                  <div>
                    <span>Owner:</span>
                    <span>{selectedExchange.ownerName}</span>
                  </div>
                  <div>
                    <span>Create date:</span>
                    <span>{selectedExchange.createDate}</span>
                  </div>
                  <div>
                    <span>Balance:</span>
                    <span>{selectedExchange.balance.toLocaleString()} VND</span>
                  </div>
                  <div>
                    <span>Status:</span>
                    <span className={`${styles.status} ${getStatusClass(selectedExchange.status)}`}>
                      {getStatusText(selectedExchange.status)}
                    </span>
                  </div>
                  {selectedExchange.status === 1 && (
                    <Button variant="primary" onClick={() => handleRateExchange(selectedExchange.exchangeId)}>
                      Rate
                    </Button>
                  )}
                  {selectedExchange.status === 2 && (
                    <Button variant="danger" onClick={() => handleCancelExchange(selectedExchange.exchangeId)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <h3 className="text-center">Select an exchange request to view details</h3>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExchangeList;
