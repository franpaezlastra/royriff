import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiX, FiTrash2, FiPlus, FiMinus, FiTruck, FiCheck } from 'react-icons/fi';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
} from '../../store/slices/cartSlice';
import { formatPrice, getProductMainImage } from '../../utils/constants';
import {
  saveCheckoutShipping,
  saveDeliveryContext,
  clearDeliveryContext,
  isStoreLocalPickup,
} from '../../utils/checkoutStorage';
import { LOCAL_PICKUP_OPTION } from '../../utils/localPickupOption';
import { isCarrierBranchPickup, isDoorDeliveryOption } from '../../utils/shippingClassify';
import ShippingCalculator from '../shipping/ShippingCalculator';
import Button from '../common/Button';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [selectedShipping, setSelectedShipping] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  // Mapa UX: solo 2 modos arriba (Retiro local o Envío). "Envío" debe mantenerse activo aunque Andreani
  // devuelva una opción clasificada como retiro (Sucursal) dentro del calculador.
  const [deliveryMode, setDeliveryMode] = useState(false);
  const [lastPostcode, setLastPostcode] = useState('');

  const handleRemove = (lineKey) => dispatch(removeFromCart(lineKey));
  const handleUpdateQuantity = (lineKey, qty) =>
    dispatch(updateQuantity({ lineKey, quantity: qty }));

  const handleSelectPickup = () => {
    setSelectedShipping(LOCAL_PICKUP_OPTION);
    setShowCalculator(false);
    setDeliveryMode(false);
  };
  const handleSelectCalculated = (opt) => {
    setSelectedShipping(opt);
    // Si elegimos una opción calculada (Andreani estándar o sucursal), estamos en modo "Envío".
    setDeliveryMode(true);
    setShowCalculator(true);
  };

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) return;
    onClose?.();
    if (selectedShipping) {
      saveCheckoutShipping(selectedShipping);
      if (isStoreLocalPickup(selectedShipping)) {
        clearDeliveryContext();
      } else if (lastPostcode.replace(/\D/g, '').length >= 4) {
        saveDeliveryContext({ postcode: lastPostcode.replace(/\D/g, '') });
      }
      window.dispatchEvent(new CustomEvent('royriff:checkout-shipping-saved'));
    }
    navigate('/checkout');
  };

  const hasItems = cartItems.length > 0;
  const shippingCost = Number(selectedShipping?.cost || 0);
  const hasSelectedShipping = !!selectedShipping;
  const isLocalPickupSelected =
    hasSelectedShipping && selectedShipping?.id?.toString().startsWith('local_pickup');
  const isDeliverySelected = deliveryMode;

  const remoteShippingHeadline = () => {
    if (!selectedShipping || isLocalPickupSelected) return 'Envío o retiro en sucursal';
    if (isCarrierBranchPickup(selectedShipping)) return 'Retiro en sucursal del transporte';
    if (isDoorDeliveryOption(selectedShipping)) return 'Envío a domicilio';
    return 'Envío o retiro en sucursal';
  };
  const remoteShippingSubline = () => {
    if (!selectedShipping || isLocalPickupSelected) {
      return 'Ingresá tu CP y elegí domicilio o sucursal del correo';
    }
    const rawTitle = selectedShipping.title || 'Seleccionado';
    if (isDoorDeliveryOption(selectedShipping) && /est[aá]ndar/i.test(rawTitle)) {
      return `${rawTitle} (envío a domicilio)`;
    }
    return rawTitle;
  };

  const cartSignature = cartItems
    .map((i) => `${i.lineKey || i.id}:${i.quantity || 1}`)
    .join('|');

  // Cuando cambian los items del carrito (agrega/quita/cantidad), invalidar el envío
  // calculado para que recalcule con el nuevo peso/precio.
  // IMPORTANTE: NO incluir selectedShipping en deps — eso causaría un loop que borra
  // la selección en el mismo tick en que el usuario la elige.
  const prevCartSig = useRef(cartSignature);
  useEffect(() => {
    if (prevCartSig.current === cartSignature) return;
    prevCartSig.current = cartSignature;

    if (!hasItems || isLocalPickupSelected || !isDeliverySelected) return;
    setSelectedShipping(null);
    setShowCalculator(true);
  }, [cartSignature, hasItems, isLocalPickupSelected, isDeliverySelected]);

  // Cuando el carrito se vacía, limpiar todo el estado de envío del drawer.
  useEffect(() => {
    if (hasItems) return;
    setSelectedShipping(null);
    setShowCalculator(false);
    setDeliveryMode(false);
    setLastPostcode('');
  }, [hasItems]);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Cerrar carrito"
      />

      {/* Drawer */}
      <aside
        className={`relative h-full w-full max-w-full sm:w-[390px] md:w-[420px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-gray/20">
          <div>
            <h2 className="font-barlow font-bold text-lg uppercase">Tu carrito</h2>
            {hasItems && (
              <p className="text-xs text-neutral-darkGreen font-neue mt-0.5">
                Revisá tu pedido antes de finalizar.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-gray/10 transition-smooth"
            aria-label="Cerrar"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content (una sola página con su propio scroll) */}
        <div className="flex-1 overflow-y-auto rr-scroll">
          {/* Items */}
          <div className="px-5 py-4 space-y-3">
            {!hasItems && (
              <div className="text-center py-12">
                <p className="font-barlow font-bold text-base mb-2">Tu carrito está vacío</p>
                <p className="text-sm text-neutral-darkGreen font-neue mb-4">
                  Agregá una Roy Riff para comenzar.
                </p>
                <Button to="/" onClick={onClose} variant="primary">
                  Ver bicicletas
                </Button>
              </div>
            )}

            {hasItems &&
              cartItems.map((item) => {
                const displayName = item.displayName || item.fullName || item.name || 'Producto';
                const productImage = getProductMainImage(item);
                return (
                  <div
                    key={item.lineKey || item.id}
                    className="flex gap-3 border border-neutral-gray/15 rounded-lg p-3.5"
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-white rounded-md overflow-hidden border border-neutral-gray/15 flex items-center justify-center">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={displayName}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="font-barlow font-bold text-xs text-neutral-black/30 text-center px-1">
                          {displayName}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2 mb-1">
                        <p className="font-barlow font-bold text-sm leading-snug">
                          {displayName}
                        </p>
                        <span className="font-barlow font-bold text-sm whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      {item.selectedColor && (
                        <p className="text-[11px] text-neutral-darkGreen font-neue mb-2">
                          COLOR: <span className="font-semibold">{item.selectedColor}</span>
                        </p>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 border border-neutral-gray/50 rounded">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.lineKey, item.quantity - 1)}
                            className="p-1.5 hover:bg-neutral-gray/10 transition-smooth touch-manipulation"
                          >
                            <FiMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold font-barlow min-w-[1.75rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.lineKey, item.quantity + 1)}
                            className="p-1.5 hover:bg-neutral-gray/10 transition-smooth touch-manipulation"
                          >
                            <FiPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.lineKey)}
                          className="text-red-400 hover:text-red-600 transition-smooth p-1.5 touch-manipulation"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Resumen + Entrega (también dentro del mismo scroll) */}
          {hasItems && (
            <div className="border-t border-neutral-gray/20 bg-neutral-gray/5">
              {/* Opciones de entrega */}
              <div className="px-5 pt-4 pb-3 space-y-3">
                <p className="text-xs font-semibold text-neutral-darkGreen font-neue uppercase tracking-wider">
                  ¿Cómo recibís tu bici?
                </p>

                {/* Opción 1: Retiro en el local */}
                <button
                  type="button"
                  onClick={handleSelectPickup}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                    isLocalPickupSelected
                      ? 'border-primary-orange bg-primary-orange/5'
                      : 'border-neutral-gray/25 bg-white hover:border-neutral-gray/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      isLocalPickupSelected
                        ? 'border-primary-orange bg-primary-orange'
                        : 'border-neutral-gray/40'
                    }`}
                  >
                    {isLocalPickupSelected && (
                      <FiCheck className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-barlow font-bold text-sm">Retiro en el local</p>
                    <p className="text-[11px] text-neutral-darkGreen/60 font-neue">
                      Yerba Buena, Tucumán
                    </p>
                  </div>
                  <span className="text-xs font-barlow font-bold text-green-600 whitespace-nowrap">
                    GRATIS
                  </span>
                </button>

                {/* Opción 2: Envío a domicilio */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Solo se cierra/oculta el envío si vuelven a seleccionar "Retiro en el local".
                      // Si estábamos en retiro local, limpiar método calculado.
                      if (isLocalPickupSelected) setSelectedShipping(null);
                      setDeliveryMode(true);
                      setShowCalculator(true);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                      isDeliverySelected
                        ? 'border-primary-orange bg-primary-orange/5'
                        : 'border-neutral-gray/25 bg-white hover:border-neutral-gray/50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        isDeliverySelected
                          ? 'border-primary-orange bg-primary-orange'
                          : 'border-neutral-gray/40'
                      }`}
                    >
                      {isDeliverySelected && (
                        <FiCheck className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-barlow font-bold text-sm leading-snug">
                        {remoteShippingHeadline()}
                      </p>
                      <p className="text-[11px] text-neutral-darkGreen/60 font-neue line-clamp-2">
                        {remoteShippingSubline()}
                      </p>
                    </div>
                    {selectedShipping && !isLocalPickupSelected && (
                      <span
                        className={`text-xs font-barlow font-bold whitespace-nowrap ${
                          selectedShipping.cost > 0 ? 'text-primary-orange' : 'text-green-600'
                        }`}
                      >
                        {selectedShipping.cost > 0
                          ? formatPrice(selectedShipping.cost)
                          : 'GRATIS'}
                      </span>
                    )}
                    {(!selectedShipping || isLocalPickupSelected) && (
                      <FiTruck className="w-4 h-4 text-neutral-gray/40 flex-shrink-0" />
                    )}
                  </button>

                  {/* Calculador compacto — se muestra al hacer click en "Envío a domicilio" */}
                  {showCalculator && isDeliverySelected && (
                    <div className="rounded-lg border border-neutral-gray/20 bg-white overflow-hidden">
                      <p className="text-[10px] text-neutral-darkGreen/55 font-neue px-3 pt-3 leading-snug">
                        Elegí una opción por grupo: <strong>domicilio</strong> o <strong>sucursal del correo</strong>.
                        El retiro en nuestro local Yerba Buena es la tarjeta de arriba (sin CP).
                      </p>
                      <ShippingCalculator
                        showTitle={false}
                        compact
                        className="shadow-none border-0 bg-transparent"
                        initialPostcode={lastPostcode}
                        autoCalculateOnMount={true}
                        autoCalculateKey={cartSignature}
                        restoreShippingId={
                          selectedShipping && !isLocalPickupSelected ? selectedShipping.id : undefined
                        }
                        onRestoreFailed={() => setSelectedShipping(null)}
                        onShippingSelected={(opt) => {
                          handleSelectCalculated(opt);
                        }}
                        onCalculationResult={(data) => {
                          const pc = (data?.postcode || '').replace(/\D/g, '');
                          setLastPostcode(pc);
                          if (pc.length >= 4) saveDeliveryContext({ postcode: pc });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Subtotal + botones */}
              <div className="px-5 pb-5 space-y-3">
                <div className="flex justify-between text-sm font-neue text-neutral-darkGreen">
                  <span>Subtotal</span>
                  <span className="font-barlow font-bold text-neutral-black">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                {hasSelectedShipping && (
                  <div className="flex justify-between text-sm font-neue text-neutral-darkGreen">
                    <span>Costo de envío</span>
                    <span className={`font-barlow font-bold whitespace-nowrap ${
                      shippingCost > 0 ? 'text-primary-orange' : 'text-green-600'
                    }`}>
                      {shippingCost > 0 ? formatPrice(shippingCost) : 'GRATIS'}
                    </span>
                  </div>
                )}

                {hasSelectedShipping && (
                  <div className="flex justify-between items-center text-lg font-barlow font-bold">
                    <span>Total</span>
                    <span className="text-primary-orange">
                      {formatPrice(cartTotal + shippingCost)}
                    </span>
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full py-3.5 text-sm font-bold"
                  onClick={handleGoToCheckout}
                >
                  Iniciar compra
                </Button>

                <p className="text-[11px] text-neutral-darkGreen/50 font-neue text-center leading-tight">
                  {selectedShipping
                    ? isStoreLocalPickup(selectedShipping)
                      ? 'Retiro en Yerba Buena · Completarás los datos de contacto ✓'
                      : isCarrierBranchPickup(selectedShipping)
                        ? 'Retiro en sucursal del correo · Completarás datos en entrega ✓'
                        : 'Envío a domicilio · Completarás la dirección en entrega ✓'
                    : 'Completarás los datos de entrega en el siguiente paso'}
                </p>

                <button
                  type="button"
                  onClick={() => { onClose?.(); navigate('/carrito'); }}
                  className="w-full text-center text-xs text-primary-orange font-neue underline underline-offset-4"
                >
                  Ver carrito completo
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
