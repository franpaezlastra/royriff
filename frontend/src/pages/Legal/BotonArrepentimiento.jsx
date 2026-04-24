import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import SectionTitle from '../../components/common/SectionTitle';
import { CONTACT_INFO, COMPANY_INFO } from '../../utils/constants';
import toast from 'react-hot-toast';

const BotonArrepentimiento = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    dni: '',
    numeroOrden: '',
    fechaEntrega: '',
    motivo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, email, dni, numeroOrden, fechaEntrega, motivo } = formData;

    if (!nombre || !email || !dni || !numeroOrden) {
      toast.error('Completá nombre, email, DNI y número de orden.');
      return;
    }

    const mensaje =
      `Hola! Quiero ejercer mi botón de arrepentimiento.\n\n` +
      `Nombre: ${nombre}\n` +
      `Email de la compra: ${email}\n` +
      `DNI: ${dni}\n` +
      `Número de orden: ${numeroOrden}\n` +
      (fechaEntrega ? `Fecha de entrega: ${fechaEntrega}\n` : '') +
      (motivo ? `\nMotivo (opcional): ${motivo}\n` : '') +
      `\nQuedo a la espera de sus instrucciones para la devolución.`;

    const url = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('Abriendo WhatsApp para confirmar tu solicitud…');
  };

  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-3xl">
        <SectionTitle title="Botón de arrepentimiento" />

        {/* Bloque legal */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8 space-y-4">
          <p className="font-neue text-neutral-black leading-relaxed">
            Si sos consumidor final y compraste tu Roy Riff a distancia (por la web, por teléfono
            o por WhatsApp), tenés derecho a arrepentirte de la compra dentro de los{' '}
            <strong>10 días corridos desde la recepción del producto</strong>, sin necesidad de
            expresar motivo y sin costo adicional para vos, según el{' '}
            <strong>Art. 34 de la Ley 24.240 de Defensa del Consumidor</strong> y la{' '}
            <strong>Resolución 424/2020</strong> de la Secretaría de Comercio Interior.
          </p>

          <div>
            <h3 className="font-barlow font-black text-lg text-neutral-black mb-2 uppercase">
              ¿Qué podés hacer con este botón?
            </h3>
            <ul className="space-y-1 font-neue text-neutral-darkGreen pl-5 list-disc">
              <li>Iniciar la devolución de tu bicicleta Roy Riff.</li>
              <li>Solicitar el reintegro del importe abonado.</li>
              <li>Recibir instrucciones para el retiro/envío del producto.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-barlow font-black text-lg text-neutral-black mb-2 uppercase">
              Condiciones
            </h3>
            <ul className="space-y-1 font-neue text-neutral-darkGreen pl-5 list-disc">
              <li>El producto debe estar en las mismas condiciones en que lo recibiste, sin
                uso significativo y con todos sus accesorios y embalaje original.</li>
              <li>El reintegro se realizará por el mismo medio de pago utilizado, dentro de
                los plazos que establece la normativa vigente.</li>
              <li>El costo del envío de devolución se coordina con nuestro equipo sin costo
                para el consumidor, conforme a la Ley 24.240.</li>
            </ul>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8">
          <h3 className="font-barlow font-black text-xl text-neutral-black mb-4 uppercase">
            Ejercer mi derecho de arrepentimiento
          </h3>
          <p className="font-neue text-sm text-neutral-darkGreen mb-6">
            Al enviar, se abre WhatsApp con los datos pre-cargados para que nuestro equipo
            gestione la devolución y coordine el retiro.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre y apellido completos"
              className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email con el que compraste"
              className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
              required
            />
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="DNI"
              className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
              required
            />
            <input
              type="text"
              name="numeroOrden"
              value={formData.numeroOrden}
              onChange={handleChange}
              placeholder="Número de orden (ej: #1234)"
              className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
              required
            />
            <input
              type="text"
              name="fechaEntrega"
              value={formData.fechaEntrega}
              onChange={handleChange}
              placeholder="Fecha de entrega (opcional)"
              className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
            />
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Motivo (opcional — no es obligatorio por ley)"
              rows={3}
              className="w-full px-4 py-2 border-2 border-neutral-gray rounded"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 w-full bg-primary-orange text-white font-bold py-3 px-6 rounded-full hover:bg-[#E03D0B] transition-smooth"
            >
              <FaWhatsapp className="w-5 h-5" />
              Enviar solicitud por WhatsApp
            </button>
          </form>
        </div>

        {/* Datos de la empresa (exigido por Resolución 424/2020) */}
        <div className="bg-white/70 p-6 rounded-lg border border-neutral-gray/30">
          <h3 className="font-barlow font-bold text-base text-neutral-black mb-3 uppercase">
            Datos de la empresa
          </h3>
          <ul className="font-neue text-sm text-neutral-darkGreen space-y-1">
            <li><strong>Razón social:</strong> {COMPANY_INFO.razonSocial}</li>
            <li><strong>CUIT:</strong> {COMPANY_INFO.cuit}</li>
            <li><strong>Domicilio legal:</strong> {COMPANY_INFO.domicilioLegal}</li>
            <li><strong>Marca comercial:</strong> {COMPANY_INFO.brandName}</li>
            <li><strong>Email de contacto:</strong> {CONTACT_INFO.email}</li>
            <li><strong>WhatsApp:</strong> {CONTACT_INFO.whatsapp}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BotonArrepentimiento;
