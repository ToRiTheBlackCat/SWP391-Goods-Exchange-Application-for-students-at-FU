import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../authorized/axiosInstance';
import styles from '../styles/ViewBanUser.module.css'; // Import CSS module

function ViewBanUser() {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch banned users list
    const fetchBannedUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/User/Mod/ViewBanAccountList');
        setBannedUsers(response.data);
      } catch (error) {
        console.error('Error fetching banned users:', error);
        setError('Error fetching banned users.');
      }
    };

    fetchBannedUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleUnbanUser = (userId) => {
    axiosInstance.post(`/api/User/Mod/UnbanAccount/${userId}`)
      .then(response => {
        alert('User has been unbanned successfully');
        setBannedUsers(bannedUsers.filter(user => user.userId !== userId));
        setSelectedUser(null);
      })
      .catch(error => {
        console.error('There was an error unbanning the user!', error);
        alert('Failed to unban the user');
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <h2>Banned Users</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {bannedUsers.map((user, index) => (
                  <tr
                    key={user.userId}
                    onClick={() => handleUserClick(user)}
                    className={selectedUser && selectedUser.userId === user.userId ? styles.selectedRow : ''}
                  >
                    <td>{index + 1}</td>
                    <td>{user.userName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h2>User Information</h2>
            {selectedUser ? (
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Username</th>
                      <td>{selectedUser.userName}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{selectedUser.email}</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{selectedUser.phone}</td>
                    </tr>
                    <tr>
                      <th>Gender</th>
                      <td>{selectedUser.gender ? 'Male' : 'Female'}</td>
                    </tr>
                    <tr>
                      <th>Date of Birth</th>
                      <td>{selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>{selectedUser.address || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Average Score</th>
                      <td>{selectedUser.averageScore !== null ? selectedUser.averageScore : 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
                <button
                  className={`btn btn-success w-100 ${styles.unbanButton}`}
                  onClick={() => handleUnbanUser(selectedUser.userId)}
                >
                  Unban User
                </button>
              </div>
            ) : (
              <div>Select a user to view details</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewBanUser;
