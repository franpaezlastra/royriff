import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems } from '../../store/slices/cartSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/constants';
import { createOrder, getPaymentMethods } from '../../services/woocommerceService';
import {
  loadCheckoutBilling,
  loadCheckoutShipping,
  saveCheckoutBilling,
  clearCheckoutStorage,
  isPickupOption,
} from '../../utils/checkoutStorage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiCreditCard, FiTruck, FiChevronLeft, FiCheck } from 'react-icons/fi';
import { CheckoutStepper } from './CheckoutEntrega';

const PAYMENT_LOGOS = {
  mercadoPago:
    'https://http2.mlstatic.com/storage/cpp/static-files/863dde6d-4e18-43f8-bcde-7905aa7a962e.svg',
  visa: 'https://http2.mlstatic.com/storage/cpp/static-files/2e565181-724f-4987-88b1-005b3011ee38.png',
  mastercard:
    'https://http2.mlstatic.com/storage/cpp/static-files/1b729977-6241-43bf-a84b-e4fa8c00ca85.png',
};

const getMethodLogo = (method) => {
  const id = (method.id || '').toLowerCase();
  const title = (method.title || '').toLowerCase();
  const text = `${id} ${title}`;
  if (text.includes('mercado') || text.includes('mp')) return PAYMENT_LOGOS.mercadoPago;
  return null;
};

const INPUT =
  'w-full px-4 py-3 border border-neutral-gray/35 rounded-lg font-neue text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary-orange focus:border-primary-orange bg-white placeholder-neutral-gray/50';
const LABEL =
  'block text-[11px] font-semibold text-neutral-darkGreen/70 mb-1.5 font-neue uppercase tracking-wider';

