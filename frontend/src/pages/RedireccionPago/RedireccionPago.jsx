import { useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiArrowRight, FiCreditCard } from 'react-icons/fi';

const RedireccionPago = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('order_id');
  const orderKey = searchParams.get('order_key');
  const paymentUrlParam = searchParams.get('payment_url');

  const paymentUrl = paymentUrlParam
    ? decodeURIComponent(paymentUrlParam)
    : orderId && orderKey
      ? `${import.meta.env.VITE_WOOCOMMERCE_URL || 'https://api.royriff.com.ar'}/checkout/order-pay/${orderId}/?key=${orderKey}`
      : null;

  const openPaymentInNewTab = useCallback(() => {
    if (!paymentUrl) return;
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
  }, [paymentUrl]);

  useEffect(() => {
    if (!paymentUrl) {
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    }
    openPaymentInNewTab();
  }, [paymentUrl, navigate, openPaymentInNewTab]);

  if (!paymentUrl) {
    return (
      <div className="min-h-screen bg-primary-beige flex items-center justify-center py-20 px-4">
        <p className="font-neue text-neutral-darkGreen">Redirigiendo al inicio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-beige flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-full p-6 shadow-lg">
            <FiCreditCard className="w-16 h-16 text-primary-orange" />
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <LoadingSpinner />
        </div>

        <h1 className="font-barlow font-bold text-3xl md:text-4xl mb-4 text-neutral-black">
          PAGO ABIERTO EN OTRA PESTAÑA
        </h1>

        <p className="font-neue text-lg md:text-xl text-neutral-darkGreen mb-6">
          Se abrió otra pestaña para que completes el pago con Mercado Pago. Cuando termines (o canceles), esa pestaña te llevará a la confirmación o cancelación en React.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="font-neue text-sm text-neutral-darkGreen">
            <strong className="text-neutral-black">Podés cerrar esa pestaña cuando termines.</strong> Si no se abrió, usá el botón de abajo.
          </p>
        </div>

        <button
          type="button"
          onClick={openPaymentInNewTab}
          className="inline-flex items-center gap-2 btn-primary"
        >
          Abrir pago en nueva pestaña
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RedireccionPago;
