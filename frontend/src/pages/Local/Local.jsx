import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FiMapPin,
  FiClock,
  FiTruck,
  FiUsers,
  FiTool,
  FiTag,
  FiImage,
  FiVideo,
  FiExternalLink,
} from 'react-icons/fi';
import SectionTitle from '../../components/common/SectionTitle';
import Button from '../../components/common/Button';
import { CONTACT_INFO } from '../../utils/constants';

const GALLERY_CATEGORIES = [
  {
    key: 'exterior',
    icon: FiMapPin,
    title: 'Exterior',
    subtitle: 'La llegada al local, la fachada, el cartel.',
  },
  {
    key: 'showroom',
    icon: FiTag,
    title: 'Showroom',
    subtitle: 'Todas las LOLA y XXXX expuestas, listas para probar.',
  },
  {
    key: 'equipo',
    icon: FiUsers,
    title: 'El equipo',
    subtitle: 'Las personas detrás de cada Roy Riff.',
  },
  {
    key: 'merch',
    icon: FiTag,
    title: 'Merchandising y vida Roy Riff',
    subtitle: 'Remeras, eventos y la comunidad creciendo.',
  },
];

const FEATURES = [
  {
    icon: FiTag,
    title: 'Todos los modelos expuestos',
    text: 'LOLA y XXXX listas para que las veas, toques y probés antes de decidir.',
  },
  {
    icon: FiUsers,
    title: 'Asesoramiento sin presión',
    text: 'Nuestro equipo te explica todo y te ayuda a elegir el modelo que más te conviene.',
  },
  {
    icon: FiTool,
    title: 'Service y garantía in-house',
    text: 'Tenemos servicio técnico propio: tu bici la atendemos nosotros.',
  },
  {
    icon: FiTruck,
    title: 'Test ride coordinado',
    text: 'Agendá un turno y salimos a andar para que sientas cómo anda tu futura Roy Riff.',
  },
];

const FAQ = [
  {
    q: '¿Necesito turno para visitar el local?',
    a: 'No. Podés venir cuando quieras durante nuestros horarios. Solo pedimos turno previo si querés coordinar un test ride, así tenemos la bici lista para vos.',
  },
  {
    q: '¿Puedo hacer el test ride sin compromiso de compra?',
    a: 'Claro. El test ride es justamente para que te saques todas las dudas antes de decidir. Coordinás conmigo por WhatsApp, venís y probás.',
  },
  {
    q: '¿Qué medios de pago aceptan en el local?',
    a: 'Efectivo, transferencia bancaria (con descuento sobre el precio financiado) y todas las tarjetas de crédito/débito vía Mercado Pago, con financiación en 3, 6, 9 o 12 cuotas fijas.',
  },
  {
    q: '¿Tienen servicio técnico en el mismo lugar?',
    a: 'Sí. Contamos con service eléctrico propio (motor, batería, controller, display) en el mismo local y derivamos la mecánica básica si hace falta.',
  },
];

