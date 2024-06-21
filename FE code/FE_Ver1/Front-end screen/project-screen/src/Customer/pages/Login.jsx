import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/Login.module.css'; 

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

    try {
      const response = await axios.post(
        'https://localhost:7027/user/login',
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
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('role', response.data.role);

        if (response.data.role === 'mod') {
          navigate('/mod');
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

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className={styles.loginContainer}>
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 input-group">
                <span className="input-group-text" id="basic-addon1">@</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  aria-label="Email"
                  aria-describedby="basic-addon1"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 input-group">
                <span className="input-group-text" id="basic-addon2">🔒</span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon2"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={`btn btn-primary w-100 ${styles.btnSmall}`}>Login</button>
              <button type="button" className={`btn btn-info w-100 mt-2 ${styles.btnSmall}`}>Login with Google</button>
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
  );
};

export default Login;
