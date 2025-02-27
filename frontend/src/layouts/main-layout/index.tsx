import { Outlet } from "react-router-dom";
import { Header } from "./../../components/ui/header";
import { Footer } from "./../../components/ui/footer";
import { ScrollToTopButton } from "../../components/ui/scroll-top-btn";
import { CategoriesProvider } from "../../context/categories-context";
import { TransactionsProvider } from "../../context/transactions-context";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <div className="flex flex-col min-h-screen flex-grow">

          <CategoriesProvider>
            <TransactionsProvider>

              <Outlet />

            </TransactionsProvider>
          </CategoriesProvider>

        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default MainLayout;