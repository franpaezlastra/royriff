import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaSpotify } from 'react-icons/fa';
import { CONTACT_INFO } from '../../utils/constants';

const IMAGOTIPO_URL = 'https://api.royriff.com.ar/wp-content/uploads/2026/02/IMG_8249-removebg-preview-e1772112881155.png';
const INSTAGRAM_URL = 'https://www.instagram.com/royriff.arg/';
const SPOTIFY_PLAYLIST_URL =
  'https://open.spotify.com/playlist/0AKlsyoyQtdk2X6FSARVb0?si=QRmGgdetSTGFAh_flsd3yA&pi=10F8RErnSRCD0';

const Footer = () => {
  return (
    <footer className="bg-neutral-black text-white">
      <div className="container-custom py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Columna 1: Logo y Redes */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col">
            <div className="mb-5 flex items-start">
              <img
                src={IMAGOTIPO_URL}
                alt="Roy Riff"
                className="h-15 w-auto max-w-[140px] object-contain object-left block bg-white"
              />
            </div>
            <p className="text-neutral-gray text-sm leading-relaxed mb-6 max-w-xs">
              Bicicletas eléctricas premium. Libertad, autonomía y diseño para recorrer Argentina.
            </p>
            <div className="flex gap-5">
              <a
                href={CONTACT_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-primary-orange transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-primary-orange transition-colors"
                aria-label="Instagram Roy Riff"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href={SPOTIFY_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-primary-orange transition-colors"
                aria-label="Roy Riff Playlist en Spotify"
              >
                <FaSpotify className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Compra */}
          <div className="mt-8 md:mt-0">
            <h3 className="font-barlow font-bold text-white text-sm uppercase tracking-wide mb-4">
              Compra
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/envios" className="text-neutral-gray hover:text-white transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link to="/financiacion" className="text-neutral-gray hover:text-white transition-colors">
                  Financiación
                </Link>
              </li>
              <li>
                <Link to="/cambios-y-devoluciones" className="text-neutral-gray hover:text-white transition-colors">
                  Cambios y devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Postventa */}
          <div className="mt-8 md:mt-0">
            <h3 className="font-barlow font-bold text-white text-sm uppercase tracking-wide mb-4">
              Postventa
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/servicio-tecnico-y-garantia" className="text-neutral-gray hover:text-white transition-colors">
                  Servicio y garantía
                </Link>
              </li>
              <li>
                <Link to="/tutoriales" className="text-neutral-gray hover:text-white transition-colors">
                  Tutoriales
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-neutral-gray hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Empresa */}
          <div className="mt-8 md:mt-0">
            <h3 className="font-barlow font-bold text-white text-sm uppercase tracking-wide mb-4">
              Empresa
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contacto" className="text-neutral-gray hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/test-ride-tucuman" className="text-neutral-gray hover:text-white transition-colors">
                  Test ride (Tucumán)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-neutral-gray">
            <nav className="flex flex-wrap gap-x-6 gap-y-1">
              <Link to="/boton-de-arrepentimiento" className="hover:text-white transition-colors">
                Botón de arrepentimiento
              </Link>
              <Link to="/politica-de-privacidad" className="hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link to="/terminos-y-condiciones" className="hover:text-white transition-colors">
                Términos y condiciones
              </Link>
            </nav>
            <p className="md:text-right shrink-0">
              &copy; {new Date().getFullYear()} Roy Riff. Todos los derechos reservados.
              {' '}Desarrollado por{' '}
              <a
                href="https://portfolio.franpl.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary-orange transition-colors"
              >
                Francisco Páez Lastra
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
