
import './GetOTP.css';

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <h1>Forgot password?</h1>
      <p>Change your password using the following steps</p>
      <ol>
        <li>Enter your email address.</li>
        <li>Our system will send the OTP code to your email.</li>
        <li>Enter OTP for verification.</li>
      </ol>
      <input type="email" placeholder="Enter your email" />
      <div className="button-group">
        <button className="btn-new-password" type="submit">CONFIRM OTP</button>
        <button className="btn-return-login" type="submit">BACK LOGIN PAGE</button>
      </div>
    </div>
  );
}

export default ForgotPassword;
