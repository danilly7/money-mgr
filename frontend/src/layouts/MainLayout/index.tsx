import { Outlet } from "react-router-dom";
import { Header } from "./../../components/ui/header";
import { Footer } from "./../../components/ui/footer";
import { ScrollToTopButton } from "../../components/ui/scrollTopBtn";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <div className="flex flex-col min-h-screen flex-grow">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default MainLayout;