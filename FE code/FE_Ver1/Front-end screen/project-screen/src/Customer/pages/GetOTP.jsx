import { useState } from 'react';
import styles from '../styles/GetOTP.module.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import getotpImage from '../assets/getotp.jpg';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/api/User/UserForgotPassword?emailAddress=${encodeURIComponent(email)}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setMessage('OTP has been sent to your email. Please check your inbox.');
        setError('');

        // Delay navigation to allow the user to see the success message
        setTimeout(() => {
          navigate('/change-password');
        }, 3000); // Adjust the delay time as needed
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className={styles.pageContainer} style={{ backgroundImage: `url(${getotpImage})` }}>
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
          aria-label="Enter your email"
        />
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.buttonGroup}>
          <button
            className={styles.btnNewPassword}
            type="button"
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? 'SENDING...' : 'CHANGE PASSWORD'}
          </button>
          <button className={styles.btnReturnLogin} type="button" onClick={handleBackToLogin}>
            BACK TO LOGIN PAGE
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
