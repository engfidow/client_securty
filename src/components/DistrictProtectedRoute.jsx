import { Navigate } from 'react-router-dom';

const DistrictProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if user is logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has admin role

  if (user.role !== 'police') {

    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default DistrictProtectedRoute;

