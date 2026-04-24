import { useState } from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: '¿Necesito registro o licencia?',
    answer: 'No. Las Roy Riff cumplen con el Decreto 196/2025 (500W limitado a 25 km/h), son EPAC legales. No requieren patente, seguro ni licencia.'
  },
  {
    question: '¿Cuál es la autonomía real?',
    answer: 'LOLA: 40-65 km. XXXX: 70-90 km. Depende de peso, terreno y nivel de asistencia.'
  },
  {
    question: '¿Puedo usar la bici si llueve?',
    answer: 'Sí, los componentes tienen protección IP65. No sumergir ni lavar con hidrolavadora.'
  },
  {
    question: '¿Cómo es el envío?',
    answer: 'Llega 85-90% armada con manual y herramientas. Recomendamos ajuste final por bicicletero.'
  }
];

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-neutral-gray/10 transition-smooth"
      >
        <span className="font-bold text-left">{faq.question}</span>
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-neutral-darkGreen">
          {faq.answer}
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        <SectionTitle
          title="Lo que preguntan. Sin rodeos."
          subtitle="Autonomía, garantía, envíos y mantenimiento — en criollo."
        />

        <div>
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} faq={faq} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
