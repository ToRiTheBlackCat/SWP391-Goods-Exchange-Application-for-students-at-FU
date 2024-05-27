import  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function ChangePassword() {
  const [username, setUsername] = useState('YourUsername'); // Replace with dynamic username if needed
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    // Handle password change logic here
    alert("Password changed successfully");
  };

  return (
    <div className="password-change-container container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Your username:</label>
          <input type="text" id="username" name="username" className="form-control" value={username} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="new-password">New password:</label>
          <input 
            type="password" 
            id="new-password" 
            name="new-password" 
            className="form-control" 
            placeholder="Required to enter password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-new-password">Confirm new password:</label>
          <input 
            type="password" 
            id="confirm-new-password" 
            name="confirm-new-password" 
            className="form-control" 
            placeholder="Required to enter password" 
            value={confirmNewPassword} 
            onChange={(e) => setConfirmNewPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary btn-save">Save</button>
      </form>
    </div>
  );
}

export default ChangePassword;
