import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import styles from '../styles/ProductPage.module.css';
import Navbar from '../components/Navbar';
import anhliem from '../assets/anhliem.jpg';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('Phone');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Sử dụng useNavigate

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5299/api/Product/Student/ViewProductDetailWithId/${id}`);
        setProduct(response.data);
        setSellerInfo(response.data.productOwner);
        setPhoneNumber(response.data.productOwner.phone);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product.');
      }
    };

    fetchProduct();
  }, [id]);
  
  // Xử lý khi bấm vào nút Phone
  const handlePhoneClick = () => {
    // Hiển thị số điện thoại của người bán (nếu có)
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
    navigate('/choose-product'); // Điều hướng đến trang ChooseProduct
  };
  const handleChatClick = () => {
    // Thực hiện các hành động khi bấm vào nút Chat
  };

  return (
    <>
      <Navbar />
      <div className={`${styles.module_container} mt-5`}>
        <div className={styles.module_product}>
          <h1 className="display-4">{product.productName}</h1>
          <p className={`${styles.module_price} text-danger`}>Price: {product.productPrice.toLocaleString()} VND</p>
          <div className={`${styles.module_gallery} text-center`}>
            <img src={product.productImage} className="img-fluid" alt={product.productName} />
          </div>
          <div className={`${styles.module_details} mt-4`}>
            <h2 className="h4">Detailed description</h2>
            <p>{product.productDescription}</p>
          </div>
        </div>
        <div className={`${styles.module_chatBox} position-fixed`}>
          {sellerInfo && (
            <div className={`${styles.module_userInfo} d-flex align-items-center mb-3`}>
            <img src={anhliem} alt="Seller Avatar" className={styles.module_userAvatar} />
              <div>
                <div className={styles.module_userName}>{sellerInfo.userName}</div>
                <div className={styles.module_userRating}>
                  <span className="star">⭐</span> {sellerInfo.averageScore} ({sellerInfo.numReviews} reviews)
                </div>
              </div>
            </div>
          )}
          <div className={`${styles.module_chatButtons} d-flex justify-content-between mb-3`}>
            <button onClick={handlePhoneClick} className={`${styles.module_callButton} btn-success w-50 mr-1`}>{phoneNumber}</button>
            <button onClick={handleChatClick} className={`${styles.module_chatButton} btn-primary w-50 ml-1`}>Chat</button>
          </div>
          <div className={styles.module_chatInputs}>
            <button onClick={handleExchangeClick} className={`${styles.module_exchangeBtn} btn-info w-100`}>Exchange</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