const CheckoutPago = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  // Recuperar datos de pasos anteriores
  const savedBilling = loadCheckoutBilling();
  const shipping = loadCheckoutShipping();

  useEffect(() => {
    if (cartItems.length === 0) { navigate('/carrito'); return; }
  }, []);

  // Formulario de contacto inline (por si llegaron sin pasar por entrega)
  const [contactForm, setContactForm] = useState({
    first_name: savedBilling?.billing_first_name || '',
    last_name: savedBilling?.billing_last_name || '',
    email: savedBilling?.billing_email || '',
    phone: savedBilling?.billing_phone || '',
    address_1: savedBilling?.billing_address_1 || '',
    city: savedBilling?.billing_city || '',
    postcode: savedBilling?.billing_postcode || '',
  });
  const [contactErrors, setContactErrors] = useState({});

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((p) => ({ ...p, [name]: value }));
    if (contactErrors[name]) setContactErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const validateContact = () => {
    const e = {};
    if (!contactForm.first_name.trim()) e.first_name = 'Requerido';
    if (!contactForm.last_name.trim()) e.last_name = 'Requerido';
    if (!contactForm.email.trim()) e.email = 'Requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) e.email = 'Email inválido';
    if (!contactForm.phone.trim()) e.phone = 'Requerido';
    // Para envío a domicilio: también se requiere dirección y ciudad
    if (!shippingIsPickup) {
      if (!contactForm.address_1.trim()) e.address_1 = 'Requerido';
      if (!contactForm.city.trim()) e.city = 'Requerido';
    }
    setContactErrors(e);
    return Object.keys(e).length === 0;
  };

  const shippingIsPickup = isPickupOption(shipping) || shipping?.id?.toString().startsWith('local_pickup');

  // Dirección del local (fallback para pedidos de retiro)
  const STORE_ADDRESS = 'Aconquija 1163';
  const STORE_CITY = 'Yerba Buena';
  const STORE_POSTCODE = '4107';

  // El billing efectivo para crear la orden
  const getEffectiveBilling = () => {
    // Si tienen datos guardados con nombre de contacto, usarlos
    if (savedBilling?.billing_first_name) {
      // Para retiro: WooCommerce necesita address y city no vacíos.
      // Si el billing guardado es de retiro, sus campos address/city ya contienen
      // la dirección del local (seteada en CheckoutEntrega). Si no los tiene (vino
      // directo desde el drawer), los completamos aquí.
      return {
        ...savedBilling,
        billing_address_1: savedBilling.billing_address_1 || (shippingIsPickup ? STORE_ADDRESS : ''),
        billing_city: savedBilling.billing_city || (shippingIsPickup ? STORE_CITY : ''),
        billing_postcode: savedBilling.billing_postcode || (shippingIsPickup ? STORE_POSTCODE : ''),
      };
    }
    // Si no, usar el formulario inline
    return {
      billing_first_name: contactForm.first_name,
      billing_last_name: contactForm.last_name,
      billing_email: contactForm.email,
      billing_phone: contactForm.phone,
      billing_address_1: contactForm.address_1 || (shippingIsPickup ? STORE_ADDRESS : ''),
      billing_address_2: '',
      billing_city: contactForm.city || (shippingIsPickup ? STORE_CITY : ''),
      billing_postcode: contactForm.postcode || (shippingIsPickup ? STORE_POSTCODE : ''),
      billing_state: '',
      billing_country: 'AR',
    };
  };

  // ¿Necesita llenar el formulario inline?
  // Para retiro: solo nombre y email son obligatorios (la dirección es del local).
  // Para envío: también necesita address y city.
  const needsContactForm = !savedBilling?.billing_first_name || !savedBilling?.billing_email;

  // Billing que se muestra en el resumen (puede ser null si no está guardado)
  const billing = savedBilling;

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showManualRedirectLink, setShowManualRedirectLink] = useState(false);
  const paymentUrlRef = useRef('');
  const skipFinallyRef = useRef(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setPaymentLoading(true);
    try {
      const methods = await getPaymentMethods();
      const mpKeys = ['mercado', 'mercadopago', 'mp'];
      const transferKeys = ['bacs', 'transfer', 'bank', 'bancaria', 'offline'];
      const cardKeys = ['pagegate', 'visa', 'mastercard', 'card', 'acceptance'];
      const enabled = methods.filter((m) => {
        if (!m.enabled) return false;
        const t = `${(m.id || '').toLowerCase()} ${(m.title || '').toLowerCase()}`;
        return (
          mpKeys.some((k) => t.includes(k)) ||
          transferKeys.some((k) => t.includes(k)) ||
          cardKeys.some((k) => t.includes(k))
        );
      });
      setPaymentMethods(enabled);
      if (enabled.length > 0) setSelectedPayment(enabled[0].id);
    } catch (err) {
      console.error('Error loading payment methods:', err);
      toast.error('No se pudieron cargar los métodos de pago');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPayment) {
      setErrors({ payment: 'Seleccioná un método de pago' });
      return;
    }
    // Validar formulario inline si es necesario
    if (needsContactForm && !validateContact()) {
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const bil = getEffectiveBilling();
      const shp = shipping;
      const isPickup = isPickupOption(shp) || shp?.id?.toString().startsWith('local_pickup');

      // Guardar los datos completos para referencia futura
      saveCheckoutBilling(bil);

      const billingData = {
        first_name: bil.billing_first_name || '',
        last_name: bil.billing_last_name || '',
        email: bil.billing_email || '',
        phone: bil.billing_phone || '',
        address_1: bil.billing_address_1 || '',
        address_2: [bil.billing_address_neighborhood, bil.billing_address_2].filter(Boolean).join(' - ') || '',
        city: bil.billing_city || '',
        state: bil.billing_state || '',
        postcode: bil.billing_postcode || '',
        country: 'AR',
      };

      const shippingData =
        isPickup || !bil.billing_address_1
          ? billingData
          : bil.ship_to_different_address
          ? {
              first_name: bil.shipping_first_name || billingData.first_name,
              last_name: bil.shipping_last_name || billingData.last_name,
              address_1: bil.shipping_address_1 || '',
              address_2: bil.shipping_address_2 || '',
              city: bil.shipping_city || '',
              state: bil.shipping_state || '',
              postcode: bil.shipping_postcode || '',
              country: 'AR',
            }
          : billingData;

      const line_items = cartItems.map((item) => ({
        product_id: parseInt(item.id),
        quantity: parseInt(item.quantity) || 1,
        ...(item.variationId ? { variation_id: parseInt(item.variationId) } : {}),
      }));

      const selectedMethod = paymentMethods.find((m) => m.id === selectedPayment);
      const shipping_lines = shp
        ? [
            {
              method_id: shp.method_id || shp.id,
              method_title: shp.title || 'Envío',
              total: String(shp.cost || 0),
            },
          ]
        : [];

      const orderData = {
        billing: billingData,
        shipping: shippingData,
        line_items,
        payment_method: selectedPayment,
        payment_method_title: selectedMethod?.title || 'Mercado Pago',
        shipping_lines,
      };

      const order = await createOrder(orderData);
      if (!order || (!order.id && !order.number)) {
        toast.error('La orden se creó pero no obtuvimos los datos para redirigirte. Revisá tu email.');
        return;
      }

      const orderId = order.id || order.number;
      const orderKey = order.order_key || '';

      dispatch(clearCart());
      clearCheckoutStorage();

      const isMercadoPago =
        selectedPayment === 'mercadopago' ||
        selectedPayment.includes('mercadopago') ||
        selectedPayment.includes('mercado-pago') ||
        selectedPayment === 'woo-mercado-pago-basic';

      const isTransferencia =
        selectedPayment.includes('bacs') ||
        selectedPayment.includes('transfer') ||
        selectedPayment.includes('bank') ||
        selectedPayment.includes('offline');

      if (isMercadoPago) {
        const baseUrl = import.meta.env.VITE_WOOCOMMERCE_URL || 'https://api.royriff.com.ar';
        const paymentUrl = `${baseUrl}/checkout/order-pay/${orderId}/?key=${orderKey}`;
        paymentUrlRef.current = paymentUrl;
        skipFinallyRef.current = true;
        window.location.replace(paymentUrl);
        setTimeout(() => {
          setSubmitting(false);
          setShowManualRedirectLink(true);
          toast('Si no te redirigió, usá el botón de abajo.', { duration: 10000 });
        }, 4000);
        return;
      } else if (isTransferencia) {
        toast.success('Orden creada. Revisá tu email para los datos de transferencia.');
        navigate(`/compra-confirmada?order_id=${orderId}&order_key=${orderKey}`);
      } else {
        toast.success('Orden creada exitosamente');
        navigate(`/compra-confirmada?order_id=${orderId}&order_key=${orderKey}`);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      let msg = 'Error al procesar la orden. Intentá nuevamente.';
      if (err.response?.data?.message) msg = err.response.data.message;
      else if (err.message) msg = err.message;
      toast.error(msg);
    } finally {
      if (!skipFinallyRef.current) setSubmitting(false);
      skipFinallyRef.current = false;
    }
  };

  if (cartItems.length === 0) return null;

  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const shippingCost = shipping?.cost || 0;
  const total = subtotal + shippingCost;
  const isPickup = isPickupOption(shipping) || shipping?.id?.toString().startsWith('local_pickup');

  return (
    <div className="py-10 md:py-16 min-h-screen bg-primary-beige">
      <div className="container-custom max-w-4xl mx-auto">
        <CheckoutStepper currentStep={3} />

        <h1 className="font-barlow font-black text-3xl md:text-4xl uppercase mb-8">
          Pago
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* ── Columna principal ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulario inline de contacto (si llegaron sin pasar por entrega) */}
            {needsContactForm && (
              <section className="bg-white rounded-xl shadow-sm p-5 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-barlow font-bold text-lg flex items-center gap-2">
                    <FiTruck className="text-primary-orange" />
                    Datos de contacto y facturación
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="text-xs text-primary-orange font-neue flex items-center gap-1 hover:underline"
                  >
                    <FiChevronLeft className="w-3 h-3" /> Ir a Entrega
                  </button>
                </div>
                {shippingIsPickup && (
                  <p className="text-[11px] text-neutral-darkGreen/50 font-neue -mt-2 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                    Retiro en el local · Aconquija 1163, Yerba Buena
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Nombre', name: 'first_name', placeholder: 'Francisco', span: '', required: true },
                    { label: 'Apellido', name: 'last_name', placeholder: 'Páez Lastra', span: '', required: true },
                    { label: 'Email', name: 'email', type: 'email', placeholder: 'tu@email.com', span: 'col-span-2', required: true },
                    { label: 'Teléfono', name: 'phone', type: 'tel', placeholder: '+54 381 000-0000', span: 'col-span-2', required: true },
                    ...(!shippingIsPickup ? [
                      { label: 'Dirección', name: 'address_1', placeholder: 'Av. Corrientes 1234', span: 'col-span-2', required: true },
                      { label: 'Ciudad', name: 'city', placeholder: 'Yerba Buena', span: '', required: true },
                      { label: 'Código Postal', name: 'postcode', placeholder: '4107', span: '', required: false },
                    ] : []),
                  ].map(({ label, name, type = 'text', placeholder, span, required }) => (
                    <div key={name} className={span}>
                      <label className={LABEL}>
                        {label}
                        {required && <span className="text-primary-orange ml-0.5">*</span>}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={contactForm[name]}
                        onChange={handleContactChange}
                        placeholder={placeholder}
                        className={`${INPUT} ${contactErrors[name] ? 'border-red-400 bg-red-50/40' : ''}`}
                      />
                      {contactErrors[name] && (
                        <p className="text-red-500 text-[11px] mt-1 font-neue">{contactErrors[name]}</p>
                      )}
                    </div>
                  ))}
                </div>
                {shipping && (
                  <div className="flex items-center gap-2 bg-neutral-gray/5 rounded-lg px-3 py-2.5 text-sm font-neue text-neutral-darkGreen">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-barlow font-bold ${
                      isPickupOption(shipping) || shipping?.id?.toString().startsWith('local_pickup')
                        ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {isPickupOption(shipping) || shipping?.id?.toString().startsWith('local_pickup') ? 'Retiro' : 'Envío'}
                    </span>
                    <span className="font-semibold">{shipping.title}</span>
                    <span className="text-neutral-darkGreen/60">
                      {shipping.cost > 0 ? `· ${formatPrice(shipping.cost)}` : '· GRATIS'}
                    </span>
                  </div>
                )}
              </section>
            )}

            {/* Resumen de entrega (si ya tienen los datos del paso anterior) */}
            {!needsContactForm && (
              <section className="bg-white rounded-xl shadow-sm p-5 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-barlow font-bold text-lg flex items-center gap-2">
                    <FiTruck className="text-primary-orange" />
                    Entrega
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="text-xs text-primary-orange underline hover:no-underline font-neue flex items-center gap-1"
                  >
                    <FiChevronLeft className="w-3 h-3" /> Cambiar
                  </button>
                </div>
                <div className="text-sm font-neue text-neutral-darkGreen space-y-1">
                  <p>
                    <span className="font-semibold">{billing?.billing_first_name} {billing?.billing_last_name}</span>
                    {billing?.billing_email && <>{' · '}{billing.billing_email}</>}
                  </p>
                  {shipping && (
                    <p className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-barlow font-bold ${
                        isPickupOption(shipping) || shipping?.id?.toString().startsWith('local_pickup')
                          ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {isPickupOption(shipping) || shipping?.id?.toString().startsWith('local_pickup') ? 'Retiro' : 'Envío'}
                      </span>
                      {shipping.title}
                      {shipping.cost > 0 ? ` · ${formatPrice(shipping.cost)}` : ' · GRATIS'}
                    </p>
                  )}
                  {billing?.billing_address_1 && (
                    <p className="text-neutral-darkGreen/70 text-xs">
                      {billing.billing_address_1}, {billing.billing_city}
                      {billing.billing_postcode ? ` (${billing.billing_postcode})` : ''}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Método de pago */}
            <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="font-barlow font-bold text-xl flex items-center gap-2">
                  <FiCreditCard className="text-primary-orange" />
                  Método de pago
                </h2>
                <div className="flex items-center gap-2 ml-auto">
                  <img src={PAYMENT_LOGOS.mercadoPago} alt="Mercado Pago" className="h-6 w-auto" />
                  <img src={PAYMENT_LOGOS.visa} alt="Visa" className="h-5 w-auto" />
                  <img src={PAYMENT_LOGOS.mastercard} alt="Mastercard" className="h-5 w-auto" />
                </div>
              </div>

              {paymentLoading ? (
                <div className="flex items-center gap-2 py-6 justify-center text-neutral-darkGreen font-neue">
                  <LoadingSpinner size="sm" /> Cargando métodos de pago…
                </div>
              ) : paymentMethods.length === 0 ? (
                <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 font-neue">
                  No hay métodos de pago disponibles. Contactanos.
                </p>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const selected = selectedPayment === method.id;
                    const logo = getMethodLogo(method);
                    const isTransfer =
                      (method.id || '').includes('bacs') ||
                      (method.id || '').includes('transfer') ||
                      (method.id || '').includes('bank') ||
                      (method.id || '').includes('offline');

                    return (
                      <label
                        key={method.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-smooth ${
                          selected
                            ? 'border-primary-orange bg-primary-orange/5'
                            : 'border-neutral-gray/30 hover:border-primary-orange/60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          className="mt-1 w-4 h-4 text-primary-orange focus:ring-primary-orange"
                          checked={selected}
                          onChange={() => setSelectedPayment(method.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            {logo && (
                              <img src={logo} alt={method.title} className="h-7 w-auto" />
                            )}
                            <p className="font-barlow font-bold text-base">
                              {method.title}
                            </p>
                            {selected && (
                              <FiCheck className="w-4 h-4 text-primary-orange ml-auto" />
                            )}
                          </div>
                          {selected && method.description && (
                            <p
                              className="text-xs text-neutral-darkGreen/80 font-neue mt-2"
                              dangerouslySetInnerHTML={{ __html: method.description }}
                            />
                          )}
                          {selected && !isTransfer && !logo && (
                            <div className="flex gap-2 mt-2">
                              <img src={PAYMENT_LOGOS.visa} alt="Visa" className="h-5 w-auto" />
                              <img src={PAYMENT_LOGOS.mastercard} alt="Mastercard" className="h-5 w-auto" />
                            </div>
                          )}
                          {selected && isTransfer && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-darkGreen/70 font-neue">
                              Usá el número de pedido como referencia de pago.
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {errors.payment && (
                <p className="text-red-500 text-xs font-neue">{errors.payment}</p>
              )}
            </section>

            {/* Aviso seguridad */}
            <p className="text-xs text-neutral-darkGreen/60 font-neue text-center">
              Todos los pagos son procesados de forma segura. No almacenamos datos de tarjetas.
            </p>

            {/* Botón finalizar */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-base md:text-lg font-bold bg-primary-orange hover:bg-primary-orange/90 text-white rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-barlow"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Procesando…
                </span>
              ) : (
                'Finalizar compra'
              )}
            </button>

            {showManualRedirectLink && paymentUrlRef.current && (
              <a
                href={paymentUrlRef.current}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center underline text-primary-orange font-neue text-sm py-2"
              >
                Ir a pagar con Mercado Pago →
              </a>
            )}

            <div className="flex items-center justify-center gap-6 text-xs text-neutral-darkGreen/60 font-neue">
              <span className="flex items-center gap-1.5"><FiCheck className="text-green-500" /> Pago 100% seguro</span>
              <span className="flex items-center gap-1.5"><FiCheck className="text-green-500" /> Protección de datos</span>
              <span className="flex items-center gap-1.5"><FiCheck className="text-green-500" /> Garantía de satisfacción</span>
            </div>
          </div>

          {/* ── Resumen lateral ──────────────────────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24 space-y-4 border border-neutral-gray/20">
              <h3 className="font-barlow font-bold text-lg pb-3 border-b border-neutral-gray/20">
                Tu orden
              </h3>

              <div className="space-y-3 max-h-52 overflow-y-auto">
                {cartItems.map((item) => {
                  const name = item.displayName || item.fullName || item.name || 'Producto';
                  return (
                    <div
                      key={item.lineKey || item.id}
                      className="flex justify-between items-start gap-2 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-barlow font-bold truncate">{name}</p>
                        <p className="text-neutral-darkGreen font-neue">
                          Cant: {item.quantity}
                        </p>
                      </div>
                      <span className="font-barlow font-bold whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-neutral-gray/20 space-y-2 text-sm">
                <div className="flex justify-between font-neue text-neutral-darkGreen">
                  <span>Subtotal</span>
                  <span className="font-barlow font-bold text-neutral-black">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between font-neue text-neutral-darkGreen">
                  <span>Envío</span>
                  <span
                    className={`font-barlow font-bold ${
                      shippingCost > 0 ? 'text-primary-orange' : 'text-green-600'
                    }`}
                  >
                    {shipping
                      ? shippingCost > 0
                        ? formatPrice(shippingCost)
                        : 'GRATIS'
                      : 'A calcular'}
                  </span>
                </div>
                <div className="flex justify-between font-neue border-t pt-2">
                  <span className="font-barlow font-bold text-base">Total</span>
                  <span className="font-barlow font-black text-xl text-primary-orange">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Logos medios de pago */}
              <div className="pt-2">
                <p className="text-xs text-neutral-darkGreen font-neue mb-2">
                  Pagás de forma segura con:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <img src={PAYMENT_LOGOS.mercadoPago} alt="Mercado Pago" className="h-6 w-auto" loading="lazy" />
                  <img src={PAYMENT_LOGOS.visa} alt="Visa" className="h-5 w-auto" loading="lazy" />
                  <img src={PAYMENT_LOGOS.mastercard} alt="Mastercard" className="h-5 w-auto" loading="lazy" />
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPago;
