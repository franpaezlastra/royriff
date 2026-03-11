# Cómo ver el JSON de productos que viene de WordPress

## URLs para abrir en el navegador

El frontend pide los productos a la **misma base** que usa la app. Según dónde estés:

### En desarrollo (con el servidor de Vite corriendo)

- **Lista de productos:**  
  `http://localhost:5173/api/products`  
  (O el puerto que use Vite, ej. 3000.)

- **Un producto por slug (ej. LOLA):**  
  `http://localhost:5173/api/products/slug/lola-cruiser`

- **Un producto por slug (ej. XXXX):**  
  `http://localhost:5173/api/products/slug/xxxx-expedition`

### En producción (sitio ya publicado)

Sustituí `https://tu-dominio.com` por la URL real de tu sitio:

- **Lista de productos:**  
  `https://tu-dominio.com/api/products`

- **Un producto por slug:**  
  `https://tu-dominio.com/api/products/slug/lola-cruiser`

Si en tu proyecto el API está en **otro dominio** (por ejemplo `https://api.royriff.com.ar`), usá esa base y la misma ruta:  
`https://api.royriff.com.ar/api/products` y `https://api.royriff.com.ar/api/products/slug/lola-cruiser` (o la ruta exacta que use tu backend).

---

## Qué necesitamos para las fotos por color

Para que la página “Elegir” muestre **fotos según el color** (Champagne, Graphite, etc.), el JSON del producto tiene que traer las **variaciones** con:

1. **Atributo de color**  
   Por ejemplo `pa_color` o “Color”, con el nombre del color en español (ej. “Champagne Metallic”, “Graphite Pearl”).

2. **Imagen por variación**  
   Cada variación con su `image` (o `images`) para ese color.

Ejemplo de cómo suele verse en el JSON de WooCommerce (o similar):

```json
{
  "id": 123,
  "name": "LOLA ...",
  "slug": "lola-cruiser",
  "variations": [
    {
      "id": 456,
      "attributes": [
        { "name": "pa_color", "option": "Champagne Metallic" }
      ],
      "image": {
        "id": 10,
        "src": "https://tusitio.com/wp-content/uploads/lola-champagne.jpg",
        "alt": "LOLA Champagne Metallic"
      }
    },
    {
      "id": 457,
      "attributes": [
        { "name": "pa_color", "option": "Graphite Pearl" }
      ],
      "image": {
        "id": 11,
        "src": "https://tusitio.com/wp-content/uploads/lola-graphite.jpg",
        "alt": "LOLA Graphite Pearl"
      }
    }
  ]
}
```

**Nota:** Si tu API devuelve el producto dentro de un array (ej. `[{ "id": 83, "name": "LOLA ...", ... }]`), el frontend ya lo soporta y usa el primer elemento.

Si las variaciones vienen solo como IDs (`"variations": [85, 84]`), el código puede armar las fotos por color a partir del array **`images`** del producto: usa el atributo **Color** (`attributes[].options`: "Champagne Metallic", "Graphite Pearl") y asigna cada imagen a un color según su `name`, `alt` o URL (ej. "Graphite Pearl", "Champagne Metallic", "negra", "verde").

---

## Cómo pegar el JSON para que te ayude con el código

1. Abrí en el navegador la URL de **un producto por slug** (ej. LOLA):  
   `.../api/products/slug/lola-cruiser`
2. Copiá **todo** el JSON que se ve (Ctrl+A, Ctrl+C).
3. Pegalo en el chat o en un archivo y compartilo.

Con eso se puede:
- Decirte exactamente qué URL usar en tu caso.
- Ajustar el código para que tome las fotos de cada color desde tu JSON y se vean en la página “Elegir”.
