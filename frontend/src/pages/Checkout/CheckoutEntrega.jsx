import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../store/slices/cartSlice';
import { formatPrice, getProductMainImage } from '../../utils/constants';
import { calculateShipping } from '../../services/woocommerceService';
import {
  saveCheckoutShipping,
  saveCheckoutBilling,
  loadCheckoutShipping,
  loadCheckoutBilling,
  saveDeliveryContext,
  loadDeliveryContext,
  isStoreLocalPickup,
  filterDuplicateStoreRates,
} from '../../utils/checkoutStorage';
import {
  isDoorDeliveryOption,
  isCarrierBranchPickup,
} from '../../utils/shippingClassify';
import { LOCAL_PICKUP_OPTION } from '../../utils/localPickupOption';
import BranchSucursalInfo from '../../components/shipping/BranchSucursalInfo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiMapPin, FiCheck, FiRefreshCw, FiShoppingCart } from 'react-icons/fi';
const ANDREANI_LOGO_URL =
  'https://api.royriff.com.ar/wp-content/uploads/2026/04/correo_andreani_-removebg-preview-e1776259635246.webp';

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

// ── Fila opción de envío ──────────────────────────────────────────────────────
const ShippingRow = ({ opt, selected, onSelect, isDeliveryGroup = false }) => {
  const rawTitle = opt?.title || 'Envío';
  const displayTitle =
    isDeliveryGroup && /est[aá]ndar/i.test(rawTitle)
      ? `${rawTitle} (envío a domicilio)`
      : rawTitle;
  const isAndreani = /andreani/i.test(rawTitle);
  return (
  <label
    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
      selected
        ? 'border-neutral-black bg-neutral-black/[0.03] shadow-sm'
        : 'border-neutral-gray/25 bg-white hover:border-neutral-gray/50'
    }`}
  >
    <div
      className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
        selected ? 'border-neutral-black bg-neutral-black' : 'border-neutral-gray/40'
      }`}
    >
      {selected && <FiCheck className="w-2.5 h-2.5 text-white" />}
    </div>
    <input type="radio" className="sr-only" checked={selected} readOnly onClick={() => onSelect(opt)} />
    <div className="flex-1 min-w-0">
      {isAndreani && (
        <img
          src={ANDREANI_LOGO_URL}
          alt="Andreani"
          className="h-4 w-auto mb-1 object-contain"
          loading="lazy"
        />
      )}
      <p className="font-barlow font-bold text-sm text-neutral-black leading-snug">{displayTitle}</p>
      {opt.estimated_delivery && (
        <p className="text-[11px] text-neutral-gray/55 font-neue mt-0.5">{opt.estimated_delivery}</p>
      )}
    </div>
    <span
      className={`font-barlow font-bold text-sm whitespace-nowrap ml-2 ${
        Number(opt.cost) > 0 ? 'text-neutral-black' : 'text-green-600'
      }`}
    >
      {Number(opt.cost) > 0 ? formatPrice(opt.cost) : 'Gratis'}
    </span>
  </label>
  );
};

