import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiMapPin } from 'react-icons/fi';
import Button from '../../../components/common/Button';
import { CONTACT_INFO } from '../../../utils/constants';

const ContactSection = () => {
  return (
    <section className="py-16 md:py-24 bg-neutral-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-barlow font-black text-4xl md:text-5xl mb-6">
              ¿Tenés dudas? Hablemos.
            </h2>
            <p className="text-xl text-neutral-gray mb-12">
              Estamos para ayudarte a elegir tu Roy Riff ideal. Sin vueltas, con la posta.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* WhatsApp */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-all"
              >
                <FaWhatsapp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2">WhatsApp</h3>
                <a 
                  href={CONTACT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-400 transition-smooth"
                >
                  {CONTACT_INFO.whatsapp}
                </a>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-all"
              >
                <FiMail className="w-12 h-12 text-primary-orange mx-auto mb-4" />
                <h3 className="font-bold mb-2">Email</h3>
                <a 
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-primary-orange hover:text-primary-yellow transition-smooth break-all"
                >
                  {CONTACT_INFO.email}
                </a>
              </motion.div>

              {/* Ubicación */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-all"
              >
                <FiMapPin className="w-12 h-12 text-primary-orange mx-auto mb-4" />
                <h3 className="font-bold mb-2">Showroom</h3>
                <a 
                  href={CONTACT_INFO.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-orange hover:text-primary-yellow transition-smooth text-sm"
                >
                  {CONTACT_INFO.address}
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                to="/contacto"
                variant="primary"
              >
                Formulario de contacto
              </Button>
              <Button 
                to="/test-ride-tucuman"
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-neutral-black"
              >
                Agendar test ride
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
