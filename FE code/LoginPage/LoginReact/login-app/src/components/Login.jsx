import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css';
import user from './img/th.jpg';
import passwordPic from './img/th (1).jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5299/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Chuyển hướng sang trang HomePage sau khi đăng nhập thành công
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to login. Please check your email and password.');
    }
  };

  return (
    <div className="login-container">
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <img src={user} alt="" />
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <img src={passwordPic} alt="" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
        <button className="google" type="button">Login with email</button>
      </form>
      {error && <div className="error-message">{error}</div>}

      <a href="/forgot-password">Forgot password?</a> | <a href="/signup">Register a new account</a>
    </div>
  );
};

export default Login;
