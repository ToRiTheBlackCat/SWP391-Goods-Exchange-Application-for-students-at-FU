import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../../authorized/axiosInstance';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/Exchange.module.css'; // Import CSS module

const ExchangePage = () => {
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const productToExchange = useSelector((state) => state.product.productToExchange);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedProductImageSrc, setSelectedProductImageSrc] = useState('');
  const [exchangeImageSrc, setExchangeImageSrc] = useState('');
  const [userInputBalance, setUserInputBalance] = useState(''); // State to store user input balance

  useEffect(() => {
    if (!selectedProduct || !selectedProduct.id) {
      setError('Selected product not found.');
      return;
    }
    if (!productToExchange || !productToExchange.productId) {
      setError('Product to exchange not found.');
      return;
    }

    const fetchImages = async () => {
      try {
        // Fetch image for selected product
        if (selectedProduct.image) {
          const selectedProductResponse = await axios.get(`https://localhost:7027/api/Product/GetUserImage?imageName=${selectedProduct.image}`, {
            responseType: 'text',
          });

          const selectedProductFileExtension = selectedProduct.image.split('.').pop().toLowerCase();
          let selectedProductMimeType;
          switch (selectedProductFileExtension) {
            case 'jpeg':
            case 'jpg':
              selectedProductMimeType = 'image/jpeg';
              break;
            case 'png':
              selectedProductMimeType = 'image/png';
              break;
            case 'webp':
              selectedProductMimeType = 'image/webp';
              break;
            default:
              selectedProductMimeType = 'image/jpeg';
              break;
          }

          const selectedProductImgSrc = `data:${selectedProductMimeType};base64,${selectedProductResponse.data}`;
          setSelectedProductImageSrc(selectedProductImgSrc);
        } else {
          console.error('Selected product image is undefined');
        }

        // Fetch image for product to exchange
        if (productToExchange.productImage) {
          const productToExchangeResponse = await axios.get(`https://localhost:7027/api/Product/GetUserImage?imageName=${productToExchange.productImage}`, {
            responseType: 'text',
          });

          const productToExchangeFileExtension = productToExchange.productImage.split('.').pop().toLowerCase();
          let productToExchangeMimeType;
          switch (productToExchangeFileExtension) {
            case 'jpeg':
            case 'jpg':
              productToExchangeMimeType = 'image/jpeg';
              break;
            case 'png':
              productToExchangeMimeType = 'image/png';
              break;
            case 'webp':
              productToExchangeMimeType = 'image/webp';
              break;
            default:
              productToExchangeMimeType = 'image/jpeg';
              break;
          }

          const productToExchangeImgSrc = `data:${productToExchangeMimeType};base64,${productToExchangeResponse.data}`;
          setExchangeImageSrc(productToExchangeImgSrc);
        } else {
          console.error('Product to exchange image is undefined');
        }

      } catch (error) {
        console.error('Error fetching product images:', error);
        setError('Error fetching product images.');
      }
    };

    fetchImages();
  }, [selectedProduct, productToExchange]);

  const handleExchangeRequest = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User ID not found. Please log in.');
      return;
    }

    // Remove dots from formatted balance before sending request
    const balance = parseInt(userInputBalance.replace(/\./g, ''), 10);

    if (isNaN(balance)) {
      setError('Please enter a valid number for the balance.');
      return;
    }

    const exchangeRequest = {
      userId: userId,
      productId: productToExchange.productId,
      balance: balance,
      exProductId: selectedProduct.id,
      status: 2
    };
    console.log('Exchange Request:', exchangeRequest);

    try {
      const response = await axiosInstance.post('/api/Exchange/CreateExchange', exchangeRequest);
      console.log('Response Status:', response.status); // Log response status
      console.log('Response Data:', response.data); // Log response data
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Exchange request created successfully! Back to home page now');
        setTimeout(() => {
          navigate('/');
        }, 2000); // Delay navigation by 2 seconds
      } else {
        setError('Failed to create exchange request. Please try again.');
      }
    } catch (error) {
      console.error('Error creating exchange request:', error);
      setError('Error creating exchange request.');
    }
  };

  const formatCurrency = (value) => {
    return value.replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleBalanceChange = (e) => {
    setUserInputBalance(formatCurrency(e.target.value));
  };

  if (error) {
    return <div className={styles.alert}>{error}</div>;
  }

  if (!selectedProduct || !productToExchange) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className={`container ${styles.container}`}>
        <div className={styles.row}>
          <div className={styles.colMd6}>
            <h2>Your product</h2>
            {selectedProductImageSrc && <img src={selectedProductImageSrc} alt={selectedProduct.name} className={styles.productImage} />}
            <div className={styles.productDetails}>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Price:</strong> {selectedProduct.price.toLocaleString()} VND</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
            </div>
          </div>
          <div className={styles.colMd6}>
            <h2>Product of {productToExchange.productOwner.userName}</h2>
            {exchangeImageSrc && <img src={exchangeImageSrc} alt={productToExchange.productName} className={styles.productImage} />}
            <div className={styles.productDetails}>
              <p><strong>Name:</strong> {productToExchange.productName}</p>
              <p><strong>Price:</strong> {productToExchange.productPrice.toLocaleString()} VND</p>
              <p><strong>Description:</strong> {productToExchange.productDescription}</p>
            </div>
          </div>
        </div>
        <div className={styles.priceDifference}>
          <p>Please enter the amount you are willing to exchange:</p>
          <input 
            type="text" 
            value={userInputBalance} 
            onChange={handleBalanceChange} 
            className="form-control" 
            placeholder="Enter amount in VND"
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <div className={styles.buttons}>
          <button onClick={handleExchangeRequest} className={`btn btn-info ${styles.btn}`}>Submit Exchange Request</button>
          <button onClick={() => navigate(-1)} className={`btn ${styles.btn} ${styles.btnCancel}`}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default ExchangePage;
