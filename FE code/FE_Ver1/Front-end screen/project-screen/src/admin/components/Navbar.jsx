import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/Navbar.module.css';

const Navbar = ({ onHomeClick, searchTerm, setSearchTerm, onSearchSubmit }) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user && user.token) {
      setIsLoggedIn(true);
      setUsername(user.userName);
    }

    // Lắng nghe sự thay đổi trong localStorage
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (!updatedUser || !updatedUser.token) {
        setIsLoggedIn(false);
        setUsername('');
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideDropdown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, []);

  const handleClickOutsideDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleHomeClick = () => {
    setInputValue(''); // Clear the search term
    onHomeClick(); // Call the reset function passed from ADPage
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${styles.form}`}>
      <div className="container-fluid">
        <button
          className={`navbar-toggler ${styles.navbarToggler}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className={`navbar-toggler-icon ${styles.navbarTogglerIcon}`}></span>
        </button>
        <div className={`collapse navbar-collapse ${styles.navbarCollapse}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`}
                to="/ad"
                onClick={handleHomeClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`}
                to='/manage-account'
              >
                Manage Account
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`}
                to="/manage-exchange"
              >
                View Exchange
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`}
                to="/dashboard"
              >
                Dashboard
              </NavLink>
            </li>
          </ul>
          <div className="navbar-nav">
            <div ref={dropdownRef}>
              <button
                className={`btn btn-dark dropdown-toggle ${styles.navLink}`}
                onClick={handleDropdownToggle}
              >
                {isLoggedIn ? username : 'Account'}
              </button>
              <ul className={`dropdown-menu ${styles.dropdownMenu}`} style={{ display: isDropdownOpen ? 'block' : 'none' }}>
                {isLoggedIn ? (
                  <>
                    <li>
                      <button
                        className={`dropdown-item ${styles.dropdownItem}`}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <NavLink className={`dropdown-item ${styles.dropdownItem}`} to="/login">
                        Login
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className={`dropdown-item ${styles.dropdownItem}`} to="/signup">
                        Sign up
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
