import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { formatPrice, getProductMainImage } from '../../utils/constants';
import { saveCheckoutShipping, isPickupOption } from '../../utils/checkoutStorage';
import Button from '../../components/common/Button';
import ShippingCalculator from '../../components/shipping/ShippingCalculator';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const Carrito = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingContext, setShippingContext] = useState({ postcode: '' });

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
          Revisá tus productos, calculá el envío y elegí cómo recibir tu bici.
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
                        className="p-2 hover:bg-neutral-gray/20 transition-smooth"
                        aria-label="Reducir cantidad"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="px-3 md:px-4 font-bold font-barlow min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.lineKey, item.quantity + 1)}
                        className="p-2 hover:bg-neutral-gray/20 transition-smooth"
                        aria-label="Aumentar cantidad"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleRemove(item.lineKey)}
                      className="text-red-500 hover:text-red-700 transition-smooth p-2 flex items-center gap-2"
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
                {shippingContext.postcode
                  ? <>Entrega estimada para el CP <span className="font-semibold">{shippingContext.postcode}</span>. Podés cambiarlo arriba.</>
                  : 'Ingresá tu código postal para ver las opciones de envío disponibles.'}
              </p>
              
              {/* Calculador de envío */}
              <div className="mb-6">
                <ShippingCalculator
                  onShippingSelected={(option) => {
                    setSelectedShipping(option);
                    setShippingContext((prev) => ({ ...prev }));
                  }}
                  onCalculationResult={(data) => {
                    setShippingContext((prev) => ({ ...prev, postcode: data.postcode || '' }));
                  }}
                  showTitle={true}
                  className="mb-0"
                />
              </div>

              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-neue">Subtotal</span>
                  <span className="font-barlow font-bold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-darkGreen">
                  <span className="font-neue">Envío</span>
                  <span className="font-neue">
                    {selectedShipping ? (
                      selectedShipping.cost > 0 ? (
                        formatPrice(selectedShipping.cost)
                      ) : (
                        'A calcular'
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
                    {formatPrice(cartTotal + (selectedShipping?.cost || 0))}
                  </span>
                </div>
                {selectedShipping && selectedShipping.cost > 0 && (
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
                  ? `Irás directo al pago · ${selectedShipping.title}`
                  : 'Completarás los datos de entrega en el siguiente paso'}
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
