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
  
  // BACS: ?order_id=X&order_key=Y · MP: ?status=approved&external_reference=X&payment_id=Y
  const orderId = searchParams.get('order_id') || searchParams.get('external_reference');
  const orderKey = searchParams.get('order_key'); // null en redirects de MP
  const mpStatus = searchParams.get('status'); // 'approved' | 'pending' | 'in_process' | etc.
  const mpPaymentId = searchParams.get('payment_id');
  const isMpPending = mpStatus === 'pending' || mpStatus === 'in_process';

  useEffect(() => {
    // Solo podemos pedir el detalle al backend si tenemos ambos: orderId + orderKey.
    // Los redirects de MP traen external_reference (orderId) pero no order_key por seguridad WC,
    // entonces salteamos el fetch — la página igual muestra confirmación + WhatsApp pre-armado.
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

  // Mensaje WhatsApp pre-armado con los datos del pedido (varía según medio de pago).
  const buildWhatsAppLink = () => {
    const number = order?.number || orderId || 'sin número';
    const fullName = [
      order?.billing?.first_name,
      order?.billing?.last_name,
    ]
      .filter(Boolean)
      .join(' ')
      .trim() || 'cliente';
    const email = order?.billing?.email || '';
    const phone = order?.billing?.phone || '';
    const totalRaw = order?.total ? `$${parseFloat(order.total).toLocaleString('es-AR')}` : '';
    const itemsLine =
      Array.isArray(order?.line_items) && order.line_items.length > 0
        ? order.line_items
            .map((li) => `${li.name}${li.quantity > 1 ? ` x${li.quantity}` : ''}`)
            .join(', ')
        : '';

    const lines = [
      `¡Hola Roy Riff! Acabo de hacer mi pedido.`,
      ``,
      `Pedido: #${number}`,
      `Nombre: ${fullName}`,
    ];
    if (email) lines.push(`Email: ${email}`);
    if (phone) lines.push(`Teléfono: ${phone}`);
    if (itemsLine) lines.push(`Producto: ${itemsLine}`);
    if (totalRaw) lines.push(`Total: ${totalRaw}`);
    if (mpPaymentId) lines.push(`ID de pago MP: ${mpPaymentId}`);
    lines.push('');
    let closing;
    if (isMpPending) closing = 'Quería confirmar el estado de mi pago. ¡Gracias!';
    else if (isTransferencia) closing = 'En breve les paso el comprobante de la transferencia. ¡Gracias!';
    else closing = 'Quería confirmar el pedido. ¡Gracias!';
    lines.push(closing);
    const text = lines.join('\n');
    return `https://wa.me/5493812006514?text=${encodeURIComponent(text)}`;
  };

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

        {isMpPending ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-barlow font-bold text-lg mb-2 text-blue-900">
                  Pago en proceso
                </h3>
                <p className="text-blue-800 mb-2">
                  Tu pago está siendo procesado por Mercado Pago. Te avisaremos por email apenas se confirme.
                </p>
                <p className="text-sm text-blue-700">
                  Si pagaste con efectivo (Rapipago / Pago Fácil), revisá tu casilla — ahí está el cupón con el monto y vencimiento.
                </p>
                {mpPaymentId && (
                  <p className="text-sm text-blue-700 mt-2">
                    <strong>ID de pago:</strong> {mpPaymentId}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : isTransferencia ? (
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
          <Button href={buildWhatsAppLink()} variant="secondary">
            {isTransferencia
              ? 'Enviar comprobante por WhatsApp'
              : isMpPending
                ? 'Consultar estado por WhatsApp'
                : 'Escribinos por WhatsApp'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompraConfirmada;
