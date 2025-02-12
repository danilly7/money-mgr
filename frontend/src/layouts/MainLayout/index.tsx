import { Outlet } from "react-router-dom";
import { Header } from "./../../components/ui/header";
import { Footer } from "./../../components/ui/footer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <div className="bg-slate-200 flex flex-col min-h-screen flex-grow">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;