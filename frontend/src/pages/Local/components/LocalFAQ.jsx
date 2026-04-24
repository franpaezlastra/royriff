import { motion } from 'framer-motion';

const FAQ_ITEMS = [
  {
    q: '¿Necesito turno para visitar el local?',
    a: 'No. Podés pasar cuando quieras durante los horarios. Solo pedimos turno previo si querés hacer un test drive, para tener la bici lista y con batería full cuando llegues.',
  },
  {
    q: '¿Puedo hacer el test drive sin compromiso de compra?',
    a: 'Claro. El test drive existe justamente para que te saques todas las dudas antes de decidir. Coordinás por WhatsApp, venís y probás la bici en la calle con el equipo.',
  },
  {
    q: '¿Qué medios de pago aceptan en el local?',
    a: 'Efectivo y transferencia bancaria (con descuento sobre el precio financiado), y todas las tarjetas de crédito y débito vía Mercado Pago. Financiación en 3, 6, 9 o 12 cuotas fijas.',
  },
  {
    q: '¿Tienen servicio técnico en el mismo lugar?',
    a: 'Sí. Contamos con service eléctrico propio (motor, batería, controller, display) en el mismo local. Para mecánica básica derivamos a bicicleterías de confianza si hace falta.',
  },
];

const LocalFAQ = () => {
  return (
    <section
      aria-labelledby="local-faq-heading"
      className="bg-white py-16 md:py-24"
    >
      <div className="container-custom max-w-3xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-12 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-primary-orange" />
            <span className="font-barlow font-black text-xs text-primary-orange uppercase tracking-[0.35em]">
              Preguntas frecuentes
            </span>
            <span className="h-px w-10 bg-primary-orange" />
          </div>
          <h2
            id="local-faq-heading"
            className="font-barlow font-black text-neutral-black text-3xl sm:text-4xl md:text-5xl uppercase leading-tight tracking-tighter"
          >
            Lo que nos preguntan{' '}
            <span className="italic text-primary-orange">antes de venir.</span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <motion.details
              key={item.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group relative bg-primary-beige rounded-lg border border-neutral-gray/25 open:border-primary-orange/50 open:bg-white transition-colors overflow-hidden"
            >
              {/* Bar lateral naranja que aparece al abrir */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary-orange scale-y-0 group-open:scale-y-100 origin-top transition-transform duration-300"
              />
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 md:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange rounded-lg">
                <span className="font-barlow font-black text-neutral-black text-base md:text-lg uppercase tracking-tight pr-4">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 font-barlow font-black text-primary-orange text-2xl leading-none transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 md:px-6 md:pb-6 font-neue text-neutral-darkGreen text-sm md:text-base leading-relaxed">
                {item.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalFAQ;