/** Lee billing + envío + CP guardados (carrito / drawer / paso anterior). */
function readEntregaBootstrap() {
  const prev = loadCheckoutBilling() || {};
  const prevShipping = loadCheckoutShipping();
  const deliveryCtx = loadDeliveryContext();
  const storePickup = isStoreLocalPickup(prevShipping);
  const initialPc = String(prev.billing_postcode || deliveryCtx.postcode || '').replace(/\D/g, '');
  const savedCalculatedMethod = prevShipping && !storePickup;
  const billingHadPc = String(prev.billing_postcode || '').replace(/\D/g, '').length >= 4;
  const initialPcConfirmed =
    storePickup ||
    (savedCalculatedMethod && initialPc.length >= 4) ||
    (billingHadPc && !storePickup);

  return {
    prev,
    prevShipping,
    initialPc,
    initialPcConfirmed,
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
  const [postcodeInput, setPostcodeInput] = useState(i0.initialPc);
  const [pcConfirmed, setPcConfirmed] = useState(i0.initialPcConfirmed);

  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(i0.prevShipping || null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingCalcError, setShippingCalcError] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(!!i0.prevShipping);

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
      setPostcodeInput(b.initialPc);
      setPcConfirmed(b.initialPcConfirmed);
      setSelectedShipping(b.prevShipping || null);
      setShippingOptions([]);
      setShippingCalcError('');
      setShippingCalculated(!!b.prevShipping);
      // El auto-calculo inmediato se encarga de recalcular si pcConfirmed es true
      if (initialCalcDone) initialCalcDone.current = false;
    };
    applyFromStorage();
    window.addEventListener('royriff:checkout-shipping-saved', applyFromStorage);
    return () => window.removeEventListener('royriff:checkout-shipping-saved', applyFromStorage);
  }, [location.key]);

  /** Solo retiro en el local Roy Riff — no sucursal Andreani (ahí hace falta dirección del cliente) */
  const isPickup = isStoreLocalPickup(selectedShipping);
  const isLocalPickupSelected = selectedShipping?.id?.toString().startsWith('local_pickup');
  const isBranchCarrierPickup =
    selectedShipping && !isPickup && isCarrierBranchPickup(selectedShipping);
  const calcRef = useRef(null);
  const initialCalcDone = useRef(false);

  // Firma del carrito para recalcular envío cuando agregan/quitan productos
  const cartSignature = cartItems
    .map((i) => `${i.lineKey || i.id}:${i.quantity || 1}`)
    .join('|');

  // Auto-calcular cuando cambia el CP confirmado.
  // Primer cálculo (viene del drawer): inmediato (0ms).
  // Siguientes (usuario cambia CP): debounce 400ms.
  useEffect(() => {
    if (pcConfirmed && postcode.length >= 4 && !isPickup) {
      const delay = initialCalcDone.current ? 400 : 0;
      clearTimeout(calcRef.current);
      calcRef.current = setTimeout(() => {
        initialCalcDone.current = true;
        doCalcShipping(postcode);
      }, delay);
    }
    return () => clearTimeout(calcRef.current);
  }, [postcode, pcConfirmed, cartSignature, isPickup]);

  const doCalcShipping = async (pc) => {
    setShippingLoading(true);
    setShippingCalcError('');
    try {
      const result = await calculateShipping({ postcode: pc, line_items: cartItems });
      const opts = filterDuplicateStoreRates(result.options || []);
      setShippingOptions(opts);
      setShippingCalculated(true);
      if (opts.length > 0) {
        setSelectedShipping((prev) => {
          const match = prev && opts.find((o) => o.id === prev.id);
          return match || opts[0];
        });
      } else {
        setSelectedShipping(null);
        setShippingCalcError(
          'No hay opciones de envío disponibles para ese código postal. Contactanos para coordinar.'
        );
      }
    } catch {
      setShippingCalculated(true);
      setShippingCalcError(
        'No se pudo calcular el envío. Podés igualmente ingresar tus datos y elegir el método más abajo, o intentar nuevamente.'
      );
    } finally {
      setShippingLoading(false);
    }
  };

  const handleConfirmPostcode = () => {
    const pc = postcodeInput.replace(/\D/g, '');
    if (pc.length < 4) {
      setErrors((p) => ({ ...p, postcode: 'Ingresá al menos 4 dígitos' }));
      return;
    }
    setErrors((p) => { const n = { ...p }; delete n.postcode; return n; });
    setPostcode(pc);
    setPcConfirmed(true);
    setShippingCalculated(false);
    setShippingOptions([]);
    setSelectedShipping(null);
    setShippingCalcError('');
  };

  const handleChangePostcode = () => {
    setPcConfirmed(false);
    setShippingCalculated(false);
    setShippingOptions([]);
    setSelectedShipping(null);
    setShippingCalcError('');
    setPostcodeInput(postcode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.first_name.trim()) e.first_name = 'Requerido';
    if (!form.last_name.trim()) e.last_name = 'Requerido';
    if (!form.phone.trim()) e.phone = 'Requerido';

    if (isBranchCarrierPickup) {
      if (!postcode || postcode.length < 4) e.postcode = 'Ingresá tu código postal para calcular el envío';
      if (!form.dni.trim()) e.dni = 'Andreani requiere DNI/CUIT para entregar en sucursal';
    } else if (!isPickup) {
      if (!postcode || postcode.length < 4) e.postcode = 'Ingresá tu código postal para calcular el envío';
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
    // Usamos la dirección del local como datos de facturación.
    const STORE_ADDRESS = 'Aconquija 1163';
    const STORE_CITY = 'Yerba Buena';
    const STORE_POSTCODE = '4107';

    saveCheckoutBilling({
      billing_first_name: form.first_name,
      billing_last_name: form.last_name,
      billing_email: form.email,
      billing_phone: form.phone,
      billing_dni: form.dni,
      billing_address_1: isPickup
        ? STORE_ADDRESS
        : isBranchCarrierPickup
          ? `Retiro en sucursal — CP ${postcode}`
          : `${form.address_1} ${form.address_number}`.trim(),
      billing_address_number: isPickup || isBranchCarrierPickup ? '' : form.address_number,
      billing_address_2: isPickup || isBranchCarrierPickup ? '' : form.address_2 || '',
      billing_address_neighborhood: isPickup || isBranchCarrierPickup ? '' : form.address_neighborhood || '',
      billing_city: isPickup
        ? STORE_CITY
        : isBranchCarrierPickup
          ? `CP ${postcode}`
          : form.city,
      billing_postcode: isPickup ? STORE_POSTCODE : postcode,
      billing_state: '',
      billing_country: 'AR',
      billing_is_pickup: isPickup,
    });
    saveCheckoutShipping(selectedShipping);
    if (!isPickup && postcode.replace(/\D/g, '').length >= 4) {
      saveDeliveryContext({ postcode: postcode.replace(/\D/g, '') });
    }
    navigate('/checkout/pago');
  };

  const deliveryOpts = shippingOptions.filter(isDoorDeliveryOption);
  const pickupOpts = shippingOptions.filter(isCarrierBranchPickup);
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

            {/* Entrega */}
            <div className="bg-white rounded-xl border border-neutral-gray/15 shadow-sm p-5 md:p-6 space-y-4">
              <h2 className="font-barlow font-bold text-sm text-neutral-darkGreen">Entrega</h2>

              {/* ── Retiro en el local (siempre visible) ────────────── */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-neutral-darkGreen/50 uppercase tracking-wider font-neue">
                  Retirar por
                </p>
                <ShippingRow
                  opt={LOCAL_PICKUP_OPTION}
                  selected={isLocalPickupSelected}
                  onSelect={(opt) => {
                    setSelectedShipping(opt);
                    setShippingCalcError('');
                    setErrors((p) => {
                      const n = { ...p };
                      delete n.address_1; delete n.address_number; delete n.city; delete n.postcode;
                      return n;
                    });
                  }}
                />
              </div>

              {/* ── Separador ────────────────────────────────────────── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-gray/15" />
                <span className="text-[11px] text-neutral-gray/40 font-neue uppercase tracking-wider">
                  o calculá el envío
                </span>
                <div className="flex-1 h-px bg-neutral-gray/15" />
              </div>

              {/* ── Envío calculado por CP ── */}
              <div className="space-y-3">
                <p className="text-[11px] font-semibold text-neutral-darkGreen/50 uppercase tracking-wider font-neue">
                  Envío a domicilio o sucursal del correo
                </p>

                {isPickup && !shippingOptions.length && !pcConfirmed && (
                  <p className="text-xs text-neutral-darkGreen/70 font-neue leading-relaxed bg-neutral-gray/5 rounded-lg px-3 py-2.5">
                    Tenés seleccionado retiro en el local. Si preferís envío, ingresá tu CP acá abajo.
                  </p>
                )}

                {!pcConfirmed ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div
                        className={`rr-postcode-field flex min-h-[44px] flex-1 items-center gap-2.5 rounded-lg border bg-white px-3 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] transition-all focus-within:ring-1 focus-within:ring-primary-orange/25 ${
                          errors.postcode
                            ? 'border-red-400 bg-red-50/40 focus-within:border-red-400'
                            : 'border-neutral-gray/35 focus-within:border-primary-orange'
                        }`}
                      >
                        <FiMapPin className="shrink-0 w-4 h-4 text-neutral-gray/50 pointer-events-none" aria-hidden />
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="postal-code"
                          value={postcodeInput}
                          onChange={(e) =>
                            setPostcodeInput(e.target.value.replace(/\D/g, '').slice(0, 8))
                          }
                          onKeyDown={(e) =>
                            e.key === 'Enter' && (e.preventDefault(), handleConfirmPostcode())
                          }
                          placeholder="Ej: 4107"
                          className="rr-postcode-input min-h-0 min-w-0 flex-1 border-0 bg-transparent py-2.5 font-neue text-sm leading-normal tracking-normal text-neutral-black placeholder:text-neutral-gray/50 focus:outline-none focus:ring-0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleConfirmPostcode}
                        disabled={postcodeInput.length < 4}
                        className="px-4 py-3 bg-neutral-black text-white text-sm font-barlow font-bold rounded-lg hover:bg-neutral-black/80 transition-colors disabled:opacity-40 whitespace-nowrap"
                      >
                        Calcular
                      </button>
                    </div>
                    {errors.postcode && (
                      <p className="text-red-500 text-[11px] font-neue">{errors.postcode}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-neutral-gray/5 rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-3.5 h-3.5 text-neutral-gray/50" />
                      <span className="font-neue text-sm text-neutral-darkGreen">
                        CP <span className="font-barlow font-bold text-neutral-black">{postcode}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleChangePostcode}
                      className="text-xs text-primary-orange font-neue hover:underline"
                    >
                      Cambiar
                    </button>
                  </div>
                )}

                {shippingLoading && (
                  <div className="flex items-center gap-2 text-sm text-neutral-darkGreen/60 font-neue py-1">
                    <LoadingSpinner size="sm" /> Calculando…
                  </div>
                )}

                {!shippingLoading && shippingCalcError && pcConfirmed && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2.5 font-neue">
                      {shippingCalcError}
                    </p>
                    <button
                      type="button"
                      onClick={() => doCalcShipping(postcode)}
                      className="flex items-center gap-1.5 text-xs text-primary-orange font-neue hover:underline"
                    >
                      <FiRefreshCw className="w-3 h-3" /> Reintentar
                    </button>
                  </div>
                )}

                {!shippingLoading && shippingOptions.length > 0 && (
                  <div className="space-y-4">
                    {deliveryOpts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-neutral-darkGreen/50 uppercase tracking-wider font-neue">
                          Envío a domicilio
                        </p>
                        {deliveryOpts.map((opt) => (
                          <ShippingRow
                            key={opt.id}
                            opt={opt}
                            isDeliveryGroup
                            selected={!isPickup && selectedShipping?.id === opt.id}
                            onSelect={setSelectedShipping}
                          />
                        ))}
                      </div>
                    )}
                    {pickupOpts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-neutral-darkGreen/50 uppercase tracking-wider font-neue">
                          Retiro en sucursal del transporte
                        </p>
                        <p className="text-[10px] text-neutral-darkGreen/45 font-neue leading-snug">
                          No es el local de Yerba Buena: es una sucursal del correo (ej. Andreani).
                        </p>
                        {pickupOpts.map((opt) => (
                          <ShippingRow
                            key={opt.id}
                            opt={opt}
                            selected={!isPickup && selectedShipping?.id === opt.id}
                            onSelect={setSelectedShipping}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                      Para avisarte cuando tu pedido esté listo para retirar en Yerba Buena.
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
                ) : isBranchCarrierPickup ? (
                  <>
                    <BranchSucursalInfo title={selectedShipping?.title} className="mb-1" />
                    <h2 className="font-barlow font-bold text-sm text-neutral-darkGreen">
                      Persona que retira en sucursal
                    </h2>
                    <p className="text-[11px] text-neutral-darkGreen/60 font-neue -mt-2 leading-relaxed">
                      El paquete se envía a la sucursal de Andreani más cercana a tu CP.
                      Solo necesitamos tus datos para que puedas retirarlo con DNI.
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
                        error={errors.dni}
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
                        label="DNI o CUIT"
                        name="dni"
                        value={form.dni}
                        onChange={handleChange}
                        optional
                        placeholder="Tu DNI o CUIT"
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
