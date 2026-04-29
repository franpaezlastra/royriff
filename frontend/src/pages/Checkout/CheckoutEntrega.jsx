import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../store/slices/cartSlice';
import { formatPrice, getProductMainImage } from '../../utils/constants';
import {
  saveCheckoutShipping,
  saveCheckoutBilling,
  loadCheckoutShipping,
  loadCheckoutBilling,
  saveDeliveryContext,
  loadDeliveryContext,
  isStoreLocalPickup,
} from '../../utils/checkoutStorage';
import { LOCAL_PICKUP_OPTION, FREE_SHIPPING_OPTION, CABA_PICKUP_OPTION } from '../../utils/localPickupOption';
import { FiCheck, FiShoppingCart, FiTruck, FiHome } from 'react-icons/fi';

// ── Stepper exportado ─────────────────────────────────────────────────────────
export const CheckoutStepper = ({ currentStep }) => (
  <div className="flex items-center gap-0 text-xs md:text-sm font-neue mb-8">
    {[
      { num: 1, label: 'Carrito' },
      { num: 2, label: 'Entrega' },
      { num: 3, label: 'Pago' },
    ].map((step, idx) => (
      <div key={step.num} className="flex items-center flex-1 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
              currentStep > step.num
                ? 'bg-primary-orange text-white'
                : currentStep === step.num
                ? 'border-2 border-primary-orange text-primary-orange bg-white'
                : 'border border-neutral-gray/40 text-neutral-gray/40 bg-white'
            }`}
          >
            {currentStep > step.num ? <FiCheck className="w-3 h-3" /> : step.num}
          </div>
          <span
            className={`text-xs md:text-sm whitespace-nowrap ${
              currentStep === step.num
                ? 'font-semibold text-primary-orange'
                : currentStep > step.num
                ? 'font-semibold text-neutral-darkGreen'
                : 'text-neutral-gray/40'
            }`}
          >
            {step.label}
          </span>
        </div>
        {idx < 2 && (
          <div
            className={`h-px flex-1 mx-2 ${
              currentStep > step.num ? 'bg-primary-orange/60' : 'bg-neutral-gray/20'
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// ── Estilos base ──────────────────────────────────────────────────────────────
const INPUT =
  'w-full px-4 py-3 border border-neutral-gray/35 rounded-lg font-neue text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary-orange focus:border-primary-orange hover:border-neutral-gray/60 bg-white placeholder-neutral-gray/50';
const INPUT_ERR =
  'border-red-400 bg-red-50/40 focus:ring-red-300 focus:border-red-400';
const LABEL =
  'block text-[11px] font-semibold text-neutral-darkGreen/70 mb-1.5 font-neue uppercase tracking-wider';

const Field = ({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder = '',
  optional = false,
  className = '',
}) => (
  <div className={className}>
    <label className={LABEL}>
      {label}
      {!optional && <span className="text-primary-orange ml-0.5">*</span>}
      {optional && <span className="text-neutral-gray/40 ml-1 normal-case font-normal">(opcional)</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${INPUT} ${error ? INPUT_ERR : ''}`}
    />
    {error && <p className="text-red-500 text-[11px] mt-1 font-neue">{error}</p>}
  </div>
);

// ── Fila opción de entrega (toggle Retiro / Envío) ───────────────────────────
const DeliveryToggleRow = ({ icon: Icon, title, subtitle, selected, onSelect }) => (
  <label
    onClick={onSelect}
    className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
      selected
        ? 'border-neutral-black bg-neutral-black/[0.03] shadow-sm'
        : 'border-neutral-gray/25 bg-white hover:border-neutral-gray/50'
    }`}
  >
    <div
      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
        selected ? 'border-neutral-black bg-neutral-black' : 'border-neutral-gray/40'
      }`}
    >
      {selected && <FiCheck className="w-2.5 h-2.5 text-white" />}
    </div>
    {Icon && <Icon className="w-4 h-4 text-neutral-darkGreen/70 flex-shrink-0" aria-hidden />}
    <div className="flex-1 min-w-0">
      <p className="font-barlow font-bold text-sm text-neutral-black leading-snug">{title}</p>
      {subtitle && (
        <p className="text-[11px] text-neutral-gray/60 font-neue mt-0.5">{subtitle}</p>
      )}
    </div>
    <span className="font-barlow font-bold text-sm whitespace-nowrap ml-2 text-green-600">
      Gratis
    </span>
  </label>
);

/** Lee billing + envío guardados (carrito / drawer / paso anterior). */
function readEntregaBootstrap() {
  const prev = loadCheckoutBilling() || {};
  const prevShipping = loadCheckoutShipping();
  const deliveryCtx = loadDeliveryContext();
  const storePickup = isStoreLocalPickup(prevShipping);
  const initialPc = String(prev.billing_postcode || deliveryCtx.postcode || '').replace(/\D/g, '');

  // Si NO viene retiro local del drawer, default = envío gratis a todo el país.
  const resolvedShipping = storePickup ? prevShipping : (prevShipping || FREE_SHIPPING_OPTION);

  return {
    prev,
    prevShipping: resolvedShipping,
    initialPc,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
const CheckoutEntrega = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    if (cartItems.length === 0) navigate('/carrito');
  }, []);

  const initRef = useRef(null);
  if (!initRef.current) initRef.current = readEntregaBootstrap();
  const i0 = initRef.current;

  const [postcode, setPostcode] = useState(i0.initialPc);
  const [selectedShipping, setSelectedShipping] = useState(i0.prevShipping);

  const [form, setForm] = useState({
    first_name: i0.prev.billing_first_name || '',
    last_name: i0.prev.billing_last_name || '',
    email: i0.prev.billing_email || '',
    phone: i0.prev.billing_phone || '',
    dni: i0.prev.billing_dni || '',
    address_1: i0.prev.billing_address_1?.replace(/\s+\S+$/, '') || '',
    address_number: i0.prev.billing_address_number || '',
    address_2: i0.prev.billing_address_2 || '',
    address_neighborhood: i0.prev.billing_address_neighborhood || '',
    city: i0.prev.billing_city || '',
  });
  const [errors, setErrors] = useState({});

  /**
   * Releer envío/CP desde localStorage: mismo paso /checkout sin desmontar (drawer → Iniciar compra)
   * o navegación con nueva location.key.
   */
  useLayoutEffect(() => {
    const applyFromStorage = () => {
      const b = readEntregaBootstrap();
      setPostcode(b.initialPc);
      setSelectedShipping(b.prevShipping);
    };
    applyFromStorage();
    window.addEventListener('royriff:checkout-shipping-saved', applyFromStorage);
    return () => window.removeEventListener('royriff:checkout-shipping-saved', applyFromStorage);
  }, [location.key]);

  // Modo entrega: 3 opciones — retiro Yerba Buena, retiro CABA, envío gratis a domicilio.
  const isLocalPickupSelected = isStoreLocalPickup(selectedShipping);
  const isCabaPickupSelected = selectedShipping?.id?.toString().startsWith('caba_pickup');
  // "isPickup" cualquier retiro (Yerba Buena o CABA) — sin dirección de entrega.
  const isPickup = isLocalPickupSelected || isCabaPickupSelected;

  const handleSelectPickup = () => {
    setSelectedShipping(LOCAL_PICKUP_OPTION);
    setErrors((p) => {
      const n = { ...p };
      delete n.address_1; delete n.address_number; delete n.city; delete n.postcode;
      return n;
    });
  };
  const handleSelectCabaPickup = () => {
    setSelectedShipping(CABA_PICKUP_OPTION);
    setErrors((p) => {
      const n = { ...p };
      delete n.address_1; delete n.address_number; delete n.city; delete n.postcode;
      return n;
    });
  };
  const handleSelectDelivery = () => {
    setSelectedShipping(FREE_SHIPPING_OPTION);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const handlePostcodeChange = (e) => {
    const pc = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPostcode(pc);
    if (errors.postcode) setErrors((p) => { const n = { ...p }; delete n.postcode; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.first_name.trim()) e.first_name = 'Requerido';
    if (!form.last_name.trim()) e.last_name = 'Requerido';
    if (!form.phone.trim()) e.phone = 'Requerido';

    if (!isPickup) {
      if (!postcode || postcode.length < 4) e.postcode = 'Ingresá tu código postal';
      if (!form.city.trim()) e.city = 'Requerido';
      if (!form.address_1.trim()) e.address_1 = 'Requerido';
      if (!form.address_number.trim()) e.address_number = 'Requerido';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Para retiro: WooCommerce necesita address_1 y city no vacíos.
    // Usamos la dirección del punto de retiro como datos de facturación.
    const PICKUP_DEFAULTS = isCabaPickupSelected
      ? {
          address: 'Retiro en depósito CABA — coordinar por WhatsApp',
          city: 'Ciudad Autónoma de Buenos Aires',
          postcode: '1000',
        }
      : {
          address: 'Aconquija 1163',
          city: 'Yerba Buena',
          postcode: '4107',
        };

    saveCheckoutBilling({
      billing_first_name: form.first_name,
      billing_last_name: form.last_name,
      billing_email: form.email,
      billing_phone: form.phone,
      billing_dni: form.dni,
      billing_address_1: isPickup
        ? PICKUP_DEFAULTS.address
        : `${form.address_1} ${form.address_number}`.trim(),
      billing_address_number: isPickup ? '' : form.address_number,
      billing_address_2: isPickup ? '' : form.address_2 || '',
      billing_address_neighborhood: isPickup ? '' : form.address_neighborhood || '',
      billing_city: isPickup ? PICKUP_DEFAULTS.city : form.city,
      billing_postcode: isPickup ? PICKUP_DEFAULTS.postcode : postcode,
      billing_state: '',
      billing_country: 'AR',
      billing_is_pickup: isPickup,
    });
    saveCheckoutShipping(selectedShipping || FREE_SHIPPING_OPTION);
    if (!isPickup && postcode.replace(/\D/g, '').length >= 4) {
      saveDeliveryContext({ postcode: postcode.replace(/\D/g, '') });
    }
    navigate('/checkout/pago');
  };

  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const shippingCost = Number(selectedShipping?.cost || 0);

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Layout: formulario izquierda + resumen derecha */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        
        {/* ── Columna principal ────────────────────────────────────────── */}
        <div>
          <CheckoutStepper currentStep={2} />
          <form onSubmit={handleContinue} className="space-y-4">

            {/* Email */}
            <div className="bg-white rounded-xl border border-neutral-gray/15 shadow-sm p-5 md:p-6">
              <h2 className="font-barlow font-bold text-sm mb-4 text-neutral-darkGreen">
                Datos de contacto
              </h2>
              <Field
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                type="email"
                placeholder="tu@email.com"
              />
            </div>

            {/* Entrega — toggle Retiro local / Envío gratis (sin calculador) */}
            <div className="bg-white rounded-xl border border-neutral-gray/15 shadow-sm p-5 md:p-6 space-y-3">
              <h2 className="font-barlow font-bold text-sm text-neutral-darkGreen">Entrega</h2>

              <DeliveryToggleRow
                icon={FiHome}
                title="Retiro en el local"
                subtitle="Yerba Buena, Tucumán · L–V 9–13 y 17–21 · Sáb 9–13"
                selected={isLocalPickupSelected}
                onSelect={handleSelectPickup}
              />

              <DeliveryToggleRow
                icon={FiHome}
                title="Retiro en depósito CABA"
                subtitle="Buenos Aires · L–V 9 a 16 hs · Coordinás por WhatsApp"
                selected={isCabaPickupSelected}
                onSelect={handleSelectCabaPickup}
              />

              <DeliveryToggleRow
                icon={FiTruck}
                title="Envío a domicilio"
                subtitle="Envío gratis a todo el país · 3–6 días hábiles"
                selected={!isPickup}
                onSelect={handleSelectDelivery}
              />
            </div>

            {/* Formulario de datos — aparece si hay selección, o si hay error de CP para no bloquear */}
            {selectedShipping && (
              <div className="bg-white rounded-xl border border-neutral-gray/15 shadow-sm p-5 md:p-6 space-y-4">
                {isPickup ? (
                  <>
                    <h2 className="font-barlow font-bold text-sm text-neutral-darkGreen">
                      Datos de contacto
                    </h2>
                    <p className="text-[11px] text-neutral-darkGreen/50 font-neue -mt-2">
                      {isCabaPickupSelected
                        ? 'Para coordinar por WhatsApp el retiro en nuestro depósito de CABA.'
                        : 'Para avisarte cuando tu pedido esté listo para retirar en Yerba Buena.'}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Nombre"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        error={errors.first_name}
                        placeholder="Tu nombre"
                      />
                      <Field
                        label="Apellido"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        error={errors.last_name}
                        placeholder="Tu apellido"
                      />
                      <Field
                        label="Teléfono"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        type="tel"
                        placeholder="+54 381 000-0000"
                        className="col-span-2"
                      />
                      <Field
                        label="DNI o CUIT"
                        name="dni"
                        value={form.dni}
                        onChange={handleChange}
                        optional
                        placeholder="Tu DNI o CUIT"
                        className="col-span-2"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-barlow font-bold text-sm text-neutral-darkGreen">
                      Datos del destinatario — envío a domicilio
                    </h2>
                    <p className="text-[11px] text-neutral-darkGreen/55 font-neue -mt-2">
                      Completá la dirección completa: el pedido se entrega ahí.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Nombre"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        error={errors.first_name}
                        placeholder="Tu nombre"
                      />
                      <Field
                        label="Apellido"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        error={errors.last_name}
                        placeholder="Tu apellido"
                      />
                      <Field
                        label="Teléfono"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        type="tel"
                        placeholder="+54 381 000-0000"
                        className="col-span-2"
                      />
                      <Field
                        label="Calle"
                        name="address_1"
                        value={form.address_1}
                        onChange={handleChange}
                        error={errors.address_1}
                        placeholder="Av. Corrientes"
                        className="col-span-2 md:col-span-1"
                      />
                      <Field
                        label="Número"
                        name="address_number"
                        value={form.address_number}
                        onChange={handleChange}
                        error={errors.address_number}
                        placeholder="1234"
                      />
                      <Field
                        label="Departamento"
                        name="address_2"
                        value={form.address_2}
                        onChange={handleChange}
                        optional
                        placeholder="Piso 3, Dpto B"
                      />
                      <Field
                        label="Barrio"
                        name="address_neighborhood"
                        value={form.address_neighborhood}
                        onChange={handleChange}
                        optional
                        placeholder="Nombre del barrio"
                      />
                      <Field
                        label="Ciudad"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        error={errors.city}
                        placeholder="Yerba Buena"
                        className="col-span-2 md:col-span-1"
                      />
                      <Field
                        label="Código postal"
                        name="postcode"
                        value={postcode}
                        onChange={handlePostcodeChange}
                        error={errors.postcode}
                        type="text"
                        placeholder="Ej: 4107"
                      />
                      <Field
                        label="DNI o CUIT"
                        name="dni"
                        value={form.dni}
                        onChange={handleChange}
                        optional
                        placeholder="Tu DNI o CUIT"
                        className="col-span-2"
                      />
                    </div>
                  </>
                )}

                {/* Botón continuar */}
                <button
                  type="submit"
                  className="w-full mt-2 py-4 bg-neutral-black hover:bg-neutral-black/85 text-white font-barlow font-bold text-base rounded-xl transition-colors"
                >
                  Continuar para el pago
                </button>
              </div>
            )}

          </form>

          {/* Resumen en móvil (el aside grande está oculto en pantallas chicas) */}
          <div className="lg:hidden mt-8 bg-white rounded-xl border border-neutral-gray/15 shadow-sm px-5 py-4 space-y-2">
            <p className="font-barlow font-bold text-sm text-neutral-darkGreen">Resumen</p>
            <div className="flex justify-between text-sm">
              <span className="font-neue text-neutral-darkGreen/70">Subtotal</span>
              <span className="font-barlow font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-neue text-neutral-darkGreen/70">Costo de envío</span>
              <span
                className={`font-barlow font-bold ${
                  selectedShipping ? (shippingCost > 0 ? 'text-neutral-black' : 'text-green-600') : 'text-neutral-gray/40'
                }`}
              >
                {selectedShipping ? (shippingCost > 0 ? formatPrice(shippingCost) : 'Gratis') : '—'}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-neutral-gray/15">
              <span className="font-barlow font-black text-base">Total</span>
              <span className="font-barlow font-black text-lg text-neutral-black">
                {formatPrice(subtotal + shippingCost)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Resumen lateral ──────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-0 sticky top-6">
          <div className="bg-white rounded-xl border border-neutral-gray/15 shadow-sm overflow-hidden">
            {/* Productos */}
            <div className="divide-y divide-neutral-gray/10">
              {cartItems.map((item) => {
                const name = item.displayName || item.fullName || item.name || 'Producto';
                const img = getProductMainImage(item);
                return (
                  <div
                    key={item.lineKey || item.id}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    {/* Thumbnail con badge de cantidad */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-lg bg-neutral-gray/10 overflow-hidden flex items-center justify-center border border-neutral-gray/15">
                        {img ? (
                          <img
                            src={img}
                            alt={name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <FiShoppingCart className="w-5 h-5 text-neutral-gray/30" />
                        )}
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-darkGreen text-white text-[10px] font-bold rounded-full flex items-center justify-center font-barlow">
                        {item.quantity}
                      </span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-barlow font-bold text-sm leading-tight truncate">{name}</p>
                      {item.selectedColor && (
                        <p className="text-[11px] text-neutral-gray/55 font-neue mt-0.5">
                          {item.selectedColor}
                        </p>
                      )}
                    </div>
                    {/* Precio */}
                    <span className="font-barlow font-bold text-sm whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totales */}
            <div className="border-t border-neutral-gray/15 px-5 py-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="font-neue text-neutral-darkGreen/70">Subtotal</span>
                <span className="font-barlow font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-neue text-neutral-darkGreen/70">Costo de envío</span>
                <span
                  className={`font-barlow font-bold ${
                    selectedShipping
                      ? shippingCost > 0
                        ? 'text-neutral-black'
                        : 'text-green-600'
                      : 'text-neutral-gray/40'
                  }`}
                >
                  {selectedShipping
                    ? shippingCost > 0
                      ? formatPrice(shippingCost)
                      : 'Gratis'
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-neutral-gray/15">
                <span className="font-barlow font-black text-base">Total</span>
                <span className="font-barlow font-black text-xl text-neutral-black">
                  {formatPrice(subtotal + shippingCost)}
                </span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CheckoutEntrega;
