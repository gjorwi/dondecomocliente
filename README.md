# comidasTop · Clientes web

Aplicación web Next.js para descubrir platos y establecimientos de comida en Coro.

## Incluye

- Inicio con búsqueda, promociones destacadas deslizables, tarjetas por categoría y locales recomendados.
- Botón central de escaneo en la barra inferior para abrir el QR del local.
- Flujo de escaneo con validación de ubicación: habilita 2 votos durante 24 horas si el cliente está cerca del local.
- Nueve categorías: hamburguesas, perros, arepas, pizzas, empanadas, enrollados, salchipapas, pollo frito y pollo asado.
- Tarjetas de categoría con el plato mejor puntuado y acceso a su Top 3.
- Búsqueda por plato, establecimiento, zona o categoría, con filtros expandibles de abierto y cercanía.
- Top 3 vertical por categoría.
- Ficha de establecimiento con horario, contacto, menú y reputación calculada.
- Ficha de plato informativa; la puntuación de 1 a 5 estrellas solo se habilita después de escanear el QR del local.
- Favoritos persistentes en `localStorage`.
- Todos los catálogos y resultados provienen de la API y la base de datos; no hay datos de ejemplo en la interfaz.

## API

Copia `.env.example` a `.env.local` y ajusta:

```env
API_URL=http://localhost:4000/api
```

La API se encuentra en `../api`.

En Vercel configura `API_URL` con la URL base del API, incluyendo `/api` (por ejemplo `https://api.tudominio.com/api`) y vuelve a desplegar. La app usa un rewrite de Next.js para reenviar `/api/*` desde el servidor, sin llamadas cross-origin desde el navegador.

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Verificación

```bash
npm run lint
npm run build
```
