import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; // Import FontAwesome
import styles from '../styles/Login.module.css';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Kiểm tra xem có người dùng nào đã đăng nhập không
    if (localStorage.getItem('loggedInUser')) {
      setError('Another account has been logged in. Please log out to log in this account');
      return;
    }
  
    try {
      const response = await axiosInstance.post(
        '/user/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        }
      );
      if (response.status === 200) {
        setMessage('Login successfully');
        const userData = {
          token: response.data.token,
          userId: response.data.userId,
          userName: response.data.userName,
          role: response.data.role
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        const expirationTime = new Date().getTime() + 30 * 60 * 1000; 
        localStorage.setItem('expirationTime', expirationTime);
  
        if (response.data.role === 'mod') {
          navigate('/mod');
        } else if (response.data.role === 'admin') {
          navigate('/ad');
        } else {
          navigate('/');
        }
        setError('');
      } else if (response.status === 401) {
        setError('Wrong password or email');
      }
    } catch (error) {
      setError('Login failed. Please check your email or password');
    }
  };
  
  const handleGoogleLoginSuccess = async (response) => {
    const credential = response.credential;
    console.log(credential);

    // Kiểm tra xem có người dùng nào đã đăng nhập không
    if (localStorage.getItem('loggedInUser')) {
      setError('Một tài khoản đã đăng nhập. Vui lòng đăng xuất trước khi đăng nhập tài khoản khác.');
      return;
    }
  
    try {
      const googleResponse = await axiosInstance.post(
        '/api/user/google-login',
        credential,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        }
      );
      console.log(googleResponse.data);
      console.log(googleResponse.status);
      if (googleResponse.status === 200) {
        setMessage('Login successfully');
        const token = googleResponse.data.token;
        const userId = googleResponse.data.userId;
        const userName = googleResponse.data.userName;
        const role = googleResponse.data.role;

        // Reset localStorage and state
        const loggedInUser = {
          token,
          userId,
          userName,
          role
        };
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        const expirationTime = new Date().getTime() + 30 * 60 * 1000; 
        localStorage.setItem('expirationTime', expirationTime);
  
        if (googleResponse.data.role === 'mod') {
          navigate('/mod');
        } else if (googleResponse.data.role === 'admin') {
          navigate('/ad');
        } else {
          navigate('/');
        }
        setError('');
      } else {
        setError('Login with Google failed');
      }
    } catch (error) {
      setError('Login with Google failed');
    }
  };

  const handleGoogleLoginFailure = () => {
    setError('Google login was unsuccessful. Try again later.');
  };

  return (
    <GoogleOAuthProvider clientId="772199190262-b8is9j98ov5ijnoo6bk05afurkfd0o8n.apps.googleusercontent.com">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className={styles.loginContainer}>
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className={`mb-3 input-group ${styles.inputGroup}`}>
                  <span className={`input-group-text ${styles.inputIcon}`}><i className="fa fa-user"></i></span>
                  <input
                    type="text"
                    className={`form-control ${styles.inputField}`}
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={`mb-3 input-group ${styles.inputGroup}`}>
                  <span className={`input-group-text ${styles.inputIcon}`}><i className="fa fa-lock"></i></span>
                  <input
                    type="password"
                    className={`form-control ${styles.inputField}`}
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className={`btn btn-primary ${styles.btnSmall}`}>Login</button>
                </div>
                <div className="d-flex justify-content-center mt-2">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                    useOneTap
                    className={`btn btn-info mt-2 ${styles.btnSmall}`}
                  />
                </div>
              </form>
              {error && <p className="text-danger mt-3">{error}</p>}
              {message && <p className="text-success mt-3">{message}</p>}
              <div className="d-flex justify-content-between mt-3">
                <a href="/forgot-password" className={styles.textDecorationNone}>Forgot password?</a>
                <a href="/signup" className={styles.textDecorationNone}>Sign up a new account</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
