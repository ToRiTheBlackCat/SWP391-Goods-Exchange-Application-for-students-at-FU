import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import styles from '../styles/User-profile.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import user from '../assets/user.jpg';

function UserInformation() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    birthday: '',
    address: '',
    gender: '',
  });
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`https://localhost:7027/api/User/user/GetUserInfo/${userId}`)
        .then(response => {
          const data = response.data;
          setFormData({
            email: data.email,
            password: data.password,
            phone: data.phone,
            birthday: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            address: data.address,
            gender: data.gender ? 'Male' : 'Female', // Assuming gender is a boolean
          });
          setUsername(data.userName);
        })
        .catch(error => {
          console.error('There was an error fetching the user data!', error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <>
    <Navbar/>
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className={`card p-4 ${styles.profileCard}`}>
        <div className="text-center mb-4">
          <img src={user} alt="User Avatar" className={`rounded-circle ${styles.avatar}`} />
          <p className={styles.username}>{username}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="text"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="birthday" className="form-label">Birthday</label>
            <input
              type="date"
              className="form-control"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <input
              type="text"
              className="form-control"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Update</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default UserInformation;
