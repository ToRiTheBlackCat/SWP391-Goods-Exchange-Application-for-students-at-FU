
import { Navigate } from 'react-router-dom';

// Đây là HOC với logic kiểm tra quyền truy cập
const withRole = (WrappedComponent, allowedRoles) => {
  const WithRoleComponent = (props) => {
    const role = localStorage.getItem('userRole');

    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" />;  // Nếu người dùng không có quyền, điều hướng về trang chủ
    }

    return <WrappedComponent {...props} />;  // Nếu người dùng có quyền, render component được bọc
  };

  WithRoleComponent.displayName = `WithRole(${getDisplayName(WrappedComponent)})`;

  return WithRoleComponent;
};

// Hàm để lấy tên hiển thị của component
const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default withRole;
