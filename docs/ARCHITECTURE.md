# SALTEDHASH Architecture

SALTEDHASH is a modern Single Page Application (SPA) with Progressive Web App (PWA) capabilities.

## Tech Stack
- **Frontend Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **State Management:** Pinia
- **Styling:** Tailwind CSS v4
- **Routing:** Vue Router (History Mode)
- **Backend/BaaS:** Appwrite (cloud.appwrite.io)
- **Deployment:** Vercel

## Key Architectural Decisions

### 1. Composables for State & Side-Effects
All external interactions and state-heavy logic are wrapped in Vue composables (e.g., `useProducts.ts`, `useServices.ts`, `useLeads.ts`). This isolates Appwrite API calls from UI components and allows for clean local fallbacks.

### 2. Graceful Degradation & Resilience
The application prioritizes user experience above all. If the Appwrite database is inaccessible (due to network failure, missing environment variables, or local development without credentials), the composable layers gracefully catch these errors and populate the UI with hardcoded, local-first fallback data. Forms fallback to direct interaction methods (Email / WhatsApp).

### 3. PWA Capabilities
The app leverages `vite-plugin-pwa` to function as a Progressive Web App. It utilizes an auto-updating service worker to cache critical assets (`NetworkFirst` for API routes, `StaleWhileRevalidate` for assets) and handles routing fallbacks internally for maximum offline resilience.

### 4. Vercel SPA Routing
Deployment assumes a static output (`dist/`). Vercel handles all dynamic sub-routing via `vercel.json` rewrites, routing every unmapped request directly back to the `index.html` Vue router entrypoint.
