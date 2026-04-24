import { useState } from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import Button from '../../components/common/Button';
import { CONTACT_INFO } from '../../utils/constants';
import toast from 'react-hot-toast';

const TestRide = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    ubicacion: 'tucuman',
    fecha: '',
    modelo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nombre, telefono, email, ubicacion, fecha, modelo } = formData;
    if (!nombre || !telefono || !email || !modelo) {
      toast.error('Completá nombre, teléfono, email y modelo.');
      return;
    }

    const isBsAs = ubicacion === 'bsas';
    const intro = isBsAs
      ? 'Hola! Vivo en Buenos Aires y me gustaría coordinar una visita al depósito en Palermo.'
      : 'Hola! Quiero agendar un test ride en Yerba Buena, Tucumán.';

    const mensaje =
      `${intro}\n\n` +
      `Nombre: ${nombre}\n` +
      `Teléfono: ${telefono}\n` +
      `Email: ${email}\n` +
      (fecha ? `Fecha preferida: ${fecha}\n` : '') +
      `Modelo de interés: ${modelo.toUpperCase()}`;

    const url = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(isBsAs
      ? 'Abriendo WhatsApp para coordinar la visita al depósito…'
      : 'Abriendo WhatsApp para confirmar tu test ride…'
    );
  };

  const isBsAs = formData.ubicacion === 'bsas';

  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-5xl">
        <SectionTitle
          title="Probala antes de decidir"
          subtitle="Test ride oficial en Yerba Buena, Tucumán. En BsAs coordinamos visita al depósito en Palermo."
        />

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Ubicación + mapa */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md flex flex-col">
            <h3 className="font-barlow font-black text-xl text-neutral-black uppercase mb-4">
              {isBsAs ? 'Palermo, Buenos Aires' : 'Yerba Buena, Tucumán'}
            </h3>

            {isBsAs ? (
              <div className="flex flex-col gap-3 flex-grow">
                <p className="font-neue text-neutral-darkGreen text-sm leading-relaxed">
                  Tenemos un depósito operativo en Palermo. Si vivís en Buenos Aires, podés
                  coordinar una visita para ver las bicis, hacer consultas y llevarte la tuya el
                  mismo día.
                </p>
                <div className="bg-primary-beige rounded-lg p-4 text-sm text-neutral-darkGreen">
                  <p className="font-bold text-neutral-black mb-1">¿Cómo funciona?</p>
                  <ul className="space-y-1 list-disc pl-5">
                    <li>Completá el formulario al costado eligiendo "Buenos Aires".</li>
                    <li>Te respondemos por WhatsApp y coordinamos día y hora.</li>
                    <li>Te pasamos la dirección exacta al confirmar el turno.</li>
                  </ul>
                </div>
                <p className="font-neue text-xs text-neutral-gray mt-auto">
                  El test ride oficial (probar la bici en la calle con acompañamiento) está disponible
                  en Yerba Buena, Tucumán. En BsAs es visita al depósito con posibilidad de probar en
                  el lugar.
                </p>
              </div>
            ) : (
              <>
                <div className="relative mb-4 w-full overflow-hidden rounded-lg border border-neutral-gray/25 bg-neutral-black/5 aspect-[4/3] min-h-[200px]">
                  <iframe
                    title="Mapa — Roy Riff Test Ride Yerba Buena"
                    src={CONTACT_INFO.googleMapsEmbedSrc}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <p className="text-neutral-darkGreen mb-4 font-neue text-sm">{CONTACT_INFO.address}</p>
                <Button href={CONTACT_INFO.googleMapsLink} variant="secondary" className="w-full mt-auto">
                  Ver en Google Maps
                </Button>
              </>
            )}
          </div>

          {/* Formulario */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="font-barlow font-black text-xl text-neutral-black uppercase mb-4">
              Agendar turno
            </h3>
            <p className="font-neue text-neutral-darkGreen text-sm mb-5">
              Al enviar, se abre WhatsApp con los datos pre-cargados para coordinar día y horario con
              nuestro equipo.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector de ubicación */}
              <div>
                <label className="block font-neue text-xs font-bold text-neutral-darkGreen uppercase tracking-wide mb-2">
                  ¿Dónde querés coordinar?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, ubicacion: 'tucuman' }))}
                    className={`px-4 py-2.5 rounded-md border-2 font-bold text-sm transition-colors ${
                      formData.ubicacion === 'tucuman'
                        ? 'bg-primary-orange text-white border-primary-orange'
                        : 'bg-white text-neutral-black border-neutral-gray hover:border-primary-orange'
                    }`}
                  >
                    Tucumán
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, ubicacion: 'bsas' }))}
                    className={`px-4 py-2.5 rounded-md border-2 font-bold text-sm transition-colors ${
                      formData.ubicacion === 'bsas'
                        ? 'bg-primary-orange text-white border-primary-orange'
                        : 'bg-white text-neutral-black border-neutral-gray hover:border-primary-orange'
                    }`}
                  >
                    Buenos Aires
                  </button>
                </div>
              </div>

              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
                required
              />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
                required
              />
              <input
                type="text"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                placeholder="Fecha preferida (opcional)"
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
              />
              <select
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
                required
              >
                <option value="">Modelo de interés</option>
                <option value="lola">LOLA</option>
                <option value="xxxx">XXXX</option>
              </select>
              <Button type="submit" variant="primary" className="w-full">
                {isBsAs ? 'Coordinar visita por WhatsApp' : 'Solicitar test ride por WhatsApp'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRide;
