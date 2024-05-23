import { useState } from 'react';
import './Login.css';
import user from './img/th.jpg';
import passwordPic from './img/th (1).jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className="login-container">
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <img src={user} alt="" />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

      <a href="/forgot-password">Forgot password?</a> | <a href="/signup">Register a new account</a>
    </div>
  );
};

export default Login;
