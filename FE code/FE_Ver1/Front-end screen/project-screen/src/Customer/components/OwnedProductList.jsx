import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import axiosInstance from '../authorized/axiosInstance'; // Sử dụng axiosInstance
import styles from '../styles/OwnedProductList.module.css'; // Import CSS module
import 'bootstrap/dist/css/bootstrap.min.css';

const OwnedProductsList = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please log in.');
        return;
      }

      try {
        const response = await axiosInstance.get(`/api/Product/Student/ViewOwnProductList/${userId}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products.');
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container fluid className={styles.container}>
      <Row>
        <Col>
          <h3>Your Products</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <Table striped bordered hover className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.productId}>
                  <td>{index + 1}</td>
                  <td>{product.productName}</td>
                  <td>
                    <Button variant="primary" onClick={() => onSelectProduct(product.productId, product.productName)}>
                      View Exchange Requests
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

OwnedProductsList.propTypes = {
  onSelectProduct: PropTypes.func.isRequired,
};

export default OwnedProductsList;
