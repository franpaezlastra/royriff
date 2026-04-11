import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/constants';
import { createOrder, getPaymentMethods, getShippingMethods, calculateShipping } from '../../services/woocommerceService';
import {
  filterDuplicateStoreRates,
  isDoorDeliveryOption,
  isCarrierBranchPickup,
  isStoreLocalPickup,
  getFulfillmentKind,
} from '../../utils/shippingClassify';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiTruck, FiCreditCard, FiCheck } from 'react-icons/fi';

const PAYMENT_LOGOS = {
  mercadoPago: 'https://http2.mlstatic.com/storage/cpp/static-files/863dde6d-4e18-43f8-bcde-7905aa7a962e.svg',
  visa: 'https://http2.mlstatic.com/storage/cpp/static-files/2e565181-724f-4987-88b1-005b3011ee38.png',
  mastercard: 'https://http2.mlstatic.com/storage/cpp/static-files/1b729977-6241-43bf-a84b-e4fa8c00ca85.png',
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  // Estados del formulario
  const [formData, setFormData] = useState({
    // Facturación
    billing_first_name: '',
    billing_last_name: '',
    billing_email: '',
    billing_phone: '',
    billing_address_1: '',
    billing_address_2: '',
    billing_city: '',
    billing_state: '',
    billing_postcode: '',
    billing_country: 'AR',
    
    // Envío (por defecto igual a facturación)
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_address_1: '',
    shipping_address_2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postcode: '',
    shipping_country: 'AR',
    
    // Opciones
    ship_to_different_address: false,
    payment_method: '',
    shipping_method: '',
  });

  // Estados de la aplicación
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showManualRedirectLink, setShowManualRedirectLink] = useState(false);
  const paymentUrlRef = useRef('');
  const skipFinallySetSubmittingRef = useRef(false);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  // Cargar métodos de pago y envío al montar
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/carrito');
      return;
    }

    loadPaymentMethods();
    loadShippingMethods();
  }, []);

  // Sincronizar datos de envío con facturación si no se marca "enviar a otra dirección"
  useEffect(() => {
    if (!formData.ship_to_different_address) {
      setFormData(prev => ({
        ...prev,
        shipping_first_name: prev.billing_first_name,
        shipping_last_name: prev.billing_last_name,
        shipping_address_1: prev.billing_address_1,
        shipping_address_2: prev.billing_address_2,
        shipping_city: prev.billing_city,
        shipping_state: prev.billing_state,
        shipping_postcode: prev.billing_postcode,
        shipping_country: prev.billing_country,
      }));
    }
  }, [formData.billing_first_name, formData.billing_last_name, formData.billing_address_1, formData.billing_city, formData.billing_state, formData.billing_postcode, formData.ship_to_different_address]);

  // Calcular envío automáticamente cuando se ingresa código postal
  useEffect(() => {
    const postcode = formData.ship_to_different_address 
      ? formData.shipping_postcode 
      : formData.billing_postcode;
    
    if (postcode && postcode.length >= 4 && cartItems.length > 0) {
      const timeoutId = setTimeout(() => {
        handleCalculateShipping(postcode);
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(timeoutId);
    } else {
      setSelectedShipping(null);
      setShippingOptions([]);
    }
  }, [formData.billing_postcode, formData.shipping_postcode, formData.ship_to_different_address, formData.billing_city, formData.shipping_city, formData.billing_state, formData.shipping_state]);

  const handleCalculateShipping = async (postcode) => {
    if (!postcode || postcode.length < 4) return;

    setShippingLoading(true);
    try {
      const city = formData.ship_to_different_address ? formData.shipping_city : formData.billing_city;
      const state = formData.ship_to_different_address ? formData.shipping_state : formData.billing_state;
      
      const result = await calculateShipping({
        postcode: postcode.trim(),
        city: city || undefined,
        state: state || undefined,
        line_items: cartItems,
      });

      const options = filterDuplicateStoreRates(result.options || []);
      setShippingOptions(options);

      if (options.length > 0) {
        const doorFirst = options.find(isDoorDeliveryOption) || options[0];
        let nextSelected = doorFirst;
        if (selectedShipping) {
          const match = options.find(
            (opt) => opt.id === selectedShipping.id || opt.method_id === selectedShipping.method_id
          );
          if (match) {
            nextSelected = match;
          }
        }

        setSelectedShipping(nextSelected);
        setFormData((prev) => ({
          ...prev,
          shipping_method: nextSelected.method_id || nextSelected.id,
        }));
      } else {
        setSelectedShipping(null);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      // No mostrar error al usuario, solo log
    } finally {
      setShippingLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      
      // Solo Mercado Pago (plugin oficial woo-mercado-pago-*). Sin otros gateways ni Visa Acceptance.
      const mercadoPagoKeywords = ['mercado', 'mercadopago'];
      
      const enabled = methods.filter(m => {
        if (!m.enabled) return false;
        const methodId = (m.id || '').toLowerCase();
        const methodTitle = (m.title || '').toLowerCase();
        const searchText = `${methodId} ${methodTitle}`;
        return mercadoPagoKeywords.some(keyword => searchText.includes(keyword));
      });
      
      if (enabled.length === 0) {
        console.warn('No se encontraron métodos de pago Mercado Pago habilitados.');
        console.log('Métodos disponibles desde la API:', methods);
        toast.error('No hay métodos de pago disponibles. Activá Mercado Pago en WooCommerce o contactá soporte.');
        return;
      }
      
      console.log('Métodos de pago filtrados:', enabled.map(m => ({ id: m.id, title: m.title })));
      
      setPaymentMethods(enabled);
      
      // Seleccionar el primer método por defecto
      if (enabled.length > 0) {
        setFormData(prev => ({ ...prev, payment_method: enabled[0].id }));
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      
      // Mensaje más claro para errores 401 (credenciales inválidas)
      if (error.response && error.response.status === 401) {
        toast.error('Credenciales de WooCommerce inválidas. Configúralas en WordPress → Ajustes → Roy Riff App', {
          duration: 6000,
        });
      } else {
        toast.error('Error al cargar métodos de pago');
      }
    }
  };

  const loadShippingMethods = async () => {
    try {
      const methods = await getShippingMethods();
      setShippingMethods(methods);
      
      // Seleccionar el primer método por defecto si existe
      if (methods.length > 0) {
        setFormData(prev => ({ ...prev, shipping_method: Object.keys(methods)[0] }));
      }
    } catch (error) {
      console.error('Error loading shipping methods:', error);
      // No mostrar error, puede que no haya métodos configurados
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectShippingOption = (option) => {
    setSelectedShipping(option);
    setFormData((prev) => ({
      ...prev,
      shipping_method: option.method_id || option.id || '',
    }));

    if (errors.shipping_method) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.shipping_method;
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar facturación
    if (!formData.billing_first_name.trim()) newErrors.billing_first_name = 'Requerido';
    if (!formData.billing_last_name.trim()) newErrors.billing_last_name = 'Requerido';
    if (!formData.billing_email.trim()) {
      newErrors.billing_email = 'Requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.billing_email)) {
      newErrors.billing_email = 'Email inválido';
    }
    if (!formData.billing_phone.trim()) newErrors.billing_phone = 'Requerido';
    if (!formData.billing_address_1.trim()) newErrors.billing_address_1 = 'Requerido';
    if (!formData.billing_city.trim()) newErrors.billing_city = 'Requerido';
    if (!formData.billing_postcode.trim()) newErrors.billing_postcode = 'Requerido';

    // Validar envío si es diferente
    if (formData.ship_to_different_address) {
      if (!formData.shipping_first_name.trim()) newErrors.shipping_first_name = 'Requerido';
      if (!formData.shipping_last_name.trim()) newErrors.shipping_last_name = 'Requerido';
      if (!formData.shipping_address_1.trim()) newErrors.shipping_address_1 = 'Requerido';
      if (!formData.shipping_city.trim()) newErrors.shipping_city = 'Requerido';
      if (!formData.shipping_postcode.trim()) newErrors.shipping_postcode = 'Requerido';
    }

    // Validar método de envío
    if (!selectedShipping) {
      newErrors.shipping_method = 'Seleccioná un método de envío o retiro';
    }

    // Validar método de pago
    if (!formData.payment_method) newErrors.payment_method = 'Selecciona un método de pago';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setSubmitting(true);

    try {
      // Preparar datos de facturación
      const billing = {
        first_name: formData.billing_first_name,
        last_name: formData.billing_last_name,
        email: formData.billing_email,
        phone: formData.billing_phone,
        address_1: formData.billing_address_1,
        address_2: formData.billing_address_2 || '',
        city: formData.billing_city,
        state: formData.billing_state || '',
        postcode: formData.billing_postcode,
        country: formData.billing_country,
      };

      // Preparar datos de envío
      const joinAddr2 = (a2, note) => [a2, note].filter(Boolean).join(' — ') || note;
      const shippingBase = formData.ship_to_different_address ? {
        first_name: formData.shipping_first_name,
        last_name: formData.shipping_last_name,
        address_1: formData.shipping_address_1,
        address_2: formData.shipping_address_2 || '',
        city: formData.shipping_city,
        state: formData.shipping_state || '',
        postcode: formData.shipping_postcode,
        country: formData.shipping_country,
      } : billing;

      let shipping = shippingBase;
      if (selectedShipping && !isStoreLocalPickup(selectedShipping)) {
        if (isCarrierBranchPickup(selectedShipping)) {
          shipping = {
            ...shippingBase,
            address_2: joinAddr2(shippingBase.address_2, 'Retiro en sucursal del transporte — no entrega en el domicilio indicado'),
          };
        } else if (isDoorDeliveryOption(selectedShipping)) {
          shipping = {
            ...shippingBase,
            address_2: joinAddr2(
              shippingBase.address_2,
              formData.ship_to_different_address ? 'Envío a domicilio (dirección de entrega)' : 'Envío a domicilio'
            ),
          };
        }
      }

      // Preparar items de la orden
      const line_items = cartItems.map(item => ({
        product_id: parseInt(item.id),
        quantity: parseInt(item.quantity) || 1,
      }));

      // Validar que haya productos
      if (line_items.length === 0) {
        toast.error('El carrito está vacío');
        return;
      }

      // Obtener nombre del método de pago
      const selectedPaymentMethod = paymentMethods.find(m => m.id === formData.payment_method);
      const payment_method_title = selectedPaymentMethod?.title || formData.payment_method;

      // Preparar shipping_lines si hay un método seleccionado
      const shipping_lines = selectedShipping ? [{
        method_id: selectedShipping.method_id || selectedShipping.id,
        method_title: selectedShipping.title || 'Envío',
        total: String(selectedShipping.cost || 0),
      }] : [];

      // Crear la orden
      const orderData = {
        billing,
        shipping,
        line_items,
        payment_method: formData.payment_method || '',
        payment_method_title: payment_method_title || 'Mercado Pago',
        shipping_lines,
        meta_data: [{ key: 'royriff_fulfillment', value: getFulfillmentKind(selectedShipping) }],
      };

      // Log para debug
      console.log('Order data being sent:', orderData);
      console.log('Payment method:', formData.payment_method);
      console.log('Payment methods available:', paymentMethods);

      const order = await createOrder(orderData);

      // Validar que la orden tenga id y order_key
      if (!order || (!order.id && !order.number)) {
        toast.error('La orden se creó pero no obtuvimos los datos para redirigirte. Revisá tu email o pedidos.');
        return;
      }

      const orderId = order.id || order.number;
      const orderKey = order.order_key || '';

      // Limpiar carrito
      dispatch(clearCart());

      // Redirigir según el método de pago
      const isMercadoPago = formData.payment_method === 'mercadopago' || 
                           formData.payment_method.includes('mercadopago') ||
                           formData.payment_method.includes('mercado-pago') ||
                           formData.payment_method === 'woo-mercado-pago-basic';
      
      const isTransferencia = formData.payment_method.includes('bacs') || 
                             formData.payment_method.includes('transfer') ||
                             formData.payment_method.includes('bank') ||
                             formData.payment_method.includes('offline');
      
      if (isMercadoPago) {
        // Para Mercado Pago, redirigir directamente a la URL de pago de WooCommerce
        const baseUrl = import.meta.env.VITE_WOOCOMMERCE_URL || 'https://api.royriff.com.ar';
        const paymentUrl = `${baseUrl}/checkout/order-pay/${orderId}/?key=${orderKey}`;
        
        paymentUrlRef.current = paymentUrl;
        skipFinallySetSubmittingRef.current = true; // Mantener "Procesando..." hasta que redirija o pasen 4s
        window.location.replace(paymentUrl);
        
        // Fallback: si en 4 segundos no se redirigió (p. ej. incógnito), mostrar enlace manual
        setTimeout(() => {
          setSubmitting(false);
          setShowManualRedirectLink(true);
          toast('Si no te redirigió, usá el botón "Ir a pagar con Mercado Pago" abajo.', { duration: 10000 });
        }, 4000);
        return;
      } else if (isTransferencia) {
        // Para transferencia bancaria, la orden ya está creada con status "on-hold"
        // WooCommerce debería enviar el email automáticamente
        toast.success('Orden creada exitosamente. Revisá tu email (y la carpeta Spam) para los datos de transferencia.');
        navigate(`/compra-confirmada?order_id=${orderId}&order_key=${orderKey}`);
      } else {
        toast.success('Orden creada exitosamente');
        navigate(`/compra-confirmada?order_id=${orderId}&order_key=${orderKey}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Mostrar error más detallado
      let errorMessage = 'Error al procesar la orden. Por favor intenta nuevamente.';
      
      if (error.response) {
        // Error de la API
        const errorData = error.response.data;
        console.error('Error response data:', errorData);
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.code) {
          errorMessage = `Error: ${errorData.code}`;
          if (errorData.data && errorData.data.params) {
            errorMessage += ` - ${JSON.stringify(errorData.data.params)}`;
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else {
          errorMessage = `Error ${error.response.status}: ${JSON.stringify(errorData)}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      if (!skipFinallySetSubmittingRef.current) {
        setSubmitting(false);
      }
      skipFinallySetSubmittingRef.current = false;
    }
  };

  if (cartItems.length === 0) {
    return null; // El useEffect ya redirige
  }

  /** Solo retiro en local tienda — sucursal correo sigue necesitando datos de envío */
  const isStoreLocalSelected = isStoreLocalPickup(selectedShipping);

  return (
    <div className="py-12 md:py-20 min-h-screen bg-primary-beige">
      <div className="container-custom">
        {/* Timeline de pasos */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm font-neue text-neutral-darkGreen mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary-orange text-white flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <span className="font-semibold">Carrito</span>
            </div>
            <div className="h-px flex-1 bg-primary-orange/70" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-primary-orange text-primary-orange flex items-center justify-center text-[10px] font-bold">
                2
              </div>
              <span className="font-semibold text-primary-orange">Entrega</span>
            </div>
            <div className="h-px flex-1 bg-neutral-gray/30" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-neutral-gray text-neutral-gray flex items-center justify-center text-[10px] font-bold">
                3
              </div>
              <span className="text-neutral-gray">Pago</span>
            </div>
          </div>

          <h1 className="font-barlow font-black text-3xl md:text-4xl uppercase">
            Finalizar Compra
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Datos de Facturación */}
            <section className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="font-barlow font-bold text-2xl mb-6 flex items-center gap-2">
                <FiUser className="text-primary-orange" />
                Datos de Facturación
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-darkGreen mb-2 font-neue">
                    Nombre <span className="text-primary-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="billing_first_name"
                    value={formData.billing_first_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-neue transition-all focus:outline-none focus:ring-2 focus:ring-primary-orange/50 ${
                      errors.billing_first_name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-neutral-gray/40 hover:border-neutral-gray focus:border-primary-orange'
                    }`}
                    placeholder="Ingresa tu nombre"
                    required
                  />
                  {errors.billing_first_name && (
                    <p className="text-red-500 text-xs mt-1 font-neue">{errors.billing_first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-darkGreen mb-2 font-neue">
                    Apellido <span className="text-primary-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="billing_last_name"
                    value={formData.billing_last_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-neue transition-all focus:outline-none focus:ring-2 focus:ring-primary-orange/50 ${
                      errors.billing_last_name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-neutral-gray/40 hover:border-neutral-gray focus:border-primary-orange'
                    }`}
                    placeholder="Ingresa tu apellido"
                    required
                  />
                  {errors.billing_last_name && (
                    <p className="text-red-500 text-xs mt-1 font-neue">{errors.billing_last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-darkGreen mb-2 font-neue">
                    <FiMail className="inline mr-1 text-primary-orange" />
                    Email <span className="text-primary-orange">*</span>
                  </label>
                  <input
                    type="email"
                    name="billing_email"
                    value={formData.billing_email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-neue transition-all focus:outline-none focus:ring-2 focus:ring-primary-orange/50 ${
                      errors.billing_email 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-neutral-gray/40 hover:border-neutral-gray focus:border-primary-orange'
                    }`}
                    placeholder="tu@email.com"
                    required
                  />
                  {errors.billing_email && (
                    <p className="text-red-500 text-xs mt-1 font-neue">{errors.billing_email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-darkGreen mb-2 font-neue">
                    <FiPhone className="inline mr-1 text-primary-orange" />
                    Teléfono <span className="text-primary-orange">*</span>
                  </label>
                  <input
                    type="tel"
                    name="billing_phone"
                    value={formData.billing_phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-neue transition-all focus:outline-none focus:ring-2 focus:ring-primary-orange/50 ${
                      errors.billing_phone 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-neutral-gray/40 hover:border-neutral-gray focus:border-primary-orange'
                    }`}
                    placeholder="+54 11 1234-5678"
                    required
                  />
                  {errors.billing_phone && (
                    <p className="text-red-500 text-xs mt-1 font-neue">{errors.billing_phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-darkGreen mb-2">
                    <FiMapPin className="inline mr-1" />
                    Dirección <span className="text-primary-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="billing_address_1"
                    value={formData.billing_address_1}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-md font-neue ${
                      errors.billing_address_1 ? 'border-red-500' : 'border-neutral-gray'
                    }`}
                    placeholder="Calle y número"
                    required
                  />
                  {errors.billing_address_1 && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_address_1}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="billing_address_2"
                    value={formData.billing_address_2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-neutral-gray rounded-md font-neue"
                    placeholder="Departamento, piso, etc. (opcional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-darkGreen mb-2">
                    Ciudad <span className="text-primary-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="billing_city"
                    value={formData.billing_city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-md font-neue ${
                      errors.billing_city ? 'border-red-500' : 'border-neutral-gray'
                    }`}
                    required
                  />
                  {errors.billing_city && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-darkGreen mb-2">
                    Provincia
                  </label>
                  <input
                    type="text"
                    name="billing_state"
                    value={formData.billing_state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-neutral-gray rounded-md font-neue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-darkGreen mb-2">
                    Código Postal <span className="text-primary-orange">*</span>
                  </label>
                  <input
                    type="text"
                    name="billing_postcode"
                    value={formData.billing_postcode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-md font-neue ${
                      errors.billing_postcode ? 'border-red-500' : 'border-neutral-gray'
                    }`}
                    required
                  />
                  {errors.billing_postcode && (
                    <p className="text-red-500 text-xs mt-1">{errors.billing_postcode}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Entrega: métodos de envío / retiro */}
            <section className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="font-barlow font-bold text-2xl mb-4 flex items-center gap-2">
                <FiTruck className="text-primary-orange" />
                Entrega
              </h2>

              {shippingLoading && shippingOptions.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-neutral-darkGreen font-neue">
                  <LoadingSpinner size="sm" />
                  <span>Calculando opciones de envío...</span>
                </div>
              )}

              {!shippingLoading && shippingOptions.length === 0 && (
                <p className="text-sm text-neutral-darkGreen font-neue">
                  Ingresá tu código postal en los datos de facturación para ver las opciones de
                  envío o retiro disponibles.
                </p>
              )}

              {shippingOptions.length > 0 && (
                <div className="space-y-4">
                  {(() => {
                    const deliveryOptions = shippingOptions.filter(isDoorDeliveryOption);
                    const pickupOptions = shippingOptions.filter(isCarrierBranchPickup);

                    const renderGroup = (title, options) => {
                      if (!options.length) return null;
                      return (
                        <div className="space-y-2">
                          <h3 className="font-barlow font-semibold text-sm uppercase tracking-wide text-neutral-darkGreen">
                            {title}
                          </h3>
                          <div className="space-y-2">
                            {options.map((option) => {
                              const isSelected =
                                selectedShipping &&
                                (selectedShipping.id === option.id ||
                                  selectedShipping.method_id === option.method_id);
                              return (
                                <label
                                  key={option.id}
                                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-smooth ${
                                    isSelected
                                      ? 'border-primary-orange bg-primary-orange/5'
                                      : 'border-neutral-gray/30 hover:border-primary-orange/60'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="shipping_option"
                                    className="mt-1 w-4 h-4 text-primary-orange focus:ring-primary-orange"
                                    checked={isSelected}
                                    onChange={() => handleSelectShippingOption(option)}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center gap-2">
                                      <div>
                                        <p className="font-barlow font-bold text-sm text-neutral-black">
                                          {option.title || 'Envío'}
                                        </p>
                                      </div>
                                      <div className="text-sm font-barlow font-bold whitespace-nowrap">
                                        {option.cost > 0 ? (
                                          <span className="text-primary-orange">
                                            {formatPrice(option.cost)}
                                          </span>
                                        ) : (
                                          <span className="text-green-600">GRATIS</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    };

                    return (
                      <>
                        {renderGroup('Envío a domicilio', deliveryOptions)}
                        {renderGroup('Retiro en sucursal del transporte', pickupOptions)}
                      </>
                    );
                  })()}
                </div>
              )}

              {errors.shipping_method && (
                <p className="text-red-500 text-xs mt-3 font-neue">{errors.shipping_method}</p>
              )}
            </section>

            {/* Envío a otra dirección (solo si se selecciona envío a domicilio) */}
            {!isStoreLocalSelected && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="ship_to_different_address"
                    checked={formData.ship_to_different_address}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary-orange border-2 border-neutral-gray rounded"
                  />
                  <span className="font-barlow font-bold text-lg">
                    Enviar a una dirección diferente
                  </span>
                </label>

                {formData.ship_to_different_address && (
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-darkGreen mb-2">
                        Nombre <span className="text-primary-orange">*</span>
                      </label>
                      <input
                        type="text"
                        name="shipping_first_name"
                        value={formData.shipping_first_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border-2 rounded-md font-neue ${
                          errors.shipping_first_name ? 'border-red-500' : 'border-neutral-gray'
                        }`}
                      />
                      {errors.shipping_first_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.shipping_first_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-darkGreen mb-2">
                        Apellido <span className="text-primary-orange">*</span>
                      </label>
                      <input
                        type="text"
                        name="shipping_last_name"
                        value={formData.shipping_last_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border-2 rounded-md font-neue ${
                          errors.shipping_last_name ? 'border-red-500' : 'border-neutral-gray'
                        }`}
                      />
                      {errors.shipping_last_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.shipping_last_name}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-darkGreen mb-2">
                        Dirección <span className="text-primary-orange">*</span>
                      </label>
                      <input
                        type="text"
                        name="shipping_address_1"
                        value={formData.shipping_address_1}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border-2 rounded-md font-neue ${
                          errors.shipping_address_1 ? 'border-red-500' : 'border-neutral-gray'
                        }`}
                      />
                      {errors.shipping_address_1 && (
                        <p className="text-red-500 text-xs mt-1">{errors.shipping_address_1}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-darkGreen mb-2">
                        Ciudad <span className="text-primary-orange">*</span>
                      </label>
                      <input
                        type="text"
                        name="shipping_city"
                        value={formData.shipping_city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border-2 rounded-md font-neue ${
                          errors.shipping_city ? 'border-red-500' : 'border-neutral-gray'
                        }`}
                      />
                      {errors.shipping_city && (
                        <p className="text-red-500 text-xs mt-1">{errors.shipping_city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-darkGreen mb-2">
                        Código Postal <span className="text-primary-orange">*</span>
                      </label>
                      <input
                        type="text"
                        name="shipping_postcode"
                        value={formData.shipping_postcode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border-2 rounded-md font-neue ${
                          errors.shipping_postcode ? 'border-red-500' : 'border-neutral-gray'
                        }`}
                      />
                      {errors.shipping_postcode && (
                        <p className="text-red-500 text-xs mt-1">{errors.shipping_postcode}</p>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Método de Pago */}
            <section className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="font-barlow font-bold text-2xl flex items-center gap-2">
                  <FiCreditCard className="text-primary-orange" />
                  Método de Pago
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <img
                    src={PAYMENT_LOGOS.mercadoPago}
                    alt="Mercado Pago"
                    className="h-7 w-auto"
                    loading="lazy"
                  />
                  <img
                    src={PAYMENT_LOGOS.visa}
                    alt="Visa"
                    className="h-7 w-auto"
                    loading="lazy"
                  />
                  <img
                    src={PAYMENT_LOGOS.mastercard}
                    alt="Mastercard"
                    className="h-7 w-auto"
                    loading="lazy"
                  />
                </div>
              </div>

              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <LoadingSpinner />
                  <p className="text-neutral-darkGreen mt-4 font-neue">Cargando métodos de pago...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((method) => {
                    const methodId = (method.id || '').toLowerCase();
                    const isMercadoPago =
                      methodId.includes('mercado') ||
                      methodId.includes('mercadopago') ||
                      (method.title || '').toLowerCase().includes('mercado');
                    
                    return (
                      <label
                        key={method.id}
                        className={`group relative flex items-start gap-4 p-5 md:p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.payment_method === method.id
                            ? 'border-primary-orange bg-gradient-to-r from-primary-orange/10 to-primary-orange/5 shadow-lg shadow-primary-orange/20'
                            : 'border-neutral-gray/40 hover:border-primary-orange/60 hover:shadow-md bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.id}
                          checked={formData.payment_method === method.id}
                          onChange={handleInputChange}
                          className="mt-1 w-5 h-5 text-primary-orange focus:ring-2 focus:ring-primary-orange focus:ring-offset-2"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            {/* Iconos según el método */}
                            {isMercadoPago && (
                              <div className="flex items-center gap-3">
                                <img
                                  src={PAYMENT_LOGOS.mercadoPago}
                                  alt="Mercado Pago"
                                  className="h-7 w-auto"
                                  loading="lazy"
                                />
                                <div className="font-barlow font-bold text-lg text-neutral-black">
                                  {method.title || 'Mercado Pago'}
                                </div>
                              </div>
                            )}
                            {!isMercadoPago && (
                              <div className="font-barlow font-bold text-lg text-neutral-black">
                                {method.title}
                              </div>
                            )}
                          </div>
                          
                          {method.description && (
                            <div className="text-sm text-neutral-darkGreen mt-2 font-neue leading-relaxed">
                              {method.description}
                            </div>
                          )}
                          
                          {/* Información adicional según el método */}
                          {isMercadoPago && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-neue">
                                Tarjetas Visa, Mastercard y otras vía Mercado Pago
                              </span>
                              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-neue">
                                Cuotas: elegí plazos al pagar (según tu tarjeta y promociones activas)
                              </span>
                              <span className="text-xs bg-gray-50 text-gray-700 px-3 py-1 rounded-full font-neue">
                                Pago seguro
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Checkmark cuando está seleccionado */}
                        {formData.payment_method === method.id && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-primary-orange rounded-full flex items-center justify-center">
                              <FiCheck className="text-white w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
              {errors.payment_method && (
                <p className="text-red-500 text-xs mt-2 font-neue">{errors.payment_method}</p>
              )}
              
              {/* Badge de seguridad */}
              <div className="mt-6 pt-6 border-t border-neutral-gray/20">
                <div className="flex items-center gap-2 text-xs text-neutral-darkGreen">
                  <FiCheck className="text-green-500" />
                  <span className="font-neue">Todos los pagos son procesados de forma segura. No almacenamos datos de tarjetas.</span>
                </div>
              </div>
            </section>
          </div>

          {/* Resumen de la Orden */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 sticky top-24 border border-neutral-gray/20">
              <h2 className="font-barlow font-bold text-2xl mb-6 pb-4 border-b border-neutral-gray/20">
                Resumen de la Orden
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => {
                  const displayName = item.displayName || item.fullName || item.name || 'Producto';
                  return (
                    <div key={item.id} className="flex justify-between items-start gap-3 pb-4 border-b border-neutral-gray/10 last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="font-barlow font-bold text-neutral-black mb-1">{displayName}</div>
                        <div className="text-sm text-neutral-darkGreen font-neue">
                          Cantidad: <span className="font-semibold">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="font-bold text-right text-neutral-black whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totales */}
              <div className="space-y-3 mb-6 pt-4 border-t border-neutral-gray/20">
                <div className="flex justify-between items-center">
                  <span className="font-neue text-neutral-darkGreen">Subtotal</span>
                  <span className="font-bold text-neutral-black">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-neue text-neutral-darkGreen">Envío</span>
                  <span className="font-neue text-neutral-darkGreen">
                    {shippingLoading ? (
                      <span className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        Calculando...
                      </span>
                    ) : selectedShipping ? (
                      selectedShipping.cost > 0 ? (
                        <span className="font-bold">{formatPrice(selectedShipping.cost)}</span>
                      ) : (
                        'A calcular'
                      )
                    ) : (
                      'A calcular'
                    )}
                  </span>
                </div>
                {selectedShipping && selectedShipping.title && (
                  <div className="flex justify-between items-center text-xs text-neutral-darkGreen">
                    <span className="font-neue italic">{selectedShipping.title}</span>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-primary-orange/30 pt-4 mb-6 bg-gradient-to-r from-primary-orange/5 to-transparent rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-barlow font-bold text-xl text-neutral-black">Total</span>
                  <span className="font-barlow font-black text-2xl text-primary-orange">
                    {formatPrice(cartTotal + (selectedShipping?.cost || 0))}
                  </span>
                </div>
                <p className="text-xs text-neutral-darkGreen mt-2 font-neue">
                  {selectedShipping && selectedShipping.cost > 0 
                    ? `Incluye envío: ${selectedShipping.title}`
                    : '* El costo de envío se calculará según tu ubicación'}
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mb-4 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="inline mr-2" />
                    Procesando...
                  </>
                ) : (
                  'Finalizar Compra'
                )}
              </Button>

              {showManualRedirectLink && paymentUrlRef.current && (
                <a
                  href={paymentUrlRef.current}
                  className="block w-full mb-4 py-4 text-center text-lg font-bold bg-primary-orange text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Ir a pagar con Mercado Pago
                </a>
              )}

              {/* Badges de seguridad y garantía */}
              <div className="space-y-3 pt-4 border-t border-neutral-gray/20">
                <div className="flex items-start gap-2 text-xs text-neutral-darkGreen">
                  <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-neue">Pago 100% seguro y encriptado</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-neutral-darkGreen">
                  <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-neue">Protección de datos personales</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-neutral-darkGreen">
                  <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-neue">Garantía de satisfacción</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
