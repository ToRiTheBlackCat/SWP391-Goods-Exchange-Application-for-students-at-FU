import { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import styles from '../styles/ExchangeList.module.css'; // Import CSS module
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../components/Navbar';

const ExchangeList = () => {
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [error, setError] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [isRating, setIsRating] = useState(false); // New state to toggle rating form
  const [hasRated, setHasRated] = useState(false); // State to track if the user has already rated

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
    setIsRating(false); // Reset rating form when selecting a new exchange

    // Check if the user has already rated this exchange
    const userId = localStorage.getItem('userId');
    if (exchange.ratings && exchange.ratings.some(rating => rating.userId === parseInt(userId, 10))) {
      setHasRated(true);
    } else {
      setHasRated(false);
    }
  };

  const handleRateExchange = () => {
    if (!hasRated) {
      setIsRating(true); // Show rating form
    } else {
      toast.error('You have already rated this exchange.');
    }
  };

  const handleCancelExchange = (exchangeId) => {
    confirmAlert({
      title: 'Confirm Cancel',
      message: 'Are you sure you want to cancel this exchange?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => cancelExchange(exchangeId)
        },
        {
          label: 'No',
          onClick: () => toast.info('Cancel action aborted')
        }
      ]
    });
  };

  const cancelExchange = async (exchangeId) => {
    try {
      const response = await axiosInstance.delete(`/api/Exchange/Student/CancelExchange?exchangeId=${exchangeId}`);
      if (response.status === 200) {
        toast.success('Exchange cancelled successfully');
        // Optionally, remove the cancelled exchange from the state
        setExchanges(exchanges.filter(exchange => exchange.exchangeId !== exchangeId));
        setSelectedExchange(null);
      }
    } catch (error) {
      console.error('Error cancelling exchange:', error);
      setError('Error cancelling exchange. Please try again.');
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    // Handle rating submission
    console.log(`Rating: ${rating}, Comment: ${comment}`);
    const ratingData = {
      exchangeId: selectedExchange.exchangeId,
      userId: selectedExchange.ownerId,
      score: parseInt(rating, 10),
      comment: comment,
      ratingDate: new Date().toISOString(),
    };

    // Implement the API call to submit the rating and comment
    try {
      const response = await axiosInstance.post('/api/Exchange/Student/Rating&Comment', ratingData);
      if (response.status === 200) {
        toast.success('Rating submitted successfully');
        setIsRating(false);
        setRating('');
        setComment('');
        setHasRated(true); // Update the state to indicate the user has rated
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      if (error.response && error.response.status === 400) { // Assuming 409 Conflict status code for already rated
        toast.error('You rated this exchange already');
      } else {
        setError('Error submitting rating. Please try again.');
      }
    }
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
      <Navbar />
      <Container fluid className={styles.container}>
        <Row className={styles.row}>
          <Col md={3} className={styles.colMd3}>
            <h3>Your exchange request</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <Table striped bordered hover className={`${styles.table} ${styles['table-hover']}`}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Your product</th>
                  <th>Exchange product</th>
                </tr>
              </thead>
              <tbody>
                {exchanges.map((exchange, index) => (
                  <tr
                    key={exchange.exchangeId}
                    onClick={() => handleSelectExchange(exchange)}
                    className={selectedExchange === exchange ? styles.selected : ''}
                  >
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
                  {selectedExchange.status === 1 && !isRating && !hasRated && (
                    <Button variant="primary" onClick={handleRateExchange}>
                      Rate
                    </Button>
                  )}
                  {selectedExchange.status === 2 && (
                    <Button variant="danger" onClick={() => handleCancelExchange(selectedExchange.exchangeId)}>
                      Cancel
                    </Button>
                  )}
                  {isRating && (
                    <Form onSubmit={handleSubmitRating} className={styles.ratingForm}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          required
                          className={styles.formControl} // Add class for custom styling
                        >
                          <option value="">Select a rating</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="mt-3">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button variant="success" type="submit" className="mt-3">
                        Submit Rating
                      </Button>
                    </Form>
                  )}
                </div>
              </>
            ) : (
              <h3 className="text-center">Select an exchange request to view details</h3>
            )}
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default ExchangeList;
