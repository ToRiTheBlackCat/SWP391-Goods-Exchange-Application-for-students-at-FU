import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/WaitingProduct.module.css';
import axiosInstance from '../../authorized/axiosInstance';
import axios from 'axios';

const WaitingProductDetail = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    if (product) {
      const fetchImage = async () => {
        try {
          const imageResponse = await axios.get(
            `https://localhost:7027/api/Product/GetUserImage?imageName=${product.productImage}`,
            {
              responseType: 'text', // Change responseType to 'text' to get base64 string directly
            }
          );
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
          setImageSrc(imgSrc);
          setLoadingImage(false);
        } catch (error) {
          console.error('Error fetching image', error);
          setLoadingImage(false);
        }
      };

      fetchImage();
    }
  }, [product]);

  const handleAccept = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/Product/Mod/AcceptProductInWaitingList/${product.productId}`
      );
      if (response.status === 200) {
        console.log('Product accepted:', product);
        // Handle additional logic after accepting the product
      }
    } catch (error) {
      console.error('Error accepting product', error);
    }
  };


  const handleDecline = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/Product/Mod/RejectProduct/${product.productId}`
      );
      if (response.status === 200) {
        console.log('Product declined:', product);
        // Handle additional logic after declining the product
      }
    } catch (error) {
      console.error('Error declining product', error);
    }
  };

  if (!product) {
    return <div className={`col-md-8 ${styles.col}`}>Select a product to see details</div>;
  }

  return (
    <div className={`col-md-8 ${styles.col}`}>
      <h3>Exchange Details</h3>
      <table className={`table ${styles.table}`}>
        <tbody>
          <tr>
            <th>Product Name</th>
            <td>{product.productName}</td>
          </tr>
          <tr>
            <th>Product Image</th>
            <td>
              {loadingImage ? (
                'Loading image...'
              ) : (
                <img src={imageSrc} alt={product.productName} style={{ width: '100px' }} />
              )}
            </td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{product.productDescription}</td>
          </tr>
          <tr>
            <th>Price</th>
            <td>{product.productPrice} VND</td>
          </tr>
          <tr>
            <th>Owner</th>
            <td>{product.productOwner.userName}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{product.productOwner.email.trim()}</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.buttonGroup}>
        <button className={`${styles['btn-success']} btn`} onClick={handleAccept}>Accept</button>
        <button className={`${styles['btn-decline']} btn`} onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
};

WaitingProductDetail.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    productImage: PropTypes.string.isRequired,
    productDescription: PropTypes.string.isRequired,
    productPrice: PropTypes.number.isRequired,
    productOwner: PropTypes.shape({
      userName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

export default WaitingProductDetail;
