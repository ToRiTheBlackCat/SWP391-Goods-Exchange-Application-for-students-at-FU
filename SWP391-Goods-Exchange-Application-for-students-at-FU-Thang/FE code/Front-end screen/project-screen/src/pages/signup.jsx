import { useState } from 'react';
import styles from '../styles/SignUpForm.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    gender: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Chuẩn bị dữ liệu cho API
    const data = {
      userName: formData.username,
      email: formData.email,
      passWORD: formData.password,
      phoneNumber: formData.phone,
      address: formData.address
    };

    // Gọi API với Axios
    axios.post('https://your-api-endpoint.com/api/User/Create-Customer-Account', data)
      .then(response => {
        console.log('Success:', response.data);
        // Điều hướng sau khi đăng ký thành công (nếu cần)
        // navigate('/success-page');
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div className={styles.signUpController}>
      <h2>Register account</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className={styles.checkbox}>
          <label>Gender</label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === 'male'}
            onChange={handleChange}
            required
          />
          Male
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === 'female'}
            onChange={handleChange}
            required
          />
          Female
        </div>
        <button className={styles.registerBtn} type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
