# Architecture Overview

## Application Structure

SALTEDHASH is a single-page application (SPA) built with React 19, using client-side tab navigation instead of a traditional router.

```
src/
  main.tsx          # React entry point (StrictMode + createRoot)
  App.tsx           # Root component — tab state, cart, prefill orchestration
  index.css         # Tailwind v4 theme (custom color palette, fonts)
  types.ts          # TypeScript interfaces (Venture, Service, CartItem, Order, etc.)
  data.ts           # Static content (ventures, services, process steps, philosophy)
  lib/
    appwrite.ts     # Appwrite SDK client (lazy init)
  components/
    Navbar.tsx       # Fixed header with scroll-aware transparency, mobile drawer
    HomeView.tsx     # Landing page — hero, venture showcase, capabilities
    StudioView.tsx   # Services — expandable accordions, pricing tiers, add-to-cart
    VenturesView.tsx # Venture portfolio — category filter, architecture modal
    TriuView.tsx     # TRIU Naturals — product catalog, micro-batch tracker
    AboutView.tsx    # Philosophy and founding story
    ContactView.tsx  # Contact form with live JSON compiler sidebar
    CartDrawer.tsx   # Slide-over cart panel + order history + Tide checkout
    Footer.tsx       # Newsletter, navigation, contact coordinates
    ScrollReveal.tsx # Reusable scroll-triggered animation wrapper (Framer Motion)
```

## Routing

There is no client-side router. Navigation is managed via `activeTab` state in `App.tsx`:

```
home → HomeView
studio → StudioView
ventures → VenturesView
triu → TriuView
about → AboutView
contact → ContactView
```

`AnimatePresence` from Framer Motion handles page transitions with opacity + vertical slide.

## State Management

All state lives in `App.tsx` via React hooks:

- `activeTab` — current view
- `selectedVenture` — venture detail modal
- `cart` / `isCartOpen` — shopping cart items and drawer toggle
- `prefilledInterest` / `prefilledType` — contact form prefill from service/product actions

No external state library (Redux, Zustand, Pinia) is used.

## Backend

### Express Server (`server.ts`)

Dual-mode server:

| Mode | Behavior |
|------|----------|
| Development | Vite middleware integration via `createViteServer` with `middlewareMode: true` |
| Production | Serves static `dist/` files, SPA fallback to `index.html` |

### API Layer (`api/index.ts`)

JSON-file-based order persistence:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Returns server status, timestamp, environment |
| `/api/orders` | GET | Returns all persisted orders |
| `/api/orders` | POST | Creates a new order (idempotent by order.id) |
| `/api/orders/:id/status` | POST | Updates an order's status field |

Orders are stored in `orders.json` (local) or `/tmp/orders.json` (Vercel serverless).

## Styling

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- Custom `@theme` block in `src/index.css` defines the full color system
- Typography: Cormorant Garamond (serif), Inter (sans), JetBrains Mono (mono)
- No CSS modules or styled-components — pure utility classes

## Deployment Targets

### Vercel (Primary)

- `vercel.json` rewrites `/api/*` to `api/index.ts` (serverless function)
- Static frontend served via Vercel Edge
- Order persistence uses `/tmp/orders.json` (ephemeral filesystem)

### Local Development

- `npm run dev` starts Express + Vite on `http://localhost:3000`
- HMR enabled by default (disable with `DISABLE_HMR=true`)

## Data Flow

```
User Action → React Component → App State Update → UI Re-render
                                           ↓
                              CartDrawer → Express API → orders.json
                              ContactView → Mock submission → UI feedback
```

## Security Notes

- `APPWRITE_API_KEY` is server-side only (not exposed to Vite client bundle)
- Vite env vars prefixed with `VITE_` are included in client bundles — never put secrets here
- CORS is not configured in development (Express serves both API and frontend)
