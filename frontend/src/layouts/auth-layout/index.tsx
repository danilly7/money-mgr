import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="bg-slate-200 min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;