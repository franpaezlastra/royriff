import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import CheckoutHeader from './CheckoutHeader';
import Footer from './Footer';

const isCheckoutRoute = (pathname) =>
  pathname === '/checkout' || pathname.startsWith('/checkout/');

const Layout = () => {
  const location = useLocation();
  const checkoutMode = isCheckoutRoute(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {checkoutMode ? <CheckoutHeader /> : <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!checkoutMode && <Footer />}
    </div>
  );
};

export default Layout;
