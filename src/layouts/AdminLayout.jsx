// src/layouts/AdminLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import AdminSideBar from "../components/admin/AdminSideBar";
 // ⚠️ sans Tailwind

const getUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user;
};

const AdminLayout = () => {
  const token = localStorage.getItem("CC_Token");
  const user = getUser();

  if (token && user?.role === "admin") {
    return (
      <div  style={{ display: "flex" }}>
        <AdminSideBar />
        <div style={{ flexGrow: 1, padding: "20px", marginTop: "80px" }}>
          <Outlet />
        </div>
      </div>
    );
  }

  return <Navigate to="/login" />;
};

export default AdminLayout;
