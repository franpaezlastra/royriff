import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { formatPrice, getProductMainImage } from '../../utils/constants';
import { getDisplayName } from '../../utils/productData';
import { fetchProductBySlug } from '../../store/slices/productsSlice';
import { addToCart } from '../../store/slices/cartSlice';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiTruck, FiTool, FiShield, FiMapPin } from 'react-icons/fi';

const MIN_QTY = 1;
const MAX_QTY = 10;

const preloadImage = (src) =>
  new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });

const ProductElegir = () => {
  const { product: productSlug } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (productSlug) dispatch(fetchProductBySlug(productSlug));
  }, [dispatch, productSlug]);

  useEffect(() => {
    if (selectedProduct?.colors?.length) setSelectedColor(selectedProduct.colors[0]);
    else setSelectedColor(null);
  }, [selectedProduct?.colors]);

  useEffect(() => {
    let isCancelled = false;

    const preloadColorImages = async () => {
      if (!selectedProduct) {
        setImagesPreloaded(false);
        return;
      }

      setImagesPreloaded(false);

      const variationByColor = selectedProduct.variationByColor || {};
      const colorImageSources = (selectedProduct.colors || [])
        .map((color) => {
          const variationImageSrc = variationByColor[color.name]?.image?.src;
          const colorImages = selectedProduct.imagesByColor?.[color.name];
          const fallbackColorImageSrc = colorImages && colorImages[0] ? (colorImages[0].src || colorImages[0]) : null;
          return variationImageSrc || fallbackColorImageSrc || null;
        })
        .filter(Boolean);

      if (colorImageSources.length === 0) {
        if (!isCancelled) setImagesPreloaded(true);
        return;
      }

      await Promise.allSettled(colorImageSources.map((src) => preloadImage(src)));
      if (!isCancelled) setImagesPreloaded(true);
    };

    preloadColorImages();

    return () => {
      isCancelled = true;
    };
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct) document.title = `Elegir ${getDisplayName(selectedProduct)} | Roy Riff`;
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const product = selectedProduct;
    const displayName = getDisplayName(product);
    const variationByColor = product.variationByColor || {};
    const currentVariation = selectedColor ? variationByColor[selectedColor.name] : null;
    // Forzar precio efectivo (source of truth: productData.pricing.efectivo)
    // Si WC admin tiene un precio distinto, este override garantiza coherencia con el resto del sitio.
    const price =
      product.pricing?.efectivo ||
      currentVariation?.price ||
      product.price ||
      selectedProduct.price ||
      0;
    const mainImage =
      currentVariation?.image?.src ||
      (product.imagesByColor?.[selectedColor?.name]?.[0]?.src) ||
      getProductMainImage(selectedProduct);
    dispatch(addToCart({
      product: {
        id: selectedProduct.id,
        name: selectedProduct.seoName || selectedProduct.name,
        displayName,
        price,
        slug: selectedProduct.slug,
        image: mainImage,
        images: selectedProduct.images || [],
        selectedColor: selectedColor?.name || null,
        variationId: currentVariation?.id || null,
      },
      quantity,
    }));
    toast.success(quantity > 1 ? `${quantity} × ${displayName} agregadas al carrito` : `${displayName} agregada al carrito`, { duration: 2000 });
  };

  if (loading || (selectedProduct && !imagesPreloaded)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-barlow font-bold text-2xl md:text-3xl text-neutral-black mb-3">Producto no encontrado</h1>
          <p className="text-neutral-darkGreen font-neue mb-6">{error || 'El producto no existe'}</p>
          <Button to="/" variant="outline">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const product = selectedProduct;
  const displayName = getDisplayName(product);
  const colors = product.colors || [];
  const variationByColor = product.variationByColor || {};

  const currentVariation = selectedColor ? variationByColor[selectedColor.name] : null;

  // SOLO la imagen cargada en Variaciones para este color. Ninguna más.
  const colorImagesRaw = product.imagesByColor?.[selectedColor?.name];
  const variationImg = currentVariation?.image || (colorImagesRaw && colorImagesRaw[0]) || null;
  const mainImageElegir = variationImg ? (variationImg.src || variationImg) : null;
  const objectPosition = product.imageObjectPositionByColor?.[selectedColor?.name] || 'center 65%';

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="container-custom py-6 md:py-12 max-w-6xl">
        {/* Breadcrumb sutil */}
        <Link
          to={`/bicicletas-electricas/${product.slug || productSlug}`}
          className="inline-flex items-center gap-2 text-neutral-darkGreen/80 font-neue text-sm hover:text-neutral-black transition-colors mb-6 md:mb-10"
        >
          <FiArrowLeft className="w-4 h-4" aria-hidden />
          Volver a la ficha de {displayName}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Columna imagen — cuadro premium */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <div className="aspect-square max-w-md mx-auto flex items-center justify-center p-2 md:p-3 min-h-[280px]">
                {mainImageElegir ? (
                  <img
                    src={mainImageElegir}
                    alt={selectedColor ? `${displayName} ${selectedColor.name}` : displayName}
                    className="w-full h-full object-contain"
                    style={{ objectPosition }}
                  />
                ) : (
                  <div className="text-center px-6">
                    <p className="font-barlow font-bold text-neutral-black mb-2">Sin imagen para este color</p>
                    <p className="font-neue text-sm text-neutral-darkGreen">
                      Cargá una imagen en la variación de <b>{selectedColor?.name}</b> (WooCommerce → Variaciones).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna opciones */}
          <div>
            <h1 className="font-barlow font-black text-2xl md:text-3xl text-neutral-black tracking-tight mb-1">
              {displayName}
            </h1>
            <p className="text-neutral-darkGreen font-neue text-sm mb-8">
              Elegí color y cantidad para agregar al carrito.
            </p>

            {/* Precio — efectivo prominente + 6 cuotas + legal */}
            <div className="mb-8 bg-[#FCF8F5] border border-neutral-gray/20 rounded-xl p-5">
              {product.pricing ? (
                <>
                  <p className="font-barlow font-black text-3xl md:text-4xl text-primary-orange leading-none">
                    {formatPrice(product.pricing.efectivo)}
                  </p>
                  <p className="font-neue text-sm text-neutral-darkGreen mt-1.5">
                    en efectivo o transferencia bancaria
                  </p>
                  <div className="border-t border-neutral-gray/25 mt-4 pt-4">
                    <p className="font-neue text-base text-neutral-black">
                      o <strong className="font-bold">6 cuotas fijas de {formatPrice(product.pricing.cuota6)}</strong>
                    </p>
                    {product.pricing.ahorro && (
                      <p className="font-neue text-xs text-primary-orange font-bold mt-1">
                        Ahorrás {formatPrice(product.pricing.ahorro)} pagando en efectivo
                      </p>
                    )}
                    <p className="font-neue text-xs text-neutral-darkGreen/80 mt-2 leading-snug">
                      Más planes 3, 9 o 12 cuotas vía Mercado Pago. CFT aplicable según medio de pago.
                    </p>
                  </div>
                </>
              ) : (
                <p className="font-barlow font-black text-3xl text-neutral-black">
                  {formatPrice(currentVariation?.price || product.price || 0)}
                </p>
              )}
            </div>

            {/* Color — misma altura y alineación para ambos botones */}
            {colors.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-medium text-neutral-darkGreen/80 uppercase tracking-wider mb-3">Color</p>
                <div className="flex flex-wrap gap-3 items-stretch">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2.5 px-4 min-h-[48px] rounded-xl border-2 transition-colors duration-200 ${
                        selectedColor?.name === c.name
                          ? 'border-primary-orange bg-primary-orange/5'
                          : 'border-neutral-gray/40 bg-white hover:border-neutral-darkGreen/30'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full flex-shrink-0 border border-neutral-gray/50 shadow-inner"
                        style={{ backgroundColor: c.value }}
                        aria-hidden
                      />
                      <span className="font-neue text-sm font-medium text-neutral-black text-left">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="mb-8">
              <p className="text-xs font-medium text-neutral-darkGreen/80 uppercase tracking-wider mb-3">Cantidad</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(MIN_QTY, q - 1))}
                  className="w-10 h-10 rounded-lg border border-neutral-gray/50 bg-white font-barlow font-bold text-lg text-neutral-black hover:bg-neutral-gray/10 transition-colors"
                  aria-label="Menos"
                >
                  −
                </button>
                <span className="font-barlow font-bold text-xl w-12 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
                  className="w-10 h-10 rounded-lg border border-neutral-gray/50 bg-white font-barlow font-bold text-lg text-neutral-black hover:bg-neutral-gray/10 transition-colors"
                  aria-label="Más"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA principal */}
            <Button
              onClick={handleAddToCart}
              variant="primary"
              className="w-full py-4 text-base font-bold rounded-xl"
            >
              Agregar al carrito
            </Button>

            <a
              href={`https://wa.me/5493812006514?text=${encodeURIComponent(`Hola, quiero consultar sobre ${displayName}${selectedColor ? ` color ${selectedColor.name}` : ''}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center font-neue text-sm text-neutral-darkGreen hover:text-primary-orange transition-colors"
            >
              Consultar por WhatsApp
            </a>

            {/* Cards informativas — envío, armado, garantía, retiro */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-neutral-gray/25 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiTruck className="w-5 h-5 text-primary-orange" aria-hidden />
                  <p className="font-barlow font-black text-sm text-neutral-black uppercase tracking-tight">
                    Envío gratis
                  </p>
                </div>
                <p className="font-neue text-xs text-neutral-darkGreen leading-relaxed">
                  A todo el país. 3-6 días hábiles por paquetería nacional.
                </p>
              </div>

              <div className="bg-white border border-neutral-gray/25 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiTool className="w-5 h-5 text-primary-orange" aria-hidden />
                  <p className="font-barlow font-black text-sm text-neutral-black uppercase tracking-tight">
                    Cómo te llega
                  </p>
                </div>
                <p className="font-neue text-xs text-neutral-darkGreen leading-relaxed">
                  Pre-ensamblada al 85-90%. Manual y videos de armado online. Recomendamos ajuste final por bicicletero.
                </p>
              </div>

              <div className="bg-white border border-neutral-gray/25 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiShield className="w-5 h-5 text-primary-orange" aria-hidden />
                  <p className="font-barlow font-black text-sm text-neutral-black uppercase tracking-tight">
                    Garantía
                  </p>
                </div>
                <p className="font-neue text-xs text-neutral-darkGreen leading-relaxed">
                  2 años cuadro. 1 año electrónica (motor, batería, controlador). Service propio en Yerba Buena.
                </p>
              </div>

              <div className="bg-white border border-neutral-gray/25 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin className="w-5 h-5 text-primary-orange" aria-hidden />
                  <p className="font-barlow font-black text-sm text-neutral-black uppercase tracking-tight">
                    Retiro alternativo
                  </p>
                </div>
                <p className="font-neue text-xs text-neutral-darkGreen leading-relaxed">
                  Si vivís en BsAs o Tucumán, coordinás retiro en Palermo o Yerba Buena por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductElegir;
