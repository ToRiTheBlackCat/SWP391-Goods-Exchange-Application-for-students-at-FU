import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from '../styles/OtherProfile.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import user from '../assets/user.jpg';
import axiosInstance from '../../utils/axiosInstance';

function OtherProfile() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    phone: '',
    birthday: '',
    address: '',
    gender: true, // Default to true (Male)
    averageScore: 0,
    comments: [], // Initialize as an empty array
  });
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (userId) {
      axiosInstance.get(`/api/User/user/GetUserInfo/${userId}`)
        .then(response => {
          const data = response.data;
          setFormData(prevState => ({
            ...prevState,
            userName: data.userName || '',
            email: data.email || '',
            password: data.password || '',
            phone: data.phone || '',
            birthday: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            address: data.address || '',
            gender: data.gender !== undefined ? data.gender : true, // Assuming gender is boolean
            averageScore: data.averageScore,
          }));
        })
        .catch(error => {
          console.error('There was an error fetching the user data!', error);
        });

      axiosInstance.get(`/api/User/GetAllRatingAndComment/${userId}`)
        .then(response => {
          const data = response.data;
          setFormData(prevState => ({
            ...prevState,
            comments: data,
          }));
        })
        .catch(error => {
          console.error('There was an error fetching the ratings and comments!', error);
        });
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className={`container`}>
        <div className="d-flex justify-content-center align-items-center">
          <div className={`card p-4 ${styles.profileCard}`}>
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
                readOnly
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
            <div className={`mb-3 ${styles.ratingComments}`}>
              <div className={styles.rating}>
                <label htmlFor="rating" className="form-label">Rating</label>
                <div id="rating">{formData.averageScore}/5</div>
              </div>
              <div className={styles.comments}>
                <label htmlFor="comments" className="form-label">Comments</label>
                <div id="comments">
                  {formData.comments.map((comment, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>{comment.score}/5</div>
                          <div>{new Date(comment.ratingDate).toLocaleDateString()}</div>
                        </div>
                        <p className="card-text">{comment.comment}</p>
                        <p className="text-muted">{comment.raterName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OtherProfile;
