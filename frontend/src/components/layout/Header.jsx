import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { selectCartItemsCount } from '../../store/slices/cartSlice';
import CartDrawer from '../cart/CartDrawer';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemsCount = useSelector(selectCartItemsCount);
  // Obtener productos del estado global para usar sus slugs reales
  const { items: products } = useSelector((state) => state.products);
  
  // Buscar el slug real de LOLA desde los productos cargados
  const lolaProduct = products.find(p => 
    p.name?.toUpperCase().includes('LOLA') || 
    p.displayName?.toUpperCase().includes('LOLA') ||
    p.slug?.toLowerCase().includes('lola')
  );
  const lolaSlug = lolaProduct?.slug || 'lola-cruiser'; // Fallback si no está cargado aún
  
  // Buscar el slug real de XXXX desde los productos cargados
  const xxxxProduct = products.find(p => 
    p.name?.toUpperCase().includes('XXXX') || 
    p.displayName?.toUpperCase().includes('XXXX') ||
    p.slug?.toLowerCase().includes('xxxx')
  );
  const xxxxSlug = xxxxProduct?.slug || 'xxxx-expedition'; // Fallback

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img
              src="https://api.royriff.com.ar/wp-content/uploads/2026/02/logoNegro.webp"
              alt="Roy Riff"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to={`/bicicletas-electricas/${lolaSlug}`}
              className="text-neutral-black hover:text-primary-orange transition-smooth text-sm font-barlow font-bold"
            >
              Lola Cruiser Urbana
            </Link>
            <Link 
              to={`/bicicletas-electricas/${xxxxSlug}`}
              className="text-neutral-black hover:text-primary-orange transition-smooth text-sm font-barlow font-bold"
            >
              XXXX Todo terreno
            </Link>
            <Link 
              to="/test-ride-tucuman" 
              className="text-neutral-black hover:text-primary-orange transition-smooth text-sm font-barlow font-bold"
            >
              Test drive
            </Link>
          </nav>

          {/* Right Section: Cart + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <button
              type="button"
              className="relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrito"
            >
              <FiShoppingCart className="w-5 h-5 text-neutral-black hover:text-primary-orange transition-smooth" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary-orange text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-neutral-black hover:text-primary-orange transition-smooth"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-gray/20">
          <nav className="container-custom py-4 flex flex-col gap-4">
            <Link 
              to={`/bicicletas-electricas/${lolaSlug}`}
              className="text-neutral-black hover:text-primary-orange transition-smooth font-barlow font-bold py-2"
              onClick={closeMenu}
            >
              Lola Cruiser Urbana
            </Link>
            <Link 
              to={`/bicicletas-electricas/${xxxxSlug}`}
              className="text-neutral-black hover:text-primary-orange transition-smooth font-barlow font-bold py-2"
              onClick={closeMenu}
            >
              XXXX Todo terreno
            </Link>
            <Link 
              to="/test-ride-tucuman" 
              className="text-neutral-black hover:text-primary-orange transition-smooth font-barlow font-bold py-2"
              onClick={closeMenu}
            >
              Test drive
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
