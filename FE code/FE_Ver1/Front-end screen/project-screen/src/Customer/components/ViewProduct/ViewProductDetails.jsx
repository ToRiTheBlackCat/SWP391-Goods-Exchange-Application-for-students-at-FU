import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/ChooseProduct.module.css';
import axiosInstance from '../../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedProduct } from '../../store/store';
import { toast } from 'react-toastify';

function ViewProductDetails({ product, onDelete }) {
  const [editableProduct, setEditableProduct] = useState(product);
  const [imageBase64, setImageBase64] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setEditableProduct(product);
    if (product.image) {
      axiosInstance.get(`/api/Product/GetUserImage?imageName=${product.image}`)
        .then(response => {
          setImageBase64(response.data);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    }
  }, [product]);

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

  const handleUpdateClick = async () => {
    if (editableProduct.status === 1) {
      const confirmMessage = 'This product may have incoming exchange requests. If you update the product information, all such requests will be automatically canceled. Confirm?';
      if (window.confirm(confirmMessage)) {
        await handleCancelExchange(editableProduct.id);
        dispatch(setSelectedProduct(editableProduct));
        navigate(`/update-product/${editableProduct.id}`);
      }
    } else {
      dispatch(setSelectedProduct(editableProduct));
      navigate(`/update-product/${editableProduct.id}`);
    }
  };

  const handleDeleteClick = async () => {
    if (editableProduct.status === 1) {
      const confirmMessage = 'This product may have incoming exchange requests. If you delete this product, all such requests will be automatically canceled. Confirm?';
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    await handleCancelExchange(editableProduct.id);
    axiosInstance.post(`/api/Product/Student/DeleteProduct/${editableProduct.id}`)
      .then(response => {
        console.log('Product deleted successfully', response);
        toast.success('Product deleted successfully');
        onDelete(editableProduct.id);
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete the product');
      });
  };

  const handleCancelExchange = async (productId) => {
    try {
      const response = await axiosInstance.post(`/api/Exchange/CancelExchangeList/${productId}`);
      // console.log("Cancel successfully");
      console.log("respone", response.data);
      return response.data;
    } catch (error) {
      console.error('Error cancelling exchange:', error);
      return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Selling';
      case 2:
        return 'Exchanging';
      case 3:
        return 'Waiting';
      default:
        return 'Undefined';
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
        {product.status !== 0 && (
          <div className={styles['info-item']}>
            <strong>Status</strong>
            <span>{getStatusText(product.status)}</span>
          </div>
        )}
      </div>
      <div className={styles['button-group']}>
        {product.status == 1 &&(
          <>
            <button onClick={handleUpdateClick} className={`${styles['button']} btn btn-warning`}>Update</button>
            <button onClick={handleDeleteClick} className={`${styles['button']} btn btn-danger`}>Delete</button>
          </>
        )}
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
    status: PropTypes.number.isRequired, // Add status to prop types
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ViewProductDetails;
