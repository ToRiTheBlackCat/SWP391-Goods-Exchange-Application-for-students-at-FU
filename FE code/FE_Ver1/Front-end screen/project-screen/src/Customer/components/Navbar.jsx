import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import styles from '../styles/Navbar.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import useSignalRNotifications from './SignalRProvider';

const Navbar = ({ onHomeClick, searchTerm, setSearchTerm, onSearchSubmit }) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownNotification, setIsDropdownNotification] = useState(false);
  const [activeLink, setActiveLink] = useState();
  const notifications = useSignalRNotifications();
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
  }, [notifications, navigate]);

  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDropdown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownNotification = () => {
    setIsDropdownNotification(!isDropdownNotification);
  };

  const handleSearchChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(inputValue);
    if (inputValue.trim() !== '') {
      onSearchSubmit(); // Trigger search submit action
      navigate(`/?search=${inputValue}`);
    } else {
      navigate('/');
      onHomeClick();
    }
  };

  const handleHomeClick = () => {
    setInputValue(''); // Clear the search term
    onHomeClick(); // Call the reset function passed from HomePage
  };

  const handleProtectedClick = (path, linkname) => {
    if (isLoggedIn) {
      setActiveLink(linkname);
      navigate(path);
    } else {
      toast.error('Please log in first to access this page');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${styles.navbar}`}>
        <div className="container-fluid" style={{ padding: '0px' }}>
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
                  to="/"
                  onClick={handleHomeClick}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <button
                  className={`btn btn-link nav-link ${styles.navLink} ${activeLink === 'create-product' ? styles.active : ''}`}
                  onClick={() => handleProtectedClick('/create-product', 'create-product')}
                >
                  Create Product
                </button>
              </li>
              {/* <li className="nav-item">
                <button
                  className={`btn btn-link nav-link ${styles.navLink} ${activeLink === 'chat' ? styles.active : ''}`}
                  onClick={() => handleProtectedClick('/chat', 'chat')}
                >
                  Chat
                </button>
              </li> */}
              <div ref={dropdownRef}>
                <button
                  className={`btn btn-dark dropdown-toggle ${styles.navLink}`}
                  onClick={handleDropdownNotification}
                >
                  {isLoggedIn ? 'Notification' : null}
                </button>
                <ul className={`dropdown-menu ${styles.dropdownNotification}`} style={{ display: isDropdownNotification ? 'block' : 'none' }}>
                  {isLoggedIn ? (
                    notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <li key={index}>
                          <NavLink className={`dropdown-item ${styles.dropdownItem}`} to={`/chat?user=${encodeURI(notification.user)}&productID=${encodeURI(notification.productID)}&productName=${encodeURI(notification.productName)}`}>
                            <div>{notification.user}</div>
                            <div>{notification.productID}</div>
                            <div>{notification.productName}</div>
                          </NavLink>
                        </li>
                      ))
                    ) : (
                      <li className={`dropdown-item ${styles.dropdownItem}`}>No notifications</li>
                    )
                  ) : null}
                </ul>
              </div>
            </ul>

            <form className="d-flex me-2" onSubmit={handleSearchSubmit}>
              <input
                className={`form-control me-2 ${styles.formControl}`}
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={inputValue}
                onChange={handleSearchChange}
              />
              <button className={`btn btn-primary ${styles.btnPrimary}`} type="submit">Search</button>
            </form>
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
                        <NavLink className={`dropdown-item ${styles.dropdownItem}`} to="/profile">
                          Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className={`dropdown-item ${styles.dropdownItem}`} to="/own-product">
                          Your product
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className={`dropdown-item ${styles.dropdownItem}`} to="/product">
                          View incoming exchanges
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className={`dropdown-item ${styles.dropdownItem}`} to="/exchange-list">
                          View sent exchange list
                        </NavLink>
                      </li>
                      <li><hr className={`dropdown-divider ${styles.dropdownDivider}`} /></li>
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
      <ToastContainer />
    </>
  );
};

Navbar.propTypes = {
  onHomeClick: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
};

export default Navbar;
