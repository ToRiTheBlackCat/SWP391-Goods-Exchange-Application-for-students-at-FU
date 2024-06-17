
import styles from '../styles/GetOTP.module.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const handleBackToLogin = () =>{
    navigate('/login');
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
      <input type="email" placeholder="Enter your email" />
      <div className={styles.buttonGroup}>
        <button className={styles.btnNewPassword} type="submit">CONFIRM OTP</button>
        <button className={styles.btnReturnLogin} type="button" onClick={handleBackToLogin}>BACK TO LOGIN PAGE</button>
      </div>
    </div>
  );
}

export default ForgotPassword;