const GalleryPlaceholder = ({ icon: Icon, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-lg shadow-md p-6 md:p-8 border-2 border-neutral-gray/20"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-primary-orange/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-orange" />
      </div>
      <h3 className="font-barlow font-black text-lg text-neutral-black uppercase">
        {title}
      </h3>
    </div>
    <p className="font-neue text-neutral-darkGreen text-sm mb-4">{subtitle}</p>

    {/* Placeholder tipo lámina mate */}
    <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-gradient-to-br from-primary-beige via-white to-primary-beige border border-neutral-gray/30">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <FiImage className="w-8 h-8 text-neutral-gray" />
        <p className="font-neue text-xs text-neutral-gray">
          Próximamente
        </p>
      </div>
    </div>
  </motion.div>
);

const Local = () => {
  useEffect(() => {
    document.title = 'Showroom Roy Riff en Tucumán · Test ride en Yerba Buena';
    const description =
      'Visitá el showroom Roy Riff en Yerba Buena, Tucumán. Probá la LOLA y la XXXX, conocé al equipo y coordiná tu test ride.';
    let meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }, []);

  const whatsappVisitaUrl = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(
    'Hola! Me gustaría visitar el showroom de Roy Riff. ¿Puedo coordinar un test ride?'
  )}`;

  return (
    <div className="bg-primary-beige">
      {/* HERO */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-primary-beige">
        <div className="container-custom max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-barlow font-bold text-primary-orange text-sm uppercase tracking-wider mb-3"
          >
            Yerba Buena · Tucumán
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-barlow font-black text-3xl md:text-5xl lg:text-6xl text-neutral-black leading-[1.05] tracking-tight uppercase mb-4"
          >
            Showroom Roy Riff en Tucumán
            <br />
            <span className="text-primary-orange">Coordiná tu test ride</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-neue text-neutral-darkGreen text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            Visitanos en Yerba Buena, probá la LOLA y la XXXX, y llevate la tuya.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Button to="/test-ride-tucuman" variant="primary" className="rounded-full px-8 py-3.5">
              Agendar test ride
            </Button>
            <a
              href="#info-practica"
              className="inline-block text-center font-bold py-3.5 px-8 rounded-full bg-transparent text-primary-orange border-2 border-primary-orange hover:bg-primary-orange hover:text-white transition-smooth"
            >
              Cómo llegar
            </a>
          </motion.div>
        </div>
      </section>

      {/* QUÉ TE VAS A ENCONTRAR */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom max-w-6xl">
          <SectionTitle
            title="Qué te vas a encontrar"
            subtitle="Más que una tienda: un lugar para probar, preguntar y sentirte cómodo."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-primary-beige rounded-lg p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-orange flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-barlow font-black text-lg text-neutral-black uppercase mb-2">
                    {f.title}
                  </h3>
                  <p className="font-neue text-sm text-neutral-darkGreen leading-relaxed">
                    {f.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="py-12 md:py-16">
        <div className="container-custom max-w-6xl">
          <SectionTitle
            title="Conocé cada rincón del local"
            subtitle="Estamos preparando la galería completa con fotos reales del showroom."
          />
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {GALLERY_CATEGORIES.map((cat) => (
              <GalleryPlaceholder
                key={cat.key}
                icon={cat.icon}
                title={cat.title}
                subtitle={cat.subtitle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* VIDEOS VERTICALES */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom max-w-5xl">
          <SectionTitle
            title="Viví el showroom en movimiento"
            subtitle="Pronto vas a poder ver clips cortos del local, del equipo y de las bicis en acción."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gradient-to-br from-neutral-black/10 via-primary-beige to-neutral-black/10 border border-neutral-gray/30"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <FiVideo className="w-10 h-10 text-neutral-gray" />
                  <p className="font-neue text-xs text-neutral-gray">
                    Video próximamente
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO PRÁCTICA */}
      <section id="info-practica" className="py-12 md:py-16">
        <div className="container-custom max-w-5xl">
          <SectionTitle
            title="Cómo llegar y cuándo visitarnos"
            subtitle="Te esperamos en Yerba Buena. Entrada libre durante horarios, turno previo para test ride."
          />

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Card info */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-5">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-6 h-6 text-primary-orange shrink-0 mt-1" />
                <div>
                  <h3 className="font-barlow font-black text-base text-neutral-black uppercase mb-1">
                    Dirección
                  </h3>
                  <p className="font-neue text-neutral-darkGreen">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiClock className="w-6 h-6 text-primary-orange shrink-0 mt-1" />
                <div>
                  <h3 className="font-barlow font-black text-base text-neutral-black uppercase mb-1">
                    Horarios
                  </h3>
                  <ul className="font-neue text-neutral-darkGreen space-y-0.5">
                    <li>Lunes a Viernes · 9:00–13:00 y 17:00–21:00</li>
                    <li>Sábados · 9:00–13:00</li>
                    <li>Domingos · cerrado</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiTruck className="w-6 h-6 text-primary-orange shrink-0 mt-1" />
                <div>
                  <h3 className="font-barlow font-black text-base text-neutral-black uppercase mb-1">
                    Parking
                  </h3>
                  <p className="font-neue text-neutral-darkGreen">
                    Tenemos parking propio. Podés venir tranquilo en auto.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={CONTACT_INFO.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-neutral-black text-white font-bold py-3 px-5 rounded-full hover:bg-neutral-darkGreen transition-smooth text-sm"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Ver en Google Maps
                </a>
                <a
                  href={whatsappVisitaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary-orange text-white font-bold py-3 px-5 rounded-full hover:bg-[#E03D0B] transition-smooth text-sm"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Coordinar visita
                </a>
              </div>
            </div>

            {/* Mapa */}
            <div className="relative rounded-lg overflow-hidden shadow-md min-h-[320px] bg-neutral-black/5 border border-neutral-gray/25">
              <iframe
                title="Mapa — Roy Riff Showroom Tucumán"
                src={CONTACT_INFO.googleMapsEmbedSrc}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <SectionTitle
            title="Preguntas frecuentes"
            subtitle="Lo que nos preguntan antes de venir. Si te queda otra, escribinos por WhatsApp."
          />
          <div className="space-y-3 mt-8">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="group bg-primary-beige rounded-lg border border-neutral-gray/25 open:border-primary-orange/60 transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 font-barlow font-bold text-neutral-black">
                  <span>{item.q}</span>
                  <span className="text-primary-orange transition-transform group-open:rotate-45 text-xl leading-none">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 font-neue text-neutral-darkGreen text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-20 bg-neutral-black text-white">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="font-barlow font-black text-3xl md:text-5xl uppercase leading-tight tracking-tight mb-4">
            Te esperamos en Yerba Buena
          </h2>
          <p className="font-neue text-neutral-gray text-lg mb-8 max-w-xl mx-auto">
            Pasá, probalas, conocenos. Sin vueltas, sin presión y con toda la información que
            necesitás para decidir tranquilo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/test-ride-tucuman"
              className="inline-block text-center font-bold py-3.5 px-8 rounded-full bg-primary-orange text-white hover:bg-[#E03D0B] transition-smooth"
            >
              Agendar test ride
            </Link>
            <a
              href={whatsappVisitaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-8 rounded-full border-2 border-white text-white hover:bg-white hover:text-neutral-black transition-smooth"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp
            </a>
            <a
              href={CONTACT_INFO.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-8 rounded-full border-2 border-white text-white hover:bg-white hover:text-neutral-black transition-smooth"
            >
              <FiExternalLink className="w-5 h-5" />
              Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Local;
