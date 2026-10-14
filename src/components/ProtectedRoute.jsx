import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn, getUserRole } from "../utils/auth";

function ProtectedRoute({ allowedRole }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();

  if (allowedRole && role !== allowedRole) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "TRAINER") {
      return <Navigate to="/trainer" replace />;
    }

    if (role === "MEMBER") {
      return <Navigate to="/member" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;