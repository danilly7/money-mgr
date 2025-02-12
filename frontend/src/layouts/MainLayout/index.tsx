import { Outlet } from "react-router-dom";
import { Header } from "./../../components/ui/header";
import { Footer } from "./../../components/ui/footer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="bg-slate-200 flex flex-col min-h-screen flex-grow">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;