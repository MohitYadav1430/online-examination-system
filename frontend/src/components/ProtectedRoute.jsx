import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // Check Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check User Role
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // Render children or nested routes
  return children ? children : <Outlet />;
}

export default ProtectedRoute;