import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import styles from '../styles/ProductList.module.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5152/api/Products');
        console.log('API response:', response.data);
        const mappedProducts = response.data.map(product => ({
          imgSrc: product.productImage,
          alt: product.productName,
          title: product.productName,
          link: `/product/${product.id}`,
          condition: product.productDescription,
          color: 'Not specified',
          size: 'Not specified',
          price: `${product.productPrice} VND`,
          seller: 'Unknown',
          rating: 0
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products.');
      }
    };

    fetchProducts();
  }, []);

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
}

export default ProductList;
