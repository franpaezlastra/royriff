import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductMainImage, getProductMainImagePreferring } from '../../utils/constants';
import { getDisplayName } from '../../utils/productData';
import { fetchProductBySlug } from '../../store/slices/productsSlice';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiChevronDown, FiChevronUp, FiTruck, FiShield, FiTool } from 'react-icons/fi';

const ProductDetail = () => {
  const { product: productSlug } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const [faqOpen, setFaqOpen] = useState(null);

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

  const whatsappMessage = selectedProduct
    ? `Hola, quiero consultar sobre la bici ${getDisplayName(selectedProduct)}`
    : 'Hola, quiero consultar sobre sus bicicletas eléctricas';
  const whatsappUrl = `https://wa.me/5493812006514?text=${encodeURIComponent(whatsappMessage)}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
  const mainImage = isLola
    ? getProductMainImagePreferring(product, 'izquierda-frente-negra')
    : getProductMainImage(product);
  const hero = product.hero || {};
  const desc = product.description || {};
  const trust = product.trustBlock || {};
  const faq = product.faq || [];
  const specsTable = product.specsTable || [];

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="container-custom py-8 md:py-16">
        {/* Hero */}
        <section className="grid md:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 mb-20 items-center">
          <div className="w-full min-w-0 aspect-[4/3] flex items-center justify-center min-h-[260px]">
            {mainImage ? (
              <img
                src={mainImage}
                alt={displayName}
                className="w-full h-full object-contain object-[center_65%]"
                style={{ objectPosition: 'center 65%' }}
              />
            ) : (
              <span className="font-barlow font-black text-4xl text-neutral-black/10">{displayName}</span>
            )}
          </div>

          <div>
            <h1 className="font-barlow font-black text-2xl md:text-3xl lg:text-4xl text-neutral-black tracking-tight leading-tight mb-3">
              {hero.h1 || product.seoName || product.name}
            </h1>
            {hero.h2 && (
              <p className="text-neutral-darkGreen font-neue text-base md:text-lg mb-6 leading-relaxed">
                {hero.h2}
              </p>
            )}

            {hero.highlights && hero.highlights.length > 0 && (
              <ul className="space-y-2 mb-6 pl-4 border-l-2 border-primary-orange/60">
                {hero.highlights.map((item, i) => (
                  <li key={i} className="text-neutral-darkGreen font-neue text-sm md:text-base">
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <p className="font-barlow font-semibold text-lg text-neutral-black mb-4">
              {hero.productTitle || displayName}
            </p>

            <p className="text-neutral-darkGreen font-neue text-sm mb-8 max-w-lg">
              Conocé las especificaciones y la galería. Cuando estés listo, elegí color y cantidad para agregar al carrito.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                to={`/bicicletas-electricas/${product.slug || productSlug}/elegir`}
                variant="primary"
                className="rounded-xl py-3.5 px-6"
              >
                Elegir {displayName}
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center font-neue text-sm text-neutral-darkGreen hover:text-primary-orange transition-colors py-3"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Descripción emocional */}
        {desc.sectionTitle && (
          <section className="mb-20">
            <h2 className="font-barlow font-black text-3xl md:text-4xl mb-8 text-neutral-black">
              {desc.sectionTitle}
            </h2>
            {desc.paragraphs?.map((p, i) => (
              <p key={i} className="text-neutral-darkGreen font-neue text-lg mb-4 max-w-3xl">
                {p}
              </p>
            ))}
            {desc.beneficiosTitle && desc.beneficios?.length > 0 && (
              <>
                <h3 className="font-barlow font-bold text-2xl mt-10 mb-4 text-neutral-black">
                  {desc.beneficiosTitle}
                </h3>
                <ul className="space-y-6">
                  {desc.beneficios.map((b, i) => (
                    <li key={i}>
                      <h4 className="font-barlow font-bold text-lg text-primary-orange mb-2">
                        {b.titulo}
                      </h4>
                      <p className="text-neutral-darkGreen font-neue">{b.texto}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}

        {/* Galería intermedia 1 — después de descripción */}
        {product.images && product.images.length > 1 && (
          <section className="mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {product.images.slice(1, 4).map((img, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-white">
                  <img
                    src={img.src || img}
                    alt={img.alt || `${displayName} ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ficha técnica (tabla) */}
        {specsTable.length > 0 && (
          <section className="mb-20">
            <h2 className="font-barlow font-black text-3xl mb-6">Ficha Técnica Detallada</h2>
            <p className="text-neutral-darkGreen font-neue mb-4">
              Es fundamental para reducir consultas. En el futuro aquí podrás descargar el PDF de la ficha técnica y el catálogo.
            </p>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-gray/20">
                    <th className="text-left font-barlow font-bold p-4">Característica</th>
                    <th className="text-left font-barlow font-bold p-4">Especificación Técnica</th>
                  </tr>
                </thead>
                <tbody>
                  {specsTable.map((row, i) => (
                    <tr key={i} className="border-t border-neutral-gray/20">
                      <td className="p-4 font-barlow font-semibold text-neutral-black">{row.caracteristica}</td>
                      <td className="p-4 font-neue text-neutral-darkGreen">{row.especificacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {product.links?.fichaTecnicaPdf && (
              <a
                href={product.links.fichaTecnicaPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-primary-orange font-neue font-semibold hover:underline"
              >
                Descargar ficha técnica (PDF)
              </a>
            )}
            {product.links?.catalogoPdf && (
              <a
                href={product.links.catalogoPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 ml-4 text-primary-orange font-neue font-semibold hover:underline"
              >
                Ver catálogo (PDF)
              </a>
            )}
          </section>
        )}

        {/* Galería intermedia 2 — después de ficha técnica */}
        {product.images && product.images.length > 4 && (
          <section className="mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {product.images.slice(4, 7).map((img, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-white">
                  <img
                    src={img.src || img}
                    alt={img.alt || `${displayName} ${idx + 5}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bloque de confianza */}
        {(trust.title || trust.envios || trust.garantia || trust.servicioTecnico || trust.items) && (
          <section className="mb-20">
            <h2 className="font-barlow font-black text-3xl mb-8 text-neutral-black">
              {trust.title || 'TE ACOMPAÑAMOS EN TODO EL PROCESO'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {trust.envios && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <FiTruck className="w-6 h-6 text-primary-orange" />
                    <h3 className="font-barlow font-bold text-xl">Envíos y Armado</h3>
                  </div>
                  <ul className="space-y-2 text-neutral-darkGreen font-neue text-sm">
                    {trust.envios.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {trust.garantia && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <FiShield className="w-6 h-6 text-primary-orange" />
                    <h3 className="font-barlow font-bold text-xl">Garantía Oficial Roy Riff</h3>
                  </div>
                  <ul className="space-y-2 text-neutral-darkGreen font-neue text-sm">
                    {trust.garantia.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {trust.servicioTecnico && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <FiTool className="w-6 h-6 text-primary-orange" />
                    <h3 className="font-barlow font-bold text-xl">Servicio Técnico</h3>
                  </div>
                  <ul className="space-y-2 text-neutral-darkGreen font-neue text-sm">
                    {trust.servicioTecnico.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {trust.items && trust.items.length > 0 && (
              <div className="mt-6 bg-white rounded-xl p-6 shadow-md">
                <ul className="space-y-2 text-neutral-darkGreen font-neue">
                  {trust.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary-orange">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="mb-20">
            <h2 className="font-barlow font-black text-3xl mb-8 text-neutral-black">
              Preguntas Frecuentes {displayName}
            </h2>
            <div className="space-y-2">
              {faq.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-gray/20"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full text-left font-barlow font-bold text-lg p-5 flex items-center justify-between gap-4 hover:bg-neutral-gray/5 transition-colors"
                  >
                    {item.pregunta}
                    {faqOpen === i ? (
                      <FiChevronUp className="w-5 h-5 flex-shrink-0 text-primary-orange" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 flex-shrink-0 text-primary-orange" />
                    )}
                  </button>
                  {faqOpen === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="font-neue text-neutral-darkGreen">{item.respuesta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Galería si hay más imágenes */}
        {product.images && product.images.length > 1 && (
          <section className="mb-16">
            <h2 className="font-barlow font-bold text-2xl mb-6">Galería</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img.src}
                  alt={img.alt || `${displayName} ${idx + 2}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
