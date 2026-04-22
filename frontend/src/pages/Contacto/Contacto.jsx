import SectionTitle from '../../components/common/SectionTitle';
import { CONTACT_INFO } from '../../utils/constants';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiMapPin } from 'react-icons/fi';

const Contacto = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        <SectionTitle
          title="Contacto"
          subtitle="Escribinos. Te respondemos con la posta."
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FaWhatsapp className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-barlow font-bold mb-2 text-neutral-black">WhatsApp</h3>
            <a href={CONTACT_INFO.whatsappLink} className="text-green-500 hover:text-green-400">
              {CONTACT_INFO.whatsapp}
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FiMail className="w-12 h-12 text-primary-orange mx-auto mb-4" />
            <h3 className="font-barlow font-bold mb-2 text-neutral-black">Email</h3>
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary-orange hover:underline break-all">
              {CONTACT_INFO.email}
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FiMapPin className="w-12 h-12 text-primary-orange mx-auto mb-4" />
            <h3 className="font-barlow font-bold mb-2 text-neutral-black">Showroom</h3>
            <a href={CONTACT_INFO.googleMapsLink} className="text-primary-orange hover:underline text-sm">
              {CONTACT_INFO.address}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
