# 🚀 INICIO RÁPIDO - ROY RIFF

## ✅ EL PROYECTO YA ESTÁ FUNCIONANDO

**Servidor corriendo en:** http://localhost:3001/

---

## 📍 ESTÁS AQUÍ

```
C:\Users\NEW GAME\Desktop\TodoFran\RoyRiff\
├── frontend/          ← Todo el código React está aquí
├── LOLA/             ← (carpeta anterior, ignorar)
├── PROYECTO-COMPLETO.md  ← Documentación completa
└── INICIO-RAPIDO.md  ← Este archivo
```

---

## 🎯 ACCIONES RÁPIDAS

### Ver el sitio funcionando:
1. Abrí tu navegador
2. Andá a: **http://localhost:3001/**
3. ¡Listo! Navegá por todas las páginas

### Detener el servidor:
```bash
# En la terminal donde está corriendo:
Ctrl + C
```

### Volver a iniciar:
```bash
cd frontend
npm run dev
```

---

## 📄 PÁGINAS QUE PODÉS VER AHORA

### Principales:
- **Home:** http://localhost:3001/
- **LOLA:** http://localhost:3001/bicicletas-electricas/lola-cruiser-bike
- **XXXX:** http://localhost:3001/bicicletas-electricas/xxxx-expedicion-todoterreno-fat-bike
- **Comparador:** http://localhost:3001/bicicletas-electricas/comparacion-ebike-royriff
- **Carrito:** http://localhost:3001/carrito

### Confianza:
- http://localhost:3001/financiacion
- http://localhost:3001/envios
- http://localhost:3001/servicio-tecnico-y-garantia
- http://localhost:3001/faq
- http://localhost:3001/test-ride-tucuman
- http://localhost:3001/contacto

### Tutoriales:
- http://localhost:3001/tutoriales

---

## ✏️ HACER CAMBIOS

### Cambiar textos:
Los textos principales están en:
- **Home:** `frontend/src/pages/Home/sections/`
- **Productos:** `frontend/src/utils/constants.js` (datos de LOLA y XXXX)
- **Páginas info:** `frontend/src/pages/[NombrePagina]/`

### Cambiar colores:
`frontend/src/theme/colors.js`

### Agregar imágenes:
1. Poné las imágenes en `frontend/public/images/`
2. Usá la ruta: `/images/nombre-imagen.jpg`

---

## 🔧 COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev

# Crear versión de producción
npm run build

# Ver versión de producción localmente
npm run preview
```

---

## 🆘 SI ALGO NO FUNCIONA

### El servidor no inicia:
```bash
cd frontend
npm install
npm run dev
```

### Puerto ocupado:
Vite automáticamente usa otro puerto (3001, 3002, etc.)

### Error de dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 MÁS INFORMACIÓN

- **Documentación completa:** `PROYECTO-COMPLETO.md`
- **README técnico:** `frontend/README.md`
- **Código fuente:** `frontend/src/`

---

## 🎨 LO QUE TENÉS QUE HACER

### INMEDIATO:
1. ✅ Revisar todas las páginas en el navegador
2. ✅ Probar el carrito (agregar productos, cambiar cantidad)
3. ✅ Verificar que te guste el diseño y colores

### PRÓXIMO:
1. 📸 Agregar imágenes reales de LOLA y XXXX
2. 📝 Completar contenido de tutoriales
3. 📝 Completar páginas legales
4. 🔗 Configurar conexión con WooCommerce

---

## 💡 TIPS

- **Los cambios se ven automáticamente** (hot reload)
- **El carrito se guarda en localStorage** (persiste al recargar)
- **Todas las páginas son responsive** (probá en mobile)
- **Las animaciones son con Framer Motion** (smooth scrolls)

---

**¿Dudas? Revisá `PROYECTO-COMPLETO.md` para documentación detallada.**

---

🎉 **¡ROY RIFF ESTÁ LISTO PARA RODAR!** 🚲
