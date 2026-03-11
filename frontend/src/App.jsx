import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { store } from './store/store';
import AppRouter from './router/AppRouter';
import { fetchProducts } from './store/slices/productsSlice';
import './index.css';

// Componente interno que carga productos al inicio
function AppContent() {
  const dispatch = useDispatch();

  // Cargar productos al inicio de la aplicación (una sola vez)
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <AppRouter />
      <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#151515',
              color: '#FCF8F5',
              fontFamily: "'PP Neue Montreal', sans-serif",
            },
            success: {
              iconTheme: {
                primary: '#10B981', // Verde para éxito
                secondary: '#FFFFFF',
              },
              style: {
                background: '#151515',
                color: '#FCF8F5',
                border: '1px solid #10B981',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444', // Rojo para errores
                secondary: '#FFFFFF',
              },
              style: {
                background: '#151515',
                color: '#FCF8F5',
                border: '1px solid #EF4444',
              },
            },
          }}
        />
    </>
  );
}

function App() {
  // El plugin PHP pasa ROYRIFF_BASE como variable global (ej: '/')
  const getBasename = () => {
    if (typeof window !== 'undefined' && window.ROYRIFF_BASE) {
      return window.ROYRIFF_BASE; // normalmente '/'
    }
    return '/';
  };

  const basename = getBasename();

  return (
    <Provider store={store}>
      <BrowserRouter basename={basename}>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
