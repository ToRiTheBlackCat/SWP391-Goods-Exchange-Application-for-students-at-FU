import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstance
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import anhliem from '../assets/user.jpg';
import styles from '../styles/ProductPage.module.css'; // Import CSS module
import { setProductToExchange, setSelectedProduct } from '../store/store'; // Updated to setSelectedProduct

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [error, setError] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/Product/Student/ViewProductDetailWithId/${id}`);
        console.log(response.data);
        const productData = response.data;
        setProduct(productData);
        setSellerInfo(productData.productOwner);

        // Fetch product image
        const imageResponse = await axiosInstance.get(`/api/Product/GetUserImage?imageName=${productData.productImage}`);

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
        productData.imageSrc = imgSrc;

      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product.');
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleExchangeClick = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user.userId;
    if (userId) {
      dispatch(setProductToExchange(product));
      navigate('/choose-product');
    } else {
      toast.error("Please log in first to perform this action");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleChatClick = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user.userId;
    if (userId) {
      dispatch(setSelectedProduct(product));
      const queryParams = new URLSearchParams({
        user: sellerInfo.userName,
        productID: product.productId,
        productName: product.productName
      }).toString();
      navigate(`/chat?${queryParams}`, { state: { sellerInfo: sellerInfo.userName } });
    } else {
      toast.error("Please log in first to perform this action");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleReportClick = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user.userId;
    if (userId) {
      dispatch(setSelectedProduct(product));
      navigate('/report');
    } else {
      toast.error("Please log in first to perform this action");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleProfileClick = () => {
    navigate('/other-profile', { state: { userId: product.userId } });
    console.log(product.userId);
  };
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const currentUser = localStorage.getItem('userName');

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
            <div>
              {sellerInfo && currentUser !== sellerInfo.userName && (
                <button onClick={handleReportClick} className="btn btn-info w-100">Report</button>
              )}
            </div>
          </div>
        </div>
      </div>
      {sellerInfo && currentUser !== sellerInfo.userName && (
        <div className="position-fixed top-0 end-0 p-3 bg-light border rounded mt-5 me-3">
          <div className="d-flex align-items-center mb-3">
            <img src={anhliem} alt="Seller Avatar" className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
            <div>
              <div className="fw-bold">{sellerInfo.userName}</div>
              <div className="text-muted">
                <span className="text-warning">{sellerInfo.averageScore} ⭐</span>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <button onClick={handleProfileClick} className={`btn btn-success w-100 me-1 ${styles.phoneNumberButton}`}>View profile</button> {/* Apply phoneNumberButton style */}
            <button onClick={handleChatClick} className="btn btn-primary w-50 ms-1">Chat</button>
          </div>
          <button onClick={handleExchangeClick} className="btn btn-info w-100">Exchange</button>
        </div>
      )}
    </>
  );
};

export default ProductPage;
