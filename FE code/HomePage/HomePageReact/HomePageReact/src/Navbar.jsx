const Navbar = () => {
    const handleLinkClick = (e, path) => {
      e.preventDefault();
      // Thực hiện logic xử lý khi click vào liên kết
      console.log(`Đã click vào liên kết "${path}"`);
    };
  
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#" onClick={(e) => handleLinkClick(e, 'home')}>
            Home
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'category')}
                >
                  Category
                </a>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'login')}
                >
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'signup')}
                >
                  Sign up
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;