import { Outlet } from "react-router-dom";

const AuthLayout = () => { //esto es para el login y register solo
  return (
    <Outlet />
  );
};

export default AuthLayout;