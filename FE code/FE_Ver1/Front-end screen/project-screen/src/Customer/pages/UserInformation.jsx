import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import styles from '../styles/UserInformation.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import user from '../assets/user.jpg';
import axiosInstance from '../../authorized/axiosInstance';

function UserInformation() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    phone: '',
    birthday: '',
    address: '',
    gender: true, // Default to true (Male)
  });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      axiosInstance.get(`/api/User/user/GetUserInfo/${userId}`)
        .then(response => {
          const data = response.data;
          setFormData({
            userName: data.userName || '',
            email: data.email || '',
            password: data.password || '',
            phone: data.phone || '',
            birthday: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            address: data.address || '',
            gender: data.gender !== undefined ? data.gender : true, // Assuming gender is boolean
          });
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

  const handleGenderChange = (e) => {
    const genderValue = e.target.value === 'true';
    setFormData({ ...formData, gender: genderValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);

    const [year, month, day] = formData.birthday.split('-');
    const gender = formData.gender === true;
    const dob = `${year}-${month}-${day}`; // Format the dob as "YYYY-MM-DD"

    const updateData = {
      userName: formData.userName,
      gender: gender,
      dob: dob,
      address: formData.address,
    };

    console.log('Data being sent:', updateData);

    if (userId) {
      axiosInstance.put(`/api/User/user/UpdateUserInfo/${userId}`, updateData)
        .then(response => {
          if (response.status === 200) {
            console.log('User information updated successfully!');
            toast.success('User information updated successfully!');
            setFormData(updateData); // Update the form with the new data
          }
        })
        .catch(error => {
          console.error('There was an error updating the user information!', error);
          toast.error('There was an error updating the user information.');
        });
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className={`card p-4 ${styles.profileCard}`}>
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <img src={user} alt="User Avatar" className={`rounded-circle ${styles.avatar}`} />
              <p className={styles.username}>{formData.userName}</p>
            </div>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
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
                onChange={handleChange}
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
              <label className="form-label">Gender</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value={true}
                    checked={formData.gender === true}
                    onChange={handleGenderChange}
                  />
                  <label className="form-check-label" htmlFor="male">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value={false}
                    checked={formData.gender === false}
                    onChange={handleGenderChange}
                  />
                  <label className="form-check-label" htmlFor="female">Female</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100">Update</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default UserInformation;
