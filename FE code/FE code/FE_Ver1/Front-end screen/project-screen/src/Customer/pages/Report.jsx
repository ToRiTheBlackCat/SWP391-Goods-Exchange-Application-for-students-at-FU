import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../authorized/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import styles from '../styles/ReportProduct.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReportProduct = () => {
  const navigate = useNavigate();
  const product = useSelector((state) => state.product.selectedProduct);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const userId = localStorage.getItem('userId');

    const reportData = {
      userId: parseInt(userId, 10),
      productId: product.productId,
      detail: reason,
      reportDate: new Date().toISOString(),
    };

    try {
      const response = await axiosInstance.post(
        '/api/Report/Student/CreateReport',
        reportData,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        }
      );
      if (response.status === 200) {
        toast.success('Chúng tôi sẽ xử lý báo cáo của bạn', {
          onClose: () => navigate('/'), // Redirect to home after the toast is closed
          autoClose: 2000, // Close the toast after 2 seconds
        });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setError('Failed to submit report. Please try again.');
    }
  };

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className={styles.reportContainer}>
              <h2 className="text-center mb-4">Report Product</h2>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-text">{product.productDescription}</p>
                  <p className="card-text"><strong>Price:</strong> ${product.productPrice.toLocaleString()}</p>
                  {product.productImage && (
                    <img src={product.imageSrc} alt={product.productName} className="img-thumbnail" />
                  )}
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="reason" className="form-label">Reason for report</label>
                  <textarea
                    id="reason"
                    name="reason"
                    className="form-control"
                    rows="4"
                    value={reason}
                    onChange={handleReasonChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-danger w-100">Submit Report</button>
              </form>
              {error && <p className="text-danger mt-3">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportProduct;
