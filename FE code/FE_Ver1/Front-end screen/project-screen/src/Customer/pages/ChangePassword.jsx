import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/ChangePassword.module.css'; // Import the CSS file

const ChangePassword = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();  

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/api/User/UserResetPassword', {
        email: email,
        resetCode: otp,
        password: newPassword,
      });

      if (response.data) {
        setMessage('Password has been successfully changed.');
        setTimeout(() => navigate('/login'), 2000);
        setError('');
        setOtp('');
        setEmail('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response) {
        setError(`Failed to change password. Server responded with: ${error.response.data}`);
      } else {
        setError('Failed to change password. Please try again.');
      }
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-5">
              <div className="card-body">
                <h3 className="card-title text-center">Change Password</h3>
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="otp">Your OTP:</label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      className="form-control"
                      placeholder="Your OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-password">New password:</label>
                    <input
                      type="password"
                      id="new-password"
                      name="new-password"
                      className="form-control"
                      placeholder="Required to enter password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm-new-password">Confirm new password:</label>
                    <input
                      type="password"
                      id="confirm-new-password"
                      name="confirm-new-password"
                      className="form-control"
                      placeholder="Required to enter password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  {message && <div className="alert alert-success">{message}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}
                  <button type="submit" className="btn btn-primary btn-block mt-3" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
