import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Páginas
import Home from '../pages/Home/Home';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import ProductElegir from '../pages/ProductElegir/ProductElegir';
import Comparador from '../pages/Comparador/Comparador';
import Financiacion from '../pages/Financiacion/Financiacion';
import Envios from '../pages/Envios/Envios';
import ServicioGarantia from '../pages/ServicioGarantia/ServicioGarantia';
import FAQ from '../pages/FAQ/FAQ';
import TestRide from '../pages/TestRide/TestRide';
import Contacto from '../pages/Contacto/Contacto';
import Tutoriales from '../pages/Tutoriales/Tutoriales';
import Local from '../pages/Local/Local';
import Galeria from '../pages/Galeria/Galeria';
import TutorialArmado from '../pages/Tutoriales/TutorialArmado';
import TutorialBateria from '../pages/Tutoriales/TutorialBateria';
import TutorialMantenimiento from '../pages/Tutoriales/TutorialMantenimiento';
import TutorialSeguridad from '../pages/Tutoriales/TutorialSeguridad';
import Carrito from '../pages/Carrito/Carrito';
import CheckoutEntrega from '../pages/Checkout/CheckoutEntrega';
import CheckoutPago from '../pages/Checkout/CheckoutPago';
import RedireccionPago from '../pages/RedireccionPago/RedireccionPago';
import CompraConfirmada from '../pages/CompraConfirmada/CompraConfirmada';
import PedidoCancelado from '../pages/PedidoCancelado/PedidoCancelado';
import Seguimiento from '../pages/Seguimiento/Seguimiento';

// Páginas legales
import BotonArrepentimiento from '../pages/Legal/BotonArrepentimiento';
import CambiosDevoluciones from '../pages/Legal/CambiosDevoluciones';
import TerminosCondiciones from '../pages/Legal/TerminosCondiciones';
import PoliticaPrivacidad from '../pages/Legal/PoliticaPrivacidad';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Core comercial */}
        <Route index element={<Home />} />
        <Route path="bicicletas-electricas">
          <Route path=":product" element={<ProductDetail />} />
          <Route path=":product/elegir" element={<ProductElegir />} />
          <Route path="comparacion-ebike-royriff" element={<Comparador />} />
        </Route>

        {/* Bloque confianza */}
        <Route path="financiacion" element={<Financiacion />} />
        <Route path="envios" element={<Envios />} />
        <Route path="servicio-tecnico-y-garantia" element={<ServicioGarantia />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="test-ride-tucuman" element={<TestRide />} />
        <Route path="local" element={<Local />} />
        <Route path="galeria" element={<Galeria />} />
        <Route path="contacto" element={<Contacto />} />

        {/* Tutoriales */}
        <Route path="tutoriales">
          <Route index element={<Tutoriales />} />
          <Route path="armado" element={<TutorialArmado />} />
          <Route path="bateria-y-carga" element={<TutorialBateria />} />
          <Route path="mantenimiento-basico" element={<TutorialMantenimiento />} />
          <Route path="seguridad-antirrobo" element={<TutorialSeguridad />} />
        </Route>

        {/* E-commerce */}
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<CheckoutEntrega />} />
        <Route path="checkout/pago" element={<CheckoutPago />} />
        <Route path="redireccion-pago" element={<RedireccionPago />} />
        <Route path="compra-confirmada" element={<CompraConfirmada />} />
        <Route path="pedido-cancelado" element={<PedidoCancelado />} />
        <Route path="seguimiento" element={<Seguimiento />} />

        {/* Legales */}
        <Route path="boton-de-arrepentimiento" element={<BotonArrepentimiento />} />
        <Route path="cambios-y-devoluciones" element={<CambiosDevoluciones />} />
        <Route path="terminos-y-condiciones" element={<TerminosCondiciones />} />
        <Route path="politica-de-privacidad" element={<PoliticaPrivacidad />} />

        {/* Redirect cualquier ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
