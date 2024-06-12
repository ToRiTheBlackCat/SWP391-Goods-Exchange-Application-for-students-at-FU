import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import styles from '../styles/ProductList.module.css';

const ProductList = ({ currentPage }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5299/api/Product/GetSorted?pageIndex=${currentPage}`);
        console.log('API response:', response.data);
        const mappedProducts = response.data.map(product => ({
          imgSrc: product.productImage,
          alt: product.productName,
          title: product.productName,
          link: `/product/${product.productId}`,
          condition: product.productDescription,
          price: `${product.productPrice} VND`,
          seller: 'Unknown',
          rating: 0
        }));
        setProducts(mappedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.row}>
      {products.map((product, index) => (
        <div className={`col-md-4 ${styles.colMd4}`} key={index}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

ProductList.propTypes = {
  currentPage: PropTypes.number.isRequired,
};

export default ProductList;
