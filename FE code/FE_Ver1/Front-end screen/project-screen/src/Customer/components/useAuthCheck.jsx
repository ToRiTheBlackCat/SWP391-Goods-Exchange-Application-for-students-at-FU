import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      const expirationTime = localStorage.getItem('expirationTime');

      // Chỉ kiểm tra nếu token và expirationTime tồn tại và nếu người dùng đã đăng nhập
      if (isLoggedIn && token && expirationTime) {
        if (new Date().getTime() > expirationTime) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userId');
          localStorage.removeItem('expirationTime'); 
          setIsLoggedIn(false);
          setIsLoggedIn(false);
          if (window.confirm('Your session has expired. Click OK to log in again.')) {
            navigate('/login');
          } else {
            navigate('/login');
          }
        }
      }
    },30 * 10 * 60000); 

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [navigate, isLoggedIn]);

  return { setIsLoggedIn };
};

export default useAuthCheck;
