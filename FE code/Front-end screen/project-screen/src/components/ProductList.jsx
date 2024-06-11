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
        const response = await axios.get('http://localhost:5299/api/Product/GetSorted');
        console.log('Products Data:', response.data); // Log products data
        const productData = response.data;

        const promises = productData.map(async (product) => {
          try {
            const imageResponse = await axios.get(`http://localhost:5299/api/Product/GetUserImage?imageName=${product.productImage}`, {
              responseType: 'text', // Change responseType to 'text' to get base64 string directly
            });
            console.log('Image Response Data:', imageResponse.data); // Log image response data

            // Determine MIME type based on file extension
            const fileExtension = product.productImage.split('.').pop().toLowerCase();
            let mimeType;
            switch (fileExtension) {
              case 'jpeg':
              case 'jpg':
                mimeType = 'image/jpeg';
                break;
              case 'png':
                mimeType = 'image/png';
                break;
              case 'webp':
                mimeType = 'image/webp';
                break;
              default:
                mimeType = 'image/jpeg'; // Default to JPEG if MIME type cannot be determined
                break;
            }

            // Use base64 string directly
            const imgSrc = `data:${mimeType};base64,${imageResponse.data}`;
            return {
              imgSrc,
              alt: product.productName,
              title: product.productName,
              link: `/product/${product.productId}`,
              condition: product.productDescription,
              price: `${product.productPrice} VND`,
              seller: product.productOwner.userName,
              rating: product.productOwner.averageScore || 0,
            };
          } catch (error) {
            console.error('Error fetching image for product:', product.productId, error);
            return {
              imgSrc: '', // Provide a placeholder or default image source if there's an error
              alt: product.productName,
              title: product.productName,
              link: `/product/${product.productId}`,
              condition: product.productDescription,
              price: `${product.productPrice} VND`,
              seller: 'Unknown',
              rating: 0,
            };
          }
        });

        const mappedProducts = await Promise.all(promises);

        // Filter out null entries
        const validProducts = mappedProducts.filter((product) => product !== null);

        setProducts(validProducts);
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
};

export default ProductList;
