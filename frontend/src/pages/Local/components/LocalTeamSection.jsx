import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';
import SectionTitle from '../../../components/common/SectionTitle';
import { TEAM_MANIFESTO } from '../../../utils/constants';
import { getTeamGroupPhoto } from '../localData';

const LocalTeamSection = () => {
  const groupPhoto = getTeamGroupPhoto();

  return (
    <section
      aria-labelledby="local-team-heading"
      className="bg-white py-16 md:py-24"
    >
      <div className="container-custom">
        <SectionTitle
          title="El equipo"
          subtitle="Las personas detrás de Roy Riff."
        />

        {/* Asymmetric 58/42 layout */}
        <div className="grid grid-cols-1 md:grid-cols-[58fr_42fr] gap-8 md:gap-12 items-stretch">
          {/* Foto grupal — 58% desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/3] md:aspect-[5/4] overflow-hidden rounded-md bg-neutral-black/5 order-2 md:order-1"
          >
            {groupPhoto ? (
              <img
                src={groupPhoto.src}
                alt="Equipo Roy Riff en el local de Yerba Buena"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              // Placeholder elegante — gradient earth-tone con ícono central
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-5"
                style={{
                  background:
                    'linear-gradient(135deg, #C9B896 0%, #8a7a60 60%, #5a4a33 100%)',
                }}
              >
                <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                  <FiUsers className="w-9 h-9 text-white/80" />
                </div>
                <div className="text-center px-6">
                  <p className="font-barlow font-black text-white/95 text-xl md:text-2xl uppercase tracking-tight leading-tight">
                    Pronto conocelos
                    <br />
                    en persona.
                  </p>
                  <p className="font-neue text-white/70 text-xs md:text-sm mt-2">
                    Foto del equipo próximamente.
                  </p>
                </div>
              </div>
            )}

            {/* Caption bottom-left tipo film */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-neutral-black/70 backdrop-blur px-3 py-1.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-orange animate-pulse" />
              <span className="font-barlow font-black text-[10px] text-white uppercase tracking-[0.2em]">
                {TEAM_MANIFESTO.photoCaption}
              </span>
            </div>
          </motion.div>

          {/* Manifiesto + atribución — 42% desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex flex-col justify-center order-1 md:order-2"
          >
            <blockquote className="relative">
              <div className="space-y-5 font-neue text-neutral-darkGreen text-base md:text-lg leading-relaxed">
                {TEAM_MANIFESTO.paragraphs.map((p, idx) => {
                  const isLast = idx === TEAM_MANIFESTO.paragraphs.length - 1;
                  return (
                    <p
                      key={idx}
                      className={
                        isLast
                          ? 'font-barlow font-black italic text-primary-orange text-xl md:text-2xl leading-snug pt-2'
                          : ''
                      }
                    >
                      {p}
                    </p>
                  );
                })}
              </div>
              <footer className="mt-8 flex items-center gap-3">
                <span className="h-px w-8 bg-primary-orange" />
                <div className="font-barlow font-black text-sm uppercase tracking-[0.25em]">
                  <span className="text-neutral-black">
                    {TEAM_MANIFESTO.author}
                  </span>
                  <span className="text-neutral-gray mx-2">·</span>
                  <span className="text-primary-orange">
                    {TEAM_MANIFESTO.role}
                  </span>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocalTeamSection;
