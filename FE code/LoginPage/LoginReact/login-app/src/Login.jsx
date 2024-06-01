import { useState } from 'react';
// import {useNavigate} from 'react-router-dom';
import './Login.css';
import user from './img/th.jpg';
import passwordPic from './img/th (1).jpg';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMassage] = useState('');
  // const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMassage('');

    try{
      const response = await axios.post('http://localhost:5299/user/login',{
          email: email,
          password: password
    },{
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if(response.status===200){
      setMassage('Logged in successfully');
      console.log('Login success: ',response.data);
      // navigate('/home');
    }
      }catch(error){
        console.log('Login error: ', error);
        setError('Login failed. Please check your email and password');
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
      {error && <p className='error'>{error}</p>}
      {message && <p className='message'>{message}</p>}

      <a href="/forgot-password">Forgot password?</a> | <a href="/signup">Register a new account</a>
    </div>
  );
};

export default Login;