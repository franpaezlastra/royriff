import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiX, FiTrash2, FiPlus, FiMinus, FiMapPin, FiTruck, FiCheck } from 'react-icons/fi';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
} from '../../store/slices/cartSlice';
import { formatPrice, getProductMainImage } from '../../utils/constants';
import { saveCheckoutShipping, isPickupOption } from '../../utils/checkoutStorage';
import ShippingCalculator from '../shipping/ShippingCalculator';
import Button from '../common/Button';

// Opción estática de retiro en el local (siempre disponible, no depende del CP)
const LOCAL_PICKUP_OPTION = {
  id: 'local_pickup',
  method_id: 'local_pickup',
  title: 'Retiro en el local',
  cost: 0,
  _isStatic: true,
};

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [selectedShipping, setSelectedShipping] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);

  const handleRemove = (lineKey) => dispatch(removeFromCart(lineKey));
  const handleUpdateQuantity = (lineKey, qty) =>
    dispatch(updateQuantity({ lineKey, quantity: qty }));

  const handleSelectPickup = () => setSelectedShipping(LOCAL_PICKUP_OPTION);
  const handleSelectCalculated = (opt) => setSelectedShipping(opt);

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) return;
    onClose?.();
    if (selectedShipping) {
      saveCheckoutShipping(selectedShipping);
      navigate('/checkout/pago');
    } else {
      navigate('/checkout');
    }
  };

  const hasItems = cartItems.length > 0;
  const isPickup = isPickupOption(selectedShipping) || selectedShipping?.id?.toString().startsWith('local_pickup');

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

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
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
                    className="flex gap-3 border border-neutral-gray/15 rounded-lg p-3"
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-white rounded-md overflow-hidden border border-neutral-gray/15 flex items-center justify-center">
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
                        <p className="font-barlow font-bold text-sm leading-snug truncate">
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
                            className="p-1.5 hover:bg-neutral-gray/10 transition-smooth"
                          >
                            <FiMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold font-barlow min-w-[1.75rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.lineKey, item.quantity + 1)}
                            className="p-1.5 hover:bg-neutral-gray/10 transition-smooth"
                          >
                            <FiPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.lineKey)}
                          className="text-red-400 hover:text-red-600 transition-smooth p-1.5"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Resumen + Entrega */}
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
                    selectedShipping && isPickupOption(selectedShipping)
                      ? 'border-primary-orange bg-primary-orange/5'
                      : 'border-neutral-gray/25 bg-white hover:border-neutral-gray/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      selectedShipping && isPickupOption(selectedShipping)
                        ? 'border-primary-orange bg-primary-orange'
                        : 'border-neutral-gray/40'
                    }`}
                  >
                    {isPickupOption(selectedShipping) && (
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
                      if (isPickupOption(selectedShipping) || !selectedShipping) {
                        setSelectedShipping(null);
                        setShowCalculator(true);
                      }
                      setShowCalculator((prev) => !prev || !!selectedShipping);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                      selectedShipping && !isPickupOption(selectedShipping)
                        ? 'border-primary-orange bg-primary-orange/5'
                        : 'border-neutral-gray/25 bg-white hover:border-neutral-gray/50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        selectedShipping && !isPickupOption(selectedShipping)
                          ? 'border-primary-orange bg-primary-orange'
                          : 'border-neutral-gray/40'
                      }`}
                    >
                      {selectedShipping && !isPickupOption(selectedShipping) && (
                        <FiCheck className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-barlow font-bold text-sm">
                        {selectedShipping && !isPickupOption(selectedShipping)
                          ? selectedShipping.title
                          : 'Envío a domicilio'}
                      </p>
                      <p className="text-[11px] text-neutral-darkGreen/60 font-neue">
                        {selectedShipping && !isPickupOption(selectedShipping)
                          ? 'Seleccionado'
                          : 'Ingresá tu CP para ver opciones'}
                      </p>
                    </div>
                    {selectedShipping && !isPickupOption(selectedShipping) && (
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
                    {(!selectedShipping || isPickupOption(selectedShipping)) && (
                      <FiTruck className="w-4 h-4 text-neutral-gray/40 flex-shrink-0" />
                    )}
                  </button>

                  {/* Calculador compacto — se muestra al hacer click en "Envío a domicilio" */}
                  {showCalculator && !isPickupOption(selectedShipping) && (
                    <div className="rounded-lg border border-neutral-gray/20 bg-white overflow-hidden">
                      <ShippingCalculator
                        showTitle={false}
                        compact
                        className="shadow-none border-0 bg-transparent"
                        onShippingSelected={(opt) => {
                          handleSelectCalculated(opt);
                          setShowCalculator(false);
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

                <Button
                  variant="primary"
                  className="w-full py-3.5 text-sm font-bold"
                  onClick={handleGoToCheckout}
                >
                  Iniciar compra
                </Button>

                <p className="text-[11px] text-neutral-darkGreen/50 font-neue text-center leading-tight">
                  {selectedShipping
                    ? isPickup
                      ? 'Irás directo al paso de pago ✓'
                      : `Envío seleccionado · Irás directo al pago ✓`
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
