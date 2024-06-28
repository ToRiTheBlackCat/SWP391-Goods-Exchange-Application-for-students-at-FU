import { useState } from 'react';
import styles from '../styles/SignUpForm.module.css';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../authorized/axiosInstance'; // Import axiosInstance
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    gender: '',
    dateOfBirth: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email format. Please enter a valid email.");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      toast.error("Invalid phone number format. Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = {
      email: formData.email,
      password: formData.password,
      userName: formData.username,
      phoneNumber: formData.phone,
      address: formData.address,
      gender: formData.gender === 'male',
      dob: formData.dateOfBirth // Directly assign the date string
    };
    console.log(data);

    try {
      const response = await axiosInstance.post('/api/User/Create-Customer-Account', data);
      console.log(response);
      toast.success('Registration successful! Redirecting to login page...');
      // Navigate to the login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
        console.error('There was an error!', error);
        toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.signUpController}>
      <ToastContainer /> {/* Add ToastContainer for displaying toasts */}
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
            pattern="[0-9]{10}"
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
        <div className={styles.inputGroup}>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <button className={styles.registerBtn} type="submit">Sign up</button>
      </form>
      <div className={styles.loginLink}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default SignUpForm;
