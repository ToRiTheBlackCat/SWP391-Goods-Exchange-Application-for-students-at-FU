import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../authorized/axiosInstance'; // Import axiosInstance
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import anhliem from '../assets/anhliem.jpg';
import axios from 'axios';
import styles from '../styles/ProductPage.module.css'; // Import CSS module

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('Phone');
  const [error, setError] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/Product/Student/ViewProductDetailWithId/${id}`);
        const productData = response.data;
        setProduct(productData);
        setSellerInfo(productData.productOwner);
        setPhoneNumber(productData.productOwner.phone);

        // Fetch product image
        const imageResponse = await axios.get(`http://localhost:5299/api/Product/GetUserImage?imageName=${productData.productImage}`, {
          responseType: 'text',
        });

        const fileExtension = productData.productImage.split('.').pop().toLowerCase();
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

        const imgSrc = `data:${mimeType};base64,${imageResponse.data}`;
        setImageSrc(imgSrc);

      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product.');
      }
    };

    fetchProduct();
  }, [id]);

  const handlePhoneClick = () => {
    if (phoneNumber) {
      alert(`Phone number: ${phoneNumber}`);
    } else {
      alert('Phone number not available.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleExchangeClick = () => {
    navigate('/choose-product');
  };

  const handleChatClick = () => {
    // Handle chat button click
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="bg-white p-4 shadow-sm">
          <h1 className="display-4">{product.productName}</h1>
          <h5 className={styles.sellerName}>Owner: {sellerInfo.userName}</h5> {/* Apply sellerName style */}
          <p className="text-danger fs-4">Price: {product.productPrice.toLocaleString()} VND</p>
          <div className={`text-center mb-4 ${styles.productImageContainer}`}> {/* Apply productImageContainer style */}
            <img src={imageSrc} className={`img-fluid ${styles.productImage}`} alt={product.productName} /> {/* Apply productImage style */}
          </div>
          <div>
            <h2 className="h4">Detailed description</h2>
            <p>{product.productDescription}</p>
          </div>
        </div>
      </div>
      <div className="position-fixed top-0 end-0 p-3 bg-light border rounded mt-5 me-3">
        {sellerInfo && (
          <div className="d-flex align-items-center mb-3">
            <img src={anhliem} alt="Seller Avatar" className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
            <div>
              <div className="fw-bold">{sellerInfo.userName}</div>
              <div className="text-muted">
                <span className="text-warning">⭐</span> {sellerInfo.averageScore} ({sellerInfo.numReviews} reviews)
              </div>
            </div>
          </div>
        )}
        <div className="d-flex justify-content-between mb-3">
          <button onClick={handlePhoneClick} className={`btn btn-success w-100 me-1 ${styles.phoneNumberButton}`}>{phoneNumber}</button> {/* Apply phoneNumberButton style */}
          <button onClick={handleChatClick} className="btn btn-primary w-50 ms-1">Chat</button>
        </div>
        <button onClick={handleExchangeClick} className="btn btn-info w-100">Exchange</button>
      </div>
    </>
  );
};

export default ProductPage;
