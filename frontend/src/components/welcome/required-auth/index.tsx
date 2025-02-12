import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";

const RequireAuth = () => {
  const { currentUser } = useAuth();//usuario desde el contexto

  if (!currentUser) {
    return <Navigate to="/welcome/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;