# dóndecomo · Clientes web

Aplicación web Next.js para descubrir platos y establecimientos de comida en Coro.

## Incluye

- Inicio con búsqueda, tarjetas por categoría y locales recomendados.
- Nueve categorías: hamburguesas, perros, arepas, pizzas, empanadas, enrollados, salchipapas, pollo frito y pollo asado.
- Tarjetas de categoría con el plato mejor puntuado y acceso a su Top 3.
- Búsqueda por plato, establecimiento, zona o categoría, con filtros de abierto y cercanía.
- Top 3 vertical por categoría.
- Ficha de establecimiento con horario, contacto, menú y reputación calculada.
- Ficha de plato con calificación opcional de 1 a 5 estrellas, sin comentarios.
- Guardados persistentes en `localStorage`.
- Datos de respaldo locales para desarrollo si la API no está disponible.

## API

Copia `.env.example` a `.env.local` y ajusta:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

La API se encuentra en `../api`.

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
