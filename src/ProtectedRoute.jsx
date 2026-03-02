import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
  const token = localStorage.getItem("CC_Token");
  const user = JSON.parse(localStorage.getItem("user"));

  return token && user?.role === "admin"
    ? <Outlet />
    : <Navigate to="/homes" replace />;
};

export default ProtectedRoutes;
