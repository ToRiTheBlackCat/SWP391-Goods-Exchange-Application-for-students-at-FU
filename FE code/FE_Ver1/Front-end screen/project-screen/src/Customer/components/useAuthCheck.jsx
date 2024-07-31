import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // const user = localStorage.getItem('loggedInUser');
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    const interval = setInterval(() => {
      // const user = localStorage.getItem('loggedInUser');
      const token = localStorage.getItem('token');
      const expirationTime = localStorage.getItem('expirationTime');

      // Chỉ kiểm tra nếu token và expirationTime tồn tại và nếu người dùng đã đăng nhập
      if (isLoggedIn && token && expirationTime) {
        if (new Date().getTime() > expirationTime) {
          localStorage.clear(); 
          setIsLoggedIn(false);
          setIsLoggedIn(false);
          if (window.confirm('Your session has expired. Click OK to log in again.')) {
            navigate('/login');
          } else {
            navigate('/login');
          }
        }
      }
    },1440 * 10 * 60000); 

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [navigate, isLoggedIn]);

  return { setIsLoggedIn };
};

export default useAuthCheck;
