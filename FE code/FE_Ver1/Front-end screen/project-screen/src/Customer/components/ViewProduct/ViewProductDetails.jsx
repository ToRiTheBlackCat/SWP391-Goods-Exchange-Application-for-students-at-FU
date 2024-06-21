import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/ChooseProduct.module.css';
import axios from 'axios';
import axiosInstance from '../../../authorized/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedProduct } from '../../store/store';

function ViewProductDetails({ product, onDelete  }) {
  const [imageBase64, setImageBase64] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleUpdateClick = () => {
    dispatch(setSelectedProduct(product));
    navigate(`/update-product/${product.id}`);
  };

  const handleDeleteClick = () => {
    axiosInstance.post(`/api/Product/Student/DeleteProduct/${product.id}`)
      .then(response => {
        alert('Product deleted successfully');
        onDelete(product.id);
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        alert('Failed to delete the product');
      });
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
        <button onClick={handleUpdateClick} className={`${styles['button']} btn btn-warning`}>Update</button>
        <button onClick={handleDeleteClick} className={`${styles['button']} btn btn-danger`}>Delete</button>
      </div>
    </div>
  );
}

ViewProductDetails.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ViewProductDetails;
