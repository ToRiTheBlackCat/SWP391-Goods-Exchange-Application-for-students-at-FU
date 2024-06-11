import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Thêm ref cho dropdown

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('userName');
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, [username]);

  useEffect(() => {
    // Đăng ký sự kiện click bên ngoài dropdown
    document.addEventListener('mousedown', handleClickOutsideDropdown);
    return () => {
      // Hủy đăng ký sự kiện khi component bị unmount
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, []);

  const handleClickOutsideDropdown = (event) => {
    // Kiểm tra xem phần tử bấm vào có phải là dropdown hay không
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); // Nếu không phải, ẩn dropdown
    }
  };

  const handleLogout = () => {
    // Xóa thông tin đăng nhập từ localStorage
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
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`} 
                to="/category"
              >
                Category
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.active : ''}`} 
                to="/create-product"
              >
                Create product
              </NavLink>
            </li>
          </ul>
          <form className="d-flex me-2">
            <input className={`form-control me-2 ${styles.formControl}`} type="search" placeholder="Search" aria-label="Search" />
            <button className={`btn btn-primary ${styles.btnPrimary}`} type="submit">Search</button>
          </form>
          <div className="navbar-nav">
            <div ref={dropdownRef}> {/* Thêm ref vào dropdown */}
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
                      <NavLink className={`dropdown-item ${styles.dropdownItem}`} to="/products">
                        View products
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className={`dropdown-item ${styles.dropdownItem}`} to="/products">
                        View exchange list
                      </NavLink>
                    </li>
                    <li><hr className={`dropdown-divider ${styles.dropdownDivider}`} />
                    </li>
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
