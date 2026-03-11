# Roy Riff - Frontend

Sitio web oficial de Roy Riff: bicicletas eléctricas premium en Argentina.

## 🚀 Stack Tecnológico

- **React 18** - Librería UI
- **Vite** - Build tool
- **Redux Toolkit** - Estado global
- **React Router DOM** - Navegación
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **Axios** - HTTP client
- **React Hot Toast** - Notificaciones
- **React Icons** - Iconos

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   │   ├── common/     # Componentes comunes (Button, LoadingSpinner, etc.)
│   │   └── layout/     # Layout components (Header, Footer, Layout)
│   ├── pages/          # Páginas/vistas por ruta
│   ├── store/          # Redux store y slices
│   ├── router/         # Configuración de rutas
│   ├── theme/          # Tokens de diseño (colores, tipografía)
│   ├── utils/          # Constantes y helpers
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── public/             # Archivos estáticos
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Sistema de Diseño

### Colores
- **Primary Beige**: `#FCF8F5` - Fondo principal
- **Primary Orange**: `#FF460D` - Acento principal (botones, links)
- **Primary Yellow**: `#FED400` - Acento secundario
- **Neutral Gray**: `#C7C9C4` - Texto secundario
- **Neutral Dark Green**: `#344648` - Texto terciario
- **Neutral Black**: `#151515` - Texto principal

### Tipografías
- **PP Neue Montreal** - Body text
- **Barlow Semi Condensed** - Headings

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Configurar variables de entorno en .env
```

## 🚦 Comandos

```bash
# Desarrollo (http://localhost:3000)
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🗺️ Rutas Principales

### Core Comercial
- `/` - Home
- `/bicicletas-electricas/lola-cruiser-bike` - PDP LOLA
- `/bicicletas-electricas/xxxx-expedicion-todoterreno-fat-bike` - PDP XXXX
- `/bicicletas-electricas/comparacion-ebike-royriff` - Comparador

### Bloque Confianza
- `/financiacion` - Cuotas y medios de pago
- `/envios` - Información de envíos
- `/servicio-tecnico-y-garantia` - Service y garantía
- `/faq` - Preguntas frecuentes
- `/test-ride-tucuman` - Test ride
- `/contacto` - Contacto

### Tutoriales
- `/tutoriales` - Hub de tutoriales
- `/tutoriales/armado` - Tutorial de armado
- `/tutoriales/bateria-y-carga` - Tutorial de batería
- `/tutoriales/mantenimiento-basico` - Mantenimiento
- `/tutoriales/seguridad-antirrobo` - Seguridad

### E-commerce
- `/carrito` - Carrito de compras
- `/compra-confirmada` - Confirmación de compra
- `/seguimiento` - Tracking de pedido

### Legales
- `/boton-de-arrepentimiento` - Botón de arrepentimiento
- `/cambios-y-devoluciones` - Política de devoluciones
- `/terminos-y-condiciones` - Términos
- `/politica-de-privacidad` - Privacidad

## 🔌 API y WooCommerce

El frontend **no** se conecta directamente a WooCommerce. Todas las llamadas van al **backend propio** del proyecto (carpeta `backend/`), donde están las credenciales de forma segura.

- En **desarrollo**: el proxy de Vite redirige `/api` al backend en `http://localhost:4000`. Hay que tener el backend levantado (`cd backend && npm run dev`).
- En **producción**: configurar `VITE_API_URL` con la URL del backend.

Variables de entorno del frontend (ver `.env.example`):

```env
VITE_API_URL=          # Opcional; en dev se usa el proxy
VITE_STORE_URL=        # URL pública de la tienda (solo para redirección al checkout)
VITE_FRONTEND_URL=     # URL del frontend (retorno/cancelación de pago)
```

## 📦 Estado Global (Redux)

### Slices
- **products** - Gestión de productos
- **cart** - Carrito de compras (persistido en localStorage)

## 🎯 Próximos Pasos

- [ ] Conectar con API de WooCommerce
- [ ] Implementar checkout real
- [ ] Agregar imágenes de productos
- [ ] Implementar sistema de búsqueda
- [ ] Agregar Google Analytics
- [ ] Optimizar imágenes
- [ ] Implementar SEO avanzado
- [ ] Tests unitarios

## 📝 Notas

- El carrito se persiste en `localStorage`
- Las rutas protegidas se pueden añadir usando el patrón de `ProtectedRoute`
- Los productos actuales son estáticos, se deben reemplazar con llamadas a la API

## 🤝 Contribuir

Este es un proyecto privado de Roy Riff.

## 📄 Licencia

© 2026 Roy Riff. Todos los derechos reservados.
