import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from '../styles/OtherProfile.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import user from '../assets/user.jpg';
import axiosInstance from '../../utils/axiosInstance';
import StarRatings from 'react-star-ratings';

function OtherProfile() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
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
      <div className={styles.profilePage}>
        <div className={styles.container}>
          <div className={`card ${styles.profileCard}`}>
            <div className="text-center mb-3">
              <img src={user} alt="User Avatar" className={`rounded-circle ${styles.avatar}`} />
              <p className={styles.username}>{formData.userName}</p>
            </div>
            <div className="mb-2">
              <strong htmlFor="userName" className="form-label">Username</strong>
              <div id="userName" className="form-control-plaintext">{formData.userName}</div>
            </div>
            <div className="mb-2">
              <strong htmlFor="email" className="form-label">Email</strong>
              <div id="email" className="form-control-plaintext">{formData.email}</div>
            </div>
            <div className="mb-2">
              <strong htmlFor="phone" className="form-label">Phone</strong>
              <div id="phone" className="form-control-plaintext">{formData.phone}</div>
            </div>
            <div className="mb-2">
              <strong htmlFor="birthday" className="form-label">Birthday</strong>
              <div id="birthday" className="form-control-plaintext">{formData.birthday}</div>
            </div>
            <div className="mb-2">
              <strong htmlFor="address" className="form-label">Address</strong>
              <div id="address" className="form-control-plaintext">{formData.address}</div>
            </div>
            <div className={`mb-3 ${styles.ratingComments}`}>
              <div className={styles.rating}>
                <strong htmlFor="rating" className={`form-label ${styles.formLabel}`}><strong>Rating</strong></strong>
                <div id="rating">
                  <StarRatings
                    rating={formData.averageScore}
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name='rating'
                  />
                </div>
              </div>
              <div className={styles.comments}>
                <label htmlFor="comments" className={`form-label ${styles.formLabel}`}><strong>Comments</strong></label>
                <div id="comments">
                  {formData.comments.map((comment, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <StarRatings
                            rating={comment.score}
                            starRatedColor="gold"
                            numberOfStars={5}
                            starDimension="15px"
                            starSpacing="1px"
                            name='commentRating'
                          />
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
