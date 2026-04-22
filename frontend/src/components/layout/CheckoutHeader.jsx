import { Link } from 'react-router-dom';
import { clearShippingCheckoutData } from '../../utils/checkoutStorage';

const LOGO_SRC =
  'https://api.royriff.com.ar/wp-content/uploads/2026/02/logoNegro.webp';

/**
 * Cabecera mínima en checkout: sin menú ni carrito (evita inconsistencias al cambiar envío
 * desde otra parte). Logo y “Volver al inicio” limpian datos de envío guardados.
 */
const CheckoutHeader = () => {
  const handleLeaveCheckout = () => {
    clearShippingCheckoutData();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-gray/15 shadow-sm">
      <div className="container-custom flex items-center justify-between py-3.5 md:py-4">
        <Link
          to="/"
          onClick={handleLeaveCheckout}
          className="flex items-center shrink-0"
          aria-label="Roy Riff — volver al inicio"
        >
          <img
            src={LOGO_SRC}
            alt="Roy Riff"
            className="h-8 md:h-9 w-auto object-contain"
          />
        </Link>
        <Link
          to="/"
          onClick={handleLeaveCheckout}
          className="text-sm font-neue font-semibold text-neutral-darkGreen hover:text-primary-orange transition-smooth"
        >
          Volver al inicio
        </Link>
      </div>
    </header>
  );
};

export default CheckoutHeader;
