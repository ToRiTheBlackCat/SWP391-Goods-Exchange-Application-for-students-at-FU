import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('userName');
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, [username]);

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
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/mod/?search=${searchTerm}`);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${styles.navbar}`}>
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
                to="/mod"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`} 
                to="/waiting-product"
              >
                View waiting product
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`} 
                to="/report-list"
              >
                View report list
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`} 
                to="/view-banned-user"
              >
                View banned users
              </NavLink>  
            </li>
          </ul>
          <form className="d-flex me-2" onSubmit={handleSearchSubmit}>
            <input 
              className={`form-control me-2 ${styles.formControl}`} 
              type="search" 
              placeholder="Search" 
              aria-label="Search" 
              value={searchTerm}
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
