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
    fecha: '',
    modelo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nombre, telefono, email, fecha, modelo } = formData;
    if (!nombre || !telefono || !email || !modelo) {
      toast.error('Completá nombre, teléfono, email y modelo.');
      return;
    }

    const mensaje =
      `Hola! Quiero agendar un test ride.\n` +
      `Nombre: ${nombre}\n` +
      `Teléfono: ${telefono}\n` +
      `Email: ${email}\n` +
      (fecha ? `Fecha preferida: ${fecha}\n` : '') +
      `Modelo de interés: ${modelo.toUpperCase()}`;

    const url = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('Abriendo WhatsApp para confirmar tu turno…');
  };

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        <SectionTitle
          title="Test ride en Tucumán"
          subtitle="Probá tu Roy Riff antes de decidir. Con turno previo."
        />

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col">
            <h3 className="font-barlow font-bold text-2xl mb-4">Ubicación</h3>
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
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="font-barlow font-bold text-2xl mb-4">Agendar turno</h3>
            <p className="text-neutral-darkGreen mb-4 font-neue text-sm">
              Al enviar, se abre WhatsApp con los datos pre-cargados para coordinar día y horario con nuestro equipo.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                Solicitar test ride por WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRide;
