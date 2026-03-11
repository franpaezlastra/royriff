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
    modelo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrar con backend
    toast.success('Solicitud enviada. Te contactaremos pronto!');
  };

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        <SectionTitle
          title="Test ride en Tucumán"
          subtitle="Probá tu Roy Riff antes de decidir. Con turno previo."
        />

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="font-barlow font-bold text-2xl mb-4">Ubicación</h3>
            <p className="text-neutral-darkGreen mb-4">{CONTACT_INFO.address}</p>
            <Button href={CONTACT_INFO.googleMapsLink} variant="secondary" className="w-full">
              Ver en Google Maps
            </Button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="font-barlow font-bold text-2xl mb-4">Agendar turno</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
                required
              />
              <select className="w-full px-4 py-2 border-2 border-neutral-gray rounded" required>
                <option value="">Modelo de interés</option>
                <option value="lola">LOLA</option>
                <option value="xxxx">XXXX</option>
              </select>
              <Button type="submit" variant="primary" className="w-full">
                Solicitar test ride
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRide;
