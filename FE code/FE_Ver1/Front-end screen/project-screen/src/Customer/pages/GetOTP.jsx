import { useState } from 'react';
import styles from '../styles/GetOTP.module.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleChangePassword = async () => {
    try {
      const response = await axiosInstance.post(`/api/User/UserForgotPassword?emailAddress=${encodeURIComponent(email)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        // Handle successful response
        setMessage('OTP has been sent to your email. Please check your inbox.');
        setError('');

        // Delay navigation to allow the user to see the success message
        setTimeout(() => {
          navigate('/change-password');
        }, 3000); // Adjust the delay time as needed
      }
    } catch (error) {
      // Handle error response
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
      setMessage('');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <h1>Forgot password?</h1>
      <p>Change your password using the following steps</p>
      <ol>
        <li>Enter your email address.</li>
        <li>Our system will send the OTP code to your email.</li>
        <li>Enter OTP for verification.</li>
      </ol>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      />
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.buttonGroup}>
        <button className={styles.btnNewPassword} type="button" onClick={handleChangePassword}>
          CHANGE PASSWORD
        </button>
        <button className={styles.btnReturnLogin} type="button" onClick={handleBackToLogin}>
          BACK TO LOGIN PAGE
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
