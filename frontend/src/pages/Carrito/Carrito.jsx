import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { formatPrice, getProductMainImage } from '../../utils/constants';
import {
  saveCheckoutShipping,
  saveDeliveryContext,
  clearDeliveryContext,
  isStoreLocalPickup,
} from '../../utils/checkoutStorage';
import { LOCAL_PICKUP_OPTION } from '../../utils/localPickupOption';
import Button from '../../components/common/Button';
import ShippingCalculator from '../../components/shipping/ShippingCalculator';
import { FiTrash2, FiPlus, FiMinus, FiCheck, FiTruck } from 'react-icons/fi';

const Carrito = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  /** null = aún no eligió; 'local' | 'delivery' alineado con el drawer */
  const [receiveMode, setReceiveMode] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingContext, setShippingContext] = useState({ postcode: '' });

  const cartSignature = cartItems.map((i) => `${i.lineKey || i.id}:${i.quantity || 1}`).join('|');

  useEffect(() => {
    if (cartItems.length === 0) return;
    if (!selectedShipping || isStoreLocalPickup(selectedShipping)) return;
    setSelectedShipping(null);
  }, [cartSignature]);

  const handleRemove = (lineKey) => {
    dispatch(removeFromCart(lineKey));
  };

  const handleUpdateQuantity = (lineKey, newQuantity) => {
    dispatch(updateQuantity({ lineKey, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (selectedShipping) {
      saveCheckoutShipping(selectedShipping);
      if (isStoreLocalPickup(selectedShipping)) {
        clearDeliveryContext();
      } else {
        const pc = String(shippingContext.postcode || '').replace(/\D/g, '');
        if (pc.length >= 4) saveDeliveryContext({ postcode: pc });
      }
      window.dispatchEvent(new CustomEvent('royriff:checkout-shipping-saved'));
    }
    if (selectedShipping && isStoreLocalPickup(selectedShipping)) {
      navigate('/checkout/pago');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="font-barlow font-bold text-4xl mb-4">Tu carrito está vacío</h1>
          <p className="text-neutral-darkGreen mb-8">Explorá nuestras bicicletas eléctricas</p>
          <Button to="/">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 lg:py-20 min-h-screen bg-primary-beige">
      <div className="container-custom">
        <h1 className="font-barlow font-black text-3xl md:text-4xl mb-2 md:mb-4 uppercase">Tu carrito</h1>
        <p className="text-sm md:text-base text-neutral-darkGreen font-neue mb-6 md:mb-8">
          Revisá tus productos y elegí retiro en Yerba Buena o envío según tu código postal (igual que en el carrito lateral).
        </p>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const displayName = item.displayName || item.fullName || item.name || 'Producto';
              // Obtener imagen del producto usando helper que normaliza URLs
              const productImage = getProductMainImage(item);
              
              return (
              <div key={item.lineKey || item.id} className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6">
                {/* Imagen del producto — más chica, cuadro con fondo blanco */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-neutral-gray/20 flex items-center justify-center">
                  {productImage ? (
                    <img 
                      src={productImage} 
                      alt={displayName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Si la imagen falla al cargar, mostrar placeholder
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span class="font-bold text-lg md:text-2xl text-neutral-black/30 text-center px-2 flex items-center justify-center h-full">${displayName}</span>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-bold text-lg md:text-2xl text-neutral-black/30 text-center px-2">{displayName}</span>
                    </div>
                  )}
                </div>
                
                {/* Contenido principal */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-barlow font-bold text-lg md:text-xl mb-1 break-words">{displayName}</h3>
                  {item.selectedColor && (
                    <p className="text-sm text-neutral-darkGreen font-neue mb-1">
                      <span className="font-barlow font-semibold uppercase tracking-wide text-xs mr-1">Color:</span>
                      {item.selectedColor}
                    </p>
                  )}
                  <p className="text-neutral-darkGreen mb-3 md:mb-4 font-neue">{formatPrice(item.price)}</p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2 border-2 border-neutral-gray rounded">
                      <button
                        onClick={() => handleUpdateQuantity(item.lineKey, item.quantity - 1)}
                        className="p-2 hover:bg-neutral-gray/20 transition-smooth touch-manipulation"
                        aria-label="Reducir cantidad"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="px-3 md:px-4 font-bold font-barlow min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.lineKey, item.quantity + 1)}
                        className="p-2 hover:bg-neutral-gray/20 transition-smooth touch-manipulation"
                        aria-label="Aumentar cantidad"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleRemove(item.lineKey)}
                      className="text-red-500 hover:text-red-700 transition-smooth p-2 flex items-center gap-2 touch-manipulation"
                      aria-label="Eliminar producto"
                    >
                      <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm sm:hidden">Eliminar</span>
                    </button>
                  </div>
                </div>
                
                {/* Precio total del item */}
                <div className="text-right sm:text-left lg:text-right flex-shrink-0">
                  <div className="font-barlow font-bold text-lg md:text-xl">{formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:sticky lg:top-24">
              <h3 className="font-barlow font-bold text-xl md:text-2xl mb-1 md:mb-2">Resumen</h3>
              <p className="text-xs md:text-sm text-neutral-darkGreen font-neue mb-4">
                {receiveMode === 'local'
                  ? 'Retiro gratuito en nuestro local de Yerba Buena, Tucumán.'
                  : shippingContext.postcode
                    ? <>CP <span className="font-semibold">{shippingContext.postcode}</span> · podés cambiarlo recalculando abajo.</>
                    : receiveMode === 'delivery'
                      ? 'Ingresá tu CP y calculá envío a domicilio o retiro en sucursal del correo.'
                      : 'Elegí cómo querés recibir tu pedido.'}
              </p>

              <div className="space-y-2 mb-4">
                <p className="text-[11px] font-semibold text-neutral-darkGreen font-neue uppercase tracking-wider">
                  ¿Cómo recibís tu bici?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReceiveMode('local');
                    setSelectedShipping(LOCAL_PICKUP_OPTION);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                    receiveMode === 'local'
                      ? 'border-primary-orange bg-primary-orange/5'
                      : 'border-neutral-gray/25 bg-white hover:border-neutral-gray/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      receiveMode === 'local' ? 'border-primary-orange bg-primary-orange' : 'border-neutral-gray/40'
                    }`}
                  >
                    {receiveMode === 'local' && <FiCheck className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-barlow font-bold text-sm">Retiro en el local</p>
                    <p className="text-[11px] text-neutral-darkGreen/60 font-neue">Yerba Buena, Tucumán</p>
                  </div>
                  <span className="text-xs font-barlow font-bold text-green-600 whitespace-nowrap">GRATIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReceiveMode('delivery');
                    if (isStoreLocalPickup(selectedShipping)) setSelectedShipping(null);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                    receiveMode === 'delivery'
                      ? 'border-primary-orange bg-primary-orange/5'
                      : 'border-neutral-gray/25 bg-white hover:border-neutral-gray/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      receiveMode === 'delivery' ? 'border-primary-orange bg-primary-orange' : 'border-neutral-gray/40'
                    }`}
                  >
                    {receiveMode === 'delivery' && <FiCheck className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-barlow font-bold text-sm">Envío o sucursal del correo</p>
                    <p className="text-[11px] text-neutral-darkGreen/60 font-neue">Según tu código postal</p>
                  </div>
                  <FiTruck className="w-4 h-4 text-neutral-gray/40 flex-shrink-0" />
                </button>
              </div>

              {receiveMode === 'delivery' && (
                <div className="mb-6">
                  <p className="text-[10px] text-neutral-darkGreen/55 font-neue mb-2 leading-snug">
                    No incluye el retiro en nuestro local: esa opción es la de arriba.
                  </p>
                  <ShippingCalculator
                    restoreShippingId={
                      selectedShipping && !isStoreLocalPickup(selectedShipping)
                        ? selectedShipping.id
                        : undefined
                    }
                    onRestoreFailed={() => setSelectedShipping(null)}
                    onShippingSelected={(option) => {
                      setSelectedShipping(option);
                      setShippingContext((prev) => ({ ...prev }));
                    }}
                    onCalculationResult={(data) => {
                      const pc = String(data?.postcode || '').replace(/\D/g, '');
                      setShippingContext((prev) => ({ ...prev, postcode: pc }));
                      if (pc.length >= 4) saveDeliveryContext({ postcode: pc });
                    }}
                    showTitle={true}
                    className="mb-0"
                  />
                </div>
              )}

              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-neue">Subtotal</span>
                  <span className="font-barlow font-bold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-darkGreen">
                  <span className="font-neue">Envío</span>
                  <span className="font-neue">
                    {selectedShipping ? (
                      Number(selectedShipping.cost) > 0 ? (
                        formatPrice(selectedShipping.cost)
                      ) : (
                        'GRATIS'
                      )
                    ) : (
                      'A calcular'
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-gray pt-4 mb-4 md:mb-6">
                <div className="flex justify-between items-center text-lg md:text-xl font-barlow font-bold">
                  <span>Total</span>
                  <span className="text-primary-orange">
                    {formatPrice(cartTotal + Number(selectedShipping?.cost || 0))}
                  </span>
                </div>
                {selectedShipping && Number(selectedShipping.cost) > 0 && (
                  <p className="text-xs text-neutral-darkGreen mt-2 font-neue">
                    Incluye envío: {selectedShipping.title}
                  </p>
                )}
              </div>

              {/* Medios de pago destacados */}
              <div className="mb-4 md:mb-6">
                <p className="text-xs md:text-sm text-neutral-darkGreen font-neue mb-2">
                  Pagás de forma segura con:
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <img
                    src="https://http2.mlstatic.com/storage/cpp/static-files/863dde6d-4e18-43f8-bcde-7905aa7a962e.svg"
                    alt="Mercado Pago"
                    className="h-6 md:h-7 w-auto"
                    loading="lazy"
                  />
                  <img
                    src="https://http2.mlstatic.com/storage/cpp/static-files/2e565181-724f-4987-88b1-005b3011ee38.png"
                    alt="Visa"
                    className="h-6 md:h-7 w-auto"
                    loading="lazy"
                  />
                  <img
                    src="https://http2.mlstatic.com/storage/cpp/static-files/1b729977-6241-43bf-a84b-e4fa8c00ca85.png"
                    alt="Mastercard"
                    className="h-6 md:h-7 w-auto"
                    loading="lazy"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full mb-2 text-base md:text-lg py-3 md:py-4"
                onClick={handleCheckout}
              >
                Iniciar compra
              </Button>

              <p className="text-[11px] text-neutral-darkGreen/60 font-neue text-center mb-4">
                {selectedShipping
                  ? isStoreLocalPickup(selectedShipping)
                    ? 'Retiro en Yerba Buena · Irás directo al pago'
                    : `Irás directo al pago · ${selectedShipping.title}`
                  : receiveMode === 'delivery'
                    ? 'Calculá el envío arriba o seguí al checkout para completar datos.'
                    : 'Elegí retiro o envío, o seguí al checkout para definirlo allí.'}
              </p>
              
              <Link to="/" className="block text-center text-primary-orange hover:underline text-sm md:text-base font-neue">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
