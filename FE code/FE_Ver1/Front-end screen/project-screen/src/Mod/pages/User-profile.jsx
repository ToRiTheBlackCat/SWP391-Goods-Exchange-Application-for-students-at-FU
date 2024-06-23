import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import styles from '../styles/User-profile.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import user from '../assets/user.jpg';
import axiosInstance from '../../authorized/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserInformation() {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    birthday: '',
    address: '',
    gender: '',
  });
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBanUser = () => {
    axiosInstance.post(`/api/User/Mod/BanAccount/${userId}`)
      .then(response => {
        toast.success('User has been banned successfully');
        setTimeout(() => {
          navigate('/mod'); // Điều hướng về trang danh sách sản phẩm hoặc trang mong muốn
        }, 2000); // Delay navigation to give the toast time to show
      })
      .catch(error => {
        console.error('There was an error banning the user!', error);
        toast.error('Failed to ban the user');
      });
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className={`card p-4 ${styles.profileCard}`}>
          <div className="text-center mb-4">
            <img src={user} alt="User Avatar" className={`rounded-circle ${styles.avatar}`} />
            <p className={styles.username}>{username}</p>
          </div>
          <form>
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
                readOnly
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
                readOnly
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
                readOnly
              />
            </div>
            <button type="button" className="btn btn-danger w-100" onClick={handleBanUser}>Ban User</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserInformation;
