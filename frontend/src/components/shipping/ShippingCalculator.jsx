import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../store/slices/cartSlice';
import { calculateShipping } from '../../services/woocommerceService';
import { formatPrice } from '../../utils/constants';
import {
  filterDuplicateStoreRates,
  isDoorDeliveryOption,
  isCarrierBranchPickup,
} from '../../utils/shippingClassify';
import LoadingSpinner from '../common/LoadingSpinner';
import BranchSucursalInfo from './BranchSucursalInfo';
import { FiTruck, FiMapPin, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
const ANDREANI_LOGO_URL =
  'https://api.royriff.com.ar/wp-content/uploads/2026/04/correo_andreani_-removebg-preview-e1776259635246.webp';

/**
 * Calculador de envío reutilizable
 * Se puede usar en Carrito, Checkout, ProductDetail, etc.
 * 
 * @param {Object} props
 * @param {Function} [props.onShippingSelected] - Callback cuando se selecciona un método (recibe {id, title, cost, method_id})
 * @param {Function} [props.onCalculationResult] - Callback cuando se obtiene la respuesta completa ({ postcode, options })
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {boolean} [props.showTitle=true] - Mostrar título "Calcular envío"
 * @param {Array} [props.customItems] - Productos personalizados (si no se usa, toma del carrito)
 * @param {boolean} [props.compact=false] - Versión compacta (para drawer móvil)
 * @param {string} [props.initialPostcode] - Código postal inicial (para autocalcular al cambiar productos)
 * @param {boolean} [props.autoCalculateOnMount=false] - Si es true, calcula automáticamente cuando hay CP
 * @param {string|number} [props.autoCalculateKey] - Llave para volver a autocalcular (ej: firma del carrito)
 * @param {string} [props.restoreShippingId] - Tras calcular, re-seleccionar esta tarifa si sigue existiendo (evita forzar domicilio)
 * @param {Function} [props.onRestoreFailed] - Si restoreShippingId ya no está en las opciones (cambió el carrito/CP)
 */
const ShippingCalculator = ({ 
  onShippingSelected, 
  onCalculationResult,
  className = '', 
  showTitle = true,
  customItems = null,
  compact = false,
  initialPostcode = '',
  autoCalculateOnMount = false,
  autoCalculateKey,
  restoreShippingId,
  onRestoreFailed,
}) => {
  const cartItems = useSelector(selectCartItems);
  const items = customItems || cartItems;

  const [postcode, setPostcode] = useState(initialPostcode || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [calculated, setCalculated] = useState(false);

  const getDisplayShippingTitle = (option, isDeliveryGroup) => {
    const raw = option?.title || 'Envío';
    const hasEstandar = /est[aá]ndar/i.test(raw);
    if (isDeliveryGroup && hasEstandar) {
      return `${raw} (envío a domicilio)`;
    }
    return raw;
  };

  const doCalculate = async () => {
    if (!postcode.trim()) {
      toast.error('Ingresá tu código postal');
      return;
    }

    if (items.length === 0) {
      toast.error('Agregá productos al carrito primero');
      return;
    }

    setLoading(true);
    setShippingOptions([]);
    setSelectedShipping(null);
    setCalculated(false);

    try {
      const result = await calculateShipping({
        postcode: postcode.trim(),
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        line_items: items,
      });

      if (onCalculationResult && result) {
        onCalculationResult(result);
      }

      const filtered = filterDuplicateStoreRates(result.options || []);
      if (filtered.length > 0) {
        setShippingOptions(filtered);
        setCalculated(true);

        // Nunca forzar domicilio si hay varias tarifas: el usuario elige (como Tiendanube / Místico).
        if (filtered.length === 1) {
          handleSelectShipping(filtered[0]);
        } else if (restoreShippingId) {
          const restored = filtered.find((o) => o.id === restoreShippingId);
          if (restored) {
            handleSelectShipping(restored);
          } else {
            setSelectedShipping(null);
            onRestoreFailed?.();
          }
        } else {
          setSelectedShipping(null);
        }
      } else {
        toast('No hay opciones de envío disponibles para este código postal', { duration: 4000 });
        setCalculated(true);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error al calcular envío';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async (e) => {
    e?.preventDefault();
    await doCalculate();
  };

  // Autocalcular (por ejemplo cuando cambian productos en el carrito)
  useEffect(() => {
    if (!autoCalculateOnMount) return;
    if (!autoCalculateKey && autoCalculateKey !== 0) return;
    if (!postcode.trim()) return;
    if (items.length === 0) return;
    // Debounce suave para evitar múltiples llamadas seguidas
    const t = setTimeout(() => {
      doCalculate();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCalculateKey]);

  const handleSelectShipping = (option) => {
    setSelectedShipping(option);
    if (onShippingSelected) {
      onShippingSelected(option);
    }
  };

  // Provincias de Argentina
  const argentinaProvinces = [
    { value: '', label: 'Seleccionar provincia' },
    { value: 'CABA', label: 'Ciudad Autónoma de Buenos Aires' },
    { value: 'BA', label: 'Buenos Aires' },
    { value: 'CT', label: 'Catamarca' },
    { value: 'CC', label: 'Chaco' },
    { value: 'CH', label: 'Chubut' },
    { value: 'CB', label: 'Córdoba' },
    { value: 'CR', label: 'Corrientes' },
    { value: 'ER', label: 'Entre Ríos' },
    { value: 'FO', label: 'Formosa' },
    { value: 'JY', label: 'Jujuy' },
    { value: 'LP', label: 'La Pampa' },
    { value: 'LR', label: 'La Rioja' },
    { value: 'MZ', label: 'Mendoza' },
    { value: 'MN', label: 'Misiones' },
    { value: 'NQ', label: 'Neuquén' },
    { value: 'RN', label: 'Río Negro' },
    { value: 'SA', label: 'Salta' },
    { value: 'SJ', label: 'San Juan' },
    { value: 'SL', label: 'San Luis' },
    { value: 'SC', label: 'Santa Cruz' },
    { value: 'SF', label: 'Santa Fe' },
    { value: 'SE', label: 'Santiago del Estero' },
    { value: 'TF', label: 'Tierra del Fuego' },
    { value: 'TM', label: 'Tucumán' },
  ];

  return (
    <div
      className={`bg-white rounded-lg shadow-md ${
        compact ? 'p-3 md:p-4' : 'p-4 md:p-6'
      } ${className}`}
    >
      {showTitle && (
        <div className="flex items-center gap-2 mb-3">
          <FiTruck className="w-5 h-5 text-primary-orange" />
          <h3 className="font-barlow font-bold text-base md:text-lg">
            Calcular envío
          </h3>
        </div>
      )}

      <form onSubmit={handleCalculate} className={compact ? 'space-y-2' : 'space-y-4'}>
        {/* Versión compacta: solo código postal y botón */}
        {compact ? (
          <>
            <div>
              <label
                htmlFor="shipping-postcode"
                className="block text-xs font-medium text-neutral-darkGreen mb-1"
              >
                Código Postal <span className="text-red-500">*</span>
              </label>
              <div className="rr-postcode-field flex min-h-[44px] items-center gap-2.5 w-full rounded-lg border border-neutral-gray bg-white px-3 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] focus-within:border-primary-orange focus-within:ring-1 focus-within:ring-primary-orange/25">
                <FiMapPin className="shrink-0 w-4 h-4 text-neutral-gray pointer-events-none" aria-hidden />
                <input
                  id="shipping-postcode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={postcode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setPostcode(value);
                    setCalculated(false);
                  }}
                  placeholder="Ej: 1000"
                  className="rr-postcode-input min-h-0 min-w-0 flex-1 border-0 bg-transparent py-2.5 font-neue text-sm leading-normal tracking-normal text-neutral-black placeholder:text-neutral-gray/75 focus:outline-none focus:ring-0"
                  required
                />
              </div>
            </div>
          </>
        ) : (
          // Versión completa: CP + ciudad + provincia
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Código Postal */}
            <div>
              <label
                htmlFor="shipping-postcode"
                className="block text-sm font-medium text-neutral-darkGreen mb-1"
              >
                Código Postal <span className="text-red-500">*</span>
              </label>
              <div className="rr-postcode-field flex min-h-[48px] items-center gap-2.5 w-full rounded-lg border-2 border-neutral-gray bg-white px-3 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] focus-within:border-primary-orange focus-within:ring-1 focus-within:ring-primary-orange/25">
                <FiMapPin className="shrink-0 w-4 h-4 text-neutral-gray pointer-events-none" aria-hidden />
                <input
                  id="shipping-postcode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={postcode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setPostcode(value);
                    setCalculated(false);
                  }}
                  placeholder="Ej: 1000"
                  className="rr-postcode-input min-h-0 min-w-0 flex-1 border-0 bg-transparent py-2.5 font-neue text-base leading-normal tracking-normal text-neutral-black placeholder:text-neutral-gray/75 focus:outline-none focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Ciudad */}
            <div>
              <label
                htmlFor="shipping-city"
                className="block text-sm font-medium text-neutral-darkGreen mb-1"
              >
                Ciudad
              </label>
              <input
                id="shipping-city"
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setCalculated(false);
                }}
                placeholder="Ej: Buenos Aires"
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded-lg focus:border-primary-orange focus:outline-none font-neue"
              />
            </div>

            {/* Provincia */}
            <div>
              <label
                htmlFor="shipping-state"
                className="block text-sm font-medium text-neutral-darkGreen mb-1"
              >
                Provincia
              </label>
              <select
                id="shipping-state"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCalculated(false);
                }}
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded-lg focus:border-primary-orange focus:outline-none font-neue"
              >
                {argentinaProvinces.map((prov) => (
                  <option key={prov.value} value={prov.value}>
                    {prov.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !postcode.trim() || items.length === 0}
          className={`w-full md:w-auto px-6 ${
            compact ? 'py-2 text-xs md:text-sm' : 'py-2'
          } bg-primary-orange text-white rounded-lg font-barlow font-bold hover:bg-primary-orange/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Calculando...
            </>
          ) : (
            <>
              <FiTruck className="w-4 h-4" />
              Calcular envío
            </>
          )}
        </button>
      </form>

      {/* Resultados */}
      {calculated && shippingOptions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-neutral-gray/20 space-y-4">
          {(() => {
            const deliveryOptions = shippingOptions.filter(isDoorDeliveryOption);
            const branchOptions = shippingOptions.filter(isCarrierBranchPickup);

            const renderGroup = (title, subtitle, options, isDeliveryGroup = false) => {
              if (!options.length) return null;
              return (
                <div className="space-y-2">
                  <h4 className="font-barlow font-bold text-sm uppercase tracking-wide text-neutral-darkGreen">
                    {title}
                  </h4>
                  {subtitle && (
                    <p className="text-[11px] text-neutral-darkGreen/60 font-neue leading-snug -mt-1 mb-1">
                      {subtitle}
                    </p>
                  )}
                  {options.map((option) => {
                    const isSelected = selectedShipping?.id === option.id;
                    const optionTitle = option.title || '';
                    const displayTitle = getDisplayShippingTitle(option, isDeliveryGroup);
                    const isAndreani = optionTitle.toLowerCase().includes('andreani');
                    const costNum = Number(option.cost);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectShipping(option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-smooth ${
                          isSelected
                            ? 'border-primary-orange bg-primary-orange/5'
                            : 'border-neutral-gray/30 hover:border-primary-orange/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            {isSelected && <FiCheck className="w-5 h-5 text-primary-orange shrink-0" />}
                            <div className="min-w-0">
                              {isAndreani && (
                                <img
                                  src={ANDREANI_LOGO_URL}
                                  alt="Andreani"
                                  className="h-4 w-auto mb-1 object-contain"
                                  loading="lazy"
                                />
                              )}
                              <p
                                className={`font-barlow font-bold text-neutral-black ${
                                  isAndreani ? 'text-xs' : 'text-sm'
                                }`}
                              >
                                {displayTitle}
                              </p>
                              <p
                                className={`text-sm font-neue ${
                                  costNum > 0 ? 'text-neutral-darkGreen' : 'text-green-600'
                                } ${isAndreani ? 'text-xs' : ''}`}
                              >
                                {costNum > 0 ? formatPrice(option.cost) : 'GRATIS'}
                              </p>
                            </div>
                          </div>
                          {costNum > 0 && (
                            <span
                              className={`font-barlow font-bold text-primary-orange shrink-0 ${
                                isAndreani ? 'text-base' : 'text-lg'
                              }`}
                            >
                              {formatPrice(option.cost)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            };

            return (
              <>
                {renderGroup(
                  'Envío a domicilio',
                  'Llevamos el pedido a la dirección que indiques en el checkout.',
                  deliveryOptions,
                  true
                )}
                {renderGroup(
                  'Retiro en sucursal del transporte',
                  'Retirás en una sucursal Andreani (u otro correo), no en el local Roy Riff de Yerba Buena.',
                  branchOptions,
                  false
                )}
                {selectedShipping && isCarrierBranchPickup(selectedShipping) && (
                  <BranchSucursalInfo title={selectedShipping.title} compact className="mt-1" />
                )}
              </>
            );
          })()}
        </div>
      )}

      {calculated && shippingOptions.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-neue">
            No hay opciones de envío disponibles para este código postal. Contactanos para coordinar el envío.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;
