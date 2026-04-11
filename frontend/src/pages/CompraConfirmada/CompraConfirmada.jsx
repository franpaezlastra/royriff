import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FiCheckCircle, FiMail, FiAlertCircle } from 'react-icons/fi';
import { getOrder } from '../../services/woocommerceService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CompraConfirmada = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = searchParams.get('order_id');
  const orderKey = searchParams.get('order_key');

  useEffect(() => {
    // Obtener información de la orden si tenemos order_id
    if (orderId && orderKey) {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, orderKey]);

  const loadOrder = async () => {
    try {
      const orderData = await getOrder(orderId, orderKey);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
      // No mostrar error al usuario, solo mostrar mensaje genérico
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isTransferencia = order?.payment_method && (
    order.payment_method.includes('bacs') ||
    order.payment_method.includes('transfer') ||
    order.payment_method.includes('bank') ||
    order.payment_method.includes('offline')
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-20 bg-primary-beige">
      <div className="text-center max-w-2xl mx-auto px-4">
        <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="font-barlow font-bold text-4xl mb-4">¡Compra confirmada!</h1>
        
        {order && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-left">
            <h2 className="font-barlow font-bold text-xl mb-4">Detalles de tu orden</h2>
            <div className="space-y-2 text-neutral-darkGreen">
              <p><strong>Número de orden:</strong> #{order.number || orderId}</p>
              <p><strong>Email:</strong> {order.billing?.email}</p>
              {order.total && (
                <p><strong>Total:</strong> ${parseFloat(order.total).toLocaleString('es-AR')}</p>
              )}
            </div>
          </div>
        )}

        {isTransferencia ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-barlow font-bold text-lg mb-2 text-yellow-900">
                  Pago por Transferencia Bancaria
                </h3>
                <p className="text-yellow-800 mb-2">
                  Revisá tu email ({order?.billing?.email || 'el email que ingresaste'}) para obtener los datos de la cuenta bancaria y realizar la transferencia.
                </p>
                <p className="text-sm text-yellow-700">
                  Si no ves el correo, revisá la carpeta <strong>Spam</strong> o correo no deseado. Una vez recibido el pago, procesaremos tu pedido y te notificaremos por email.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <FiMail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <p className="text-blue-800">
                  Te enviamos un email con los detalles de tu compra a <strong>{order?.billing?.email || 'tu email'}</strong>.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Si no lo ves, revisá la carpeta <strong>Spam</strong> o contactanos.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button to="/">Volver al inicio</Button>
          {orderId && (
            <Button 
              to={`/seguimiento?order_id=${orderId}&order_key=${orderKey || ''}`}
              variant="secondary"
            >
              Ver seguimiento
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompraConfirmada;
