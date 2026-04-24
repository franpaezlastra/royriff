import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductMainImage, getProductMainImagePreferring } from '../../utils/constants';
import { getDisplayName, getProductDetailImageOverride } from '../../utils/productData';
import { fetchProductBySlug } from '../../store/slices/productsSlice';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductPriceBlock from '../../components/product/ProductPriceBlock';
import {
  FiChevronDown,
  FiChevronUp,
  FiTruck,
  FiShield,
  FiTool,
  FiZap,
  FiCpu,
  FiSun,
  FiBattery,
  FiArrowUp,
  FiCheck,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const BENEFIT_ICONS = [FiZap, FiCpu, FiSun, FiBattery];

const ProductDetail = () => {
  const { product: productSlug } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const [faqOpen, setFaqOpen] = useState(null);
  const [pickedColor, setPickedColor] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (productSlug) {
      dispatch(fetchProductBySlug(productSlug));
    }
  }, [dispatch, productSlug]);

  useEffect(() => {
    if (selectedProduct) {
      const title = selectedProduct.meta?.title || selectedProduct.seoName || selectedProduct.name || 'Producto';
      document.title = `${title} | Roy Riff`;
      const desc = selectedProduct.meta?.description;
      if (desc) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = desc;
      }
    }
  }, [selectedProduct]);

  useEffect(() => {
    const first = selectedProduct?.colors?.[0]?.name;
    setPickedColor(first ?? null);
  }, [selectedProduct?.slug, selectedProduct?.colors]);

  const whatsappMessage = selectedProduct
    ? `Hola, quiero consultar sobre la bici ${getDisplayName(selectedProduct)}`
    : 'Hola, quiero consultar sobre sus bicicletas eléctricas';
  const whatsappUrl = `https://wa.me/5493812006514?text=${encodeURIComponent(whatsappMessage)}`;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-beige">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-beige">
        <div className="text-center">
          <h1 className="font-barlow font-bold text-4xl mb-4">Producto no encontrado</h1>
          <p className="text-neutral-darkGreen mb-4">{error || 'El producto no existe'}</p>
          <Button to="/">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const product = selectedProduct;
  const displayName = getDisplayName(product);
  const isLola = (product.slug || '').toLowerCase().includes('lola');
  const detailImageOverride = getProductDetailImageOverride(product.slug || productSlug);
  const mainImageBase = detailImageOverride?.hero
    ? detailImageOverride.hero
    : isLola
      ? getProductMainImagePreferring(product, 'izquierda-frente-negra')
      : getProductMainImage(product);
  const mainImage =
    (pickedColor && detailImageOverride?.byColor?.[pickedColor]) ||
    mainImageBase;
  const hero = product.hero || {};
  const desc = product.description || {};
  const trust = product.trustBlock || {};
  const faq = product.faq || [];
  const specsTable = product.specsTable || [];
  const colors = product.colors || [];
  const storySplit = desc.storySplit;
  const bottomBeneficios = desc.bottomBeneficios || [];
  const legacyBeneficios = desc.beneficios || [];
  const beneficiosForLegacy = legacyBeneficios;
  const firstBeneficio = beneficiosForLegacy[0];
  const restBeneficios = beneficiosForLegacy.slice(1);
  const specHighlightRows = specsTable.slice(0, 4);
  const midSpecs = Math.ceil(specsTable.length / 2);
  const specsLeft = specsTable.slice(0, midSpecs);
  const specsRight = specsTable.slice(midSpecs);
  const splitImageSrc =
    detailImageOverride?.inPage?.[0] ||
    (product.images?.length > 1 ? product.images[1]?.src || product.images[1] : null);

  const heroCatalogStyle = Boolean(detailImageOverride?.hero);
  const splitCatalogStyle = Boolean(detailImageOverride?.inPage?.[0]);

  const heroObjectPosition =
    !heroCatalogStyle && pickedColor && product.imageObjectPositionByColor?.[pickedColor]
      ? product.imageObjectPositionByColor[pickedColor]
      : 'center';

  return (
    <div className="min-h-screen text-neutral-black">

      {/* ═══════════════════════════════════════════
          HERO — Compacto, enfocado en el producto
          ═══════════════════════════════════════════ */}
      <section className="bg-white py-6 md:py-10">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-0 rounded-[1.75rem] overflow-hidden bg-white shadow-sm">
          <div className="order-2 md:order-1 flex flex-col justify-center px-5 sm:px-8 lg:px-14 xl:px-20 py-10 md:py-14 lg:py-16">
            <p className="font-barlow font-bold text-xs tracking-[0.25em] text-neutral-darkGreen/60 uppercase mb-3">
              {hero.productTitle || displayName}
            </p>

            <h1 className="font-barlow font-black text-2xl sm:text-3xl lg:text-[2.5rem] leading-[1.1] tracking-tight text-neutral-black mb-4">
              {hero.h1 || product.seoName || product.name}
            </h1>

            {hero.h2 && (
              <p className="font-neue text-neutral-darkGreen text-base md:text-lg leading-relaxed mb-6 max-w-lg">
                {hero.h2}
              </p>
            )}

            {hero.highlights && hero.highlights.length > 0 && (
              <ul className="space-y-2 mb-6 max-w-lg">
                {hero.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 mt-0.5 text-primary-orange shrink-0" />
                    <span className="font-neue text-sm md:text-[0.95rem] text-neutral-darkGreen leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            <ProductPriceBlock product={product} />

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button
                to={`/bicicletas-electricas/${product.slug || productSlug}/elegir`}
                variant="primary"
                className="rounded-full px-8 py-3.5"
              >
                Elegir {displayName}
              </Button>
              <Button to="/test-ride-tucuman" variant="secondary" className="rounded-full px-8 py-3.5">
                Agendar test ride
              </Button>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-neue text-sm font-semibold text-green-600 hover:text-green-500 transition-colors mt-4 self-start"
            >
              <FaWhatsapp className="w-4 h-4" />
              Consultar por WhatsApp
            </a>
          </div>

          {heroCatalogStyle ? (
            <div className="order-1 md:order-2 flex min-h-[34vh] items-center justify-center bg-neutral-black/5 md:min-h-0">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={displayName}
                  className="h-auto w-full max-h-[min(46vh,520px)] object-contain object-center md:max-h-[min(62vh,620px)]"
                />
              ) : (
                <div className="flex min-h-[34vh] w-full items-center justify-center md:min-h-[280px]">
                  <span className="font-barlow font-black text-4xl text-neutral-black/15">{displayName}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="order-1 md:order-2 relative min-h-[34vh] bg-neutral-black/5 md:min-h-0">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={displayName}
                  style={{ objectPosition: heroObjectPosition }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-barlow font-black text-4xl text-neutral-black/15">{displayName}</span>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HISTORIA — Fondo blanco, storytelling
          ═══════════════════════════════════════════ */}
      {storySplit ? (
        <section className="bg-neutral-black text-white py-16 md:py-24">
          <div className="container-custom">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14 lg:gap-20 md:items-center">
              <div className="order-2 md:order-1 space-y-5 max-w-xl md:max-w-none">
                <h2 className="font-barlow font-black text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
                  {storySplit.title}
                </h2>
                {storySplit.paragraphs?.map((p, i) => (
                  <p key={i} className="font-neue text-white/80 text-base md:text-lg leading-relaxed">
                    {p}
                  </p>
                ))}

                {storySplit.sectionHeading && (
                  <h3 className="font-barlow font-black text-2xl md:text-3xl text-white pt-4">
                    {storySplit.sectionHeading}
                  </h3>
                )}

                {storySplit.leadCard && (
                  <div className="border-l-[3px] border-primary-orange pl-5 pt-1 space-y-2">
                    <h4 className="font-barlow font-black text-xl md:text-2xl text-white">
                      {storySplit.leadCard.titulo}
                    </h4>
                    <p className="font-neue text-white/80 text-base md:text-lg leading-relaxed">
                      {storySplit.leadCard.texto}
                    </p>
                  </div>
                )}
              </div>

              <div className="order-1 md:order-2">
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src={storySplit.image}
                    alt={displayName}
                    className="w-full h-auto max-h-[min(72vh,640px)] object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Fallback legacy layout */
        <>
          {desc.sectionTitle && (
            <section className="bg-white py-16 md:py-24">
              <div className="container-custom text-center max-w-3xl mx-auto">
                <h2 className="font-barlow font-black text-3xl md:text-4xl lg:text-5xl text-neutral-black mb-8 leading-tight">
                  {desc.sectionTitle}
                </h2>
                {desc.paragraphs?.map((p, i) => (
                  <p key={i} className="font-neue text-neutral-darkGreen text-base md:text-lg leading-relaxed mb-5 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          )}

          {desc.beneficiosTitle && beneficiosForLegacy.length > 0 && (
            <section className="bg-neutral-black text-white py-16 md:py-24">
              <div className="container-custom space-y-12 md:space-y-16">
                <h3 className="font-barlow font-black text-2xl md:text-3xl text-center !text-white">
                  {desc.beneficiosTitle}
                </h3>
                {firstBeneficio && splitImageSrc && (
                  <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
                    <div className="flex min-h-[240px] items-center justify-center overflow-hidden rounded-2xl bg-white/10 shadow-lg aspect-[4/3] md:aspect-auto md:min-h-[320px]">
                      <img
                        src={splitImageSrc}
                        alt={displayName}
                        className={
                          splitCatalogStyle
                            ? 'max-h-[min(52vh,380px)] w-full object-contain md:max-h-[400px]'
                            : 'h-full w-full object-cover'
                        }
                      />
                    </div>
                    <div>
                      <h4 className="font-barlow font-black text-2xl md:text-3xl mb-5">{firstBeneficio.titulo}</h4>
                      <p className="font-neue text-white/80 text-base md:text-lg leading-relaxed">{firstBeneficio.texto}</p>
                    </div>
                  </div>
                )}
                {splitImageSrc && restBeneficios.length > 0 && (
                  <div
                    className={`grid gap-8 md:gap-10 ${
                      restBeneficios.length >= 3 ? 'md:grid-cols-3' : restBeneficios.length === 2 ? 'md:grid-cols-2' : 'max-w-xl mx-auto'
                    }`}
                  >
                    {restBeneficios.map((b, i) => {
                      const Icon = BENEFIT_ICONS[(i + 1) % BENEFIT_ICONS.length];
                      return (
                        <div key={b.titulo} className="text-center md:text-left">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-primary-orange mb-5 mx-auto md:mx-0">
                            <Icon className="w-7 h-7" aria-hidden />
                          </div>
                          <h4 className="font-barlow font-bold text-lg md:text-xl mb-3">{b.titulo}</h4>
                          <p className="font-neue text-white/70 text-sm md:text-base leading-relaxed">{b.texto}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!splitImageSrc && (
                  <div
                    className={`grid gap-8 md:gap-10 ${
                      beneficiosForLegacy.length >= 3
                        ? 'md:grid-cols-3'
                        : beneficiosForLegacy.length === 2
                          ? 'md:grid-cols-2'
                          : 'max-w-xl mx-auto'
                    }`}
                  >
                    {beneficiosForLegacy.map((b, i) => {
                      const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
                      return (
                        <div key={b.titulo} className="text-center md:text-left">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-primary-orange mb-5 mx-auto md:mx-0">
                            <Icon className="w-7 h-7" aria-hidden />
                          </div>
                          <h4 className="font-barlow font-bold text-lg md:text-xl mb-3">{b.titulo}</h4>
                          <p className="font-neue text-white/70 text-sm md:text-base leading-relaxed">{b.texto}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════
          BENEFICIOS — Fondo negro, contraste visual
          ═══════════════════════════════════════════ */}
      {bottomBeneficios.length > 0 && (
        <section className="bg-neutral-black text-white py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="order-1 flex justify-center">
                  <div className="p-2 md:p-4 w-full max-w-xl">
                  {hero.productTitle && (
                    <p className="font-barlow font-bold text-xs tracking-[0.22em] text-white/50 uppercase mb-4 text-center">
                      {hero.productTitle}
                    </p>
                  )}
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt={displayName}
                      className="w-full h-auto max-h-[420px] object-contain object-center mx-auto drop-shadow-2xl"
                    />
                  )}
                  {colors.length > 0 && (
                    <div className="mt-6">
                      <div className="flex flex-wrap justify-center gap-3 mb-2">
                        {colors.map((c) => {
                          const active = pickedColor === c.name;
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => setPickedColor(c.name)}
                              className={`w-10 h-10 rounded-full border-2 transition-all ${
                                active
                                  ? 'border-primary-orange ring-2 ring-primary-orange/40 scale-110'
                                  : 'border-white/30 hover:border-white/60'
                              }`}
                              style={{ backgroundColor: c.value }}
                              aria-label={c.name}
                              aria-pressed={active}
                            />
                          );
                        })}
                      </div>
                      {pickedColor && (
                        <p className="font-barlow font-bold text-sm tracking-[0.2em] text-white/70 uppercase text-center">
                          {pickedColor}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

                <div className="order-2 space-y-7 w-full max-w-xl mx-auto lg:mx-0">
                  {bottomBeneficios.map((b, i) => {
                    return (
                      <div key={b.titulo} className="text-left">
                        <h4 className="font-barlow font-bold text-xl md:text-2xl text-primary-orange mb-2">{b.titulo}</h4>
                        <p className="font-neue text-white/75 text-sm md:text-base leading-relaxed">{b.texto}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FICHA TÉCNICA — Fondo beige, specs destacados + tabla
          ═══════════════════════════════════════════ */}
      {specsTable.length > 0 && (
        <section className="bg-primary-beige py-16 md:py-24">
          <div className="container-custom">
            {specHighlightRows.length > 0 && (
              <div className="text-center mb-16 md:mb-20">
                <h2 className="font-barlow font-black text-3xl md:text-4xl text-neutral-black mb-12 md:mb-14">
                  Ficha Técnica Detallada
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {specHighlightRows.map((row, idx) => {
                    const Icon = [FiCpu, FiBattery, FiSun, FiZap][idx] || FiCheck;
                    return (
                      <article
                        key={row.caracteristica}
                        className="rounded-2xl border border-neutral-gray/30 bg-white/80 px-4 py-5 md:px-5 md:py-6 text-center min-h-[210px] flex flex-col items-center"
                      >
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-orange/10 text-primary-orange mb-3">
                          <Icon className="w-5 h-5" aria-hidden />
                        </div>
                        <p className="font-barlow font-bold text-[10px] sm:text-[11px] tracking-[0.14em] text-neutral-darkGreen/80 uppercase mb-2">
                          {row.caracteristica}
                        </p>
                        <p className="font-barlow font-black text-base sm:text-lg md:text-xl text-neutral-black leading-tight line-clamp-3 max-w-[24ch] mx-auto">
                          {row.especificacion}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto">
              <div>
                <ul className="divide-y divide-neutral-gray/40">
                  {specsLeft.map((row) => (
                    <li key={row.caracteristica} className="flex justify-between gap-4 py-4 text-sm md:text-base">
                      <span className="font-neue text-neutral-darkGreen shrink-0">{row.caracteristica}</span>
                      <span className="font-barlow font-bold text-right text-neutral-black">{row.especificacion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="divide-y divide-neutral-gray/40">
                  {specsRight.map((row) => (
                    <li key={row.caracteristica} className="flex justify-between gap-4 py-4 text-sm md:text-base">
                      <span className="font-neue text-neutral-darkGreen shrink-0">{row.caracteristica}</span>
                      <span className="font-barlow font-bold text-right text-neutral-black">{row.especificacion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {(product.links?.fichaTecnicaPdf || product.links?.catalogoPdf) && (
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                {product.links.fichaTecnicaPdf && (
                  <a
                    href={product.links.fichaTecnicaPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-primary-orange font-neue font-semibold hover:underline"
                  >
                    Descargar ficha técnica (PDF)
                  </a>
                )}
                {product.links.catalogoPdf && (
                  <a
                    href={product.links.catalogoPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-primary-orange font-neue font-semibold hover:underline"
                  >
                    Ver catálogo (PDF)
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Galería adicional (Woo images > 4) */}
      {!detailImageOverride && product.images && product.images.length > 4 && (
        <section className="bg-white py-12 md:py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {product.images.slice(4, 7).map((img, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-neutral-black/5">
                  <img
                    src={img.src || img}
                    alt={img.alt || `${displayName} ${idx + 5}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          CONFIANZA — Fondo negro
          ═══════════════════════════════════════════ */}
      {(trust.title || trust.envios || trust.garantia || trust.servicioTecnico || trust.items) && (
        <section className="bg-neutral-black text-white py-16 md:py-24">
          <div className="container-custom">
            {trust.title && (
              <h2 className="font-barlow font-black text-2xl md:text-3xl text-center mb-10 md:mb-14 !text-white">
                {trust.title}
              </h2>
            )}

            {(trust.envios || trust.garantia || trust.servicioTecnico) && (
              <div className="grid md:grid-cols-3 gap-6">
                {trust.envios && (
                  <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5">
                    <div className="flex items-center gap-2.5 mb-4">
                      <FiTruck className="w-6 h-6 text-primary-orange shrink-0" />
                      <h3 className="font-barlow font-bold text-lg !text-white">Envíos y Armado</h3>
                    </div>
                    <ul className="space-y-2 !text-white/75 font-neue text-sm">
                      {trust.envios.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {trust.garantia && (
                  <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5">
                    <div className="flex items-center gap-2.5 mb-4">
                      <FiShield className="w-6 h-6 text-primary-orange shrink-0" />
                      <h3 className="font-barlow font-bold text-lg !text-white">Garantía Oficial Roy Riff</h3>
                    </div>
                    <ul className="space-y-2 !text-white/75 font-neue text-sm">
                      {trust.garantia.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {trust.servicioTecnico && (
                  <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5">
                    <div className="flex items-center gap-2.5 mb-4">
                      <FiTool className="w-6 h-6 text-primary-orange shrink-0" />
                      <h3 className="font-barlow font-bold text-lg !text-white">Servicio Técnico</h3>
                    </div>
                    <ul className="space-y-2 !text-white/75 font-neue text-sm">
                      {trust.servicioTecnico.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {trust.items && trust.items.length > 0 && (
              <div className={`rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5 max-w-4xl mx-auto ${trust.envios || trust.garantia || trust.servicioTecnico ? 'mt-8' : ''}`}>
                <ul className="space-y-3 !text-white/75 font-neue">
                  {trust.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FiCheck className="w-4 h-4 mt-1 text-primary-orange shrink-0" />
                      <span className="text-sm md:text-base !text-white/85">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FAQ — Fondo blanco
          ═══════════════════════════════════════════ */}
      {faq.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <h2 className="font-barlow font-black text-2xl md:text-3xl text-center text-neutral-black mb-10">
              Preguntas Frecuentes {displayName}
            </h2>
            <div className="space-y-2 max-w-3xl mx-auto">
              {faq.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl shadow-sm overflow-hidden border border-neutral-gray/20"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full text-left font-barlow font-bold text-base md:text-lg p-5 flex items-center justify-between gap-4 hover:bg-primary-beige/60 transition-colors"
                  >
                    {item.pregunta}
                    {faqOpen === i ? (
                      <FiChevronUp className="w-5 h-5 shrink-0 text-primary-orange" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 shrink-0 text-primary-orange" />
                    )}
                  </button>
                  {faqOpen === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="font-neue text-neutral-darkGreen leading-relaxed">{item.respuesta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galería completa al final (solo sin override) */}
      {!detailImageOverride && product.images && product.images.length > 1 && (
        <section className="bg-primary-beige py-16 md:py-20 pb-28 md:pb-32">
          <div className="container-custom">
            <h2 className="font-barlow font-bold text-2xl mb-8 text-neutral-black">Galería</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img.src}
                  alt={img.alt || `${displayName} ${idx + 2}`}
                  className="w-full h-48 object-cover rounded-xl"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA inferior fijo */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-2 items-end" aria-label="Acciones rápidas">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="w-6 h-6" />
        </a>
        <button
          type="button"
          onClick={scrollToTop}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-black text-white shadow-lg hover:bg-neutral-darkGreen transition-colors"
          aria-label="Volver arriba"
        >
          <FiArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
