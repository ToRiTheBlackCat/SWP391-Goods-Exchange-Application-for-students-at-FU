import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/ChooseProduct.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProductInfo({ product, onSelect }) {
  const [imageBase64, setImageBase64] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (product.image) {
      axios.get(`https://localhost:7027/api/Product/GetUserImage?imageName=${product.image}`)
        .then(response => {
          setImageBase64(response.data);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    }
  }, [product.image]);

  const getImageMimeType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  };

  return (
    <div className={styles['product-details']}>
      {imageBase64 && (
        <img
          className={styles['product-image']}
          src={`data:${getImageMimeType(product.image)};base64,${imageBase64}`}
          alt={product.name}
        />
      )}
      <div className={styles['info']}>
        <div className={styles['info-item']}>
          <strong>Name</strong>
          <span>{product.name}</span>
        </div>
        <div className={styles['info-item']}>
          <strong>Price</strong>
          <span>{product.price.toLocaleString()} VND</span>
        </div>
        <div className={styles['info-item']}>
          <strong>Description</strong>
          <span>{product.description}</span>
        </div>
      </div>
      <div className={styles['button-group']}>
        <button onClick={() => onSelect(product)} className={`${styles['button']} btn btn-success`}>Select</button>
        <button onClick={() => navigate(-1)} className={`${styles['button']} btn btn-danger`}>Decline</button>
      </div>
    </div>
  );
}

ProductInfo.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ProductInfo;
