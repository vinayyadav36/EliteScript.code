# Local Development & Fallback Modes

SALTEDHASH is built to survive network interruptions and missing configurations. The "Local Mode" refers to the application's behavior when the cloud database is not connected.

## Why Local Mode Exists
1. **Developer Experience:** Allows developers to clone the repo, run `npm install`, and immediately see a fully functioning UI without needing Appwrite credentials.
2. **Offline Resilience:** Should the backend go down or a user lose network connection, the application displays hardcoded fallback information rather than crashing or showing blank pages.

## How It Works

### Composables Layer
The intelligence for Local Mode is managed entirely within the `/src/composables` directory.
For example, `useProducts.ts`:
1. Checks for `VITE_APPWRITE_PROJECT_ID`.
2. If missing, it immediately sets `products.value` to a hardcoded `fallbackProducts` array and returns.
3. If present but the network request fails, it catches the error, logs a warning, and returns an empty or fallback state.

### Fallback UI States
- **Studio Services (`/studio`):** Renders a hardcoded array of services.
- **TRIU Products (`/triu`):** Renders a hardcoded catalog of natural products.
- **Contact Form (`/contact`):** If form submission fails due to an unreachable database, a UI banner appears directing the user to connect via WhatsApp or Email links directly.

## Bypassing Local Mode
To exit Local Mode and develop against live data:
1. Copy `.env.example` to `.env`.
2. Fill in the real Appwrite endpoint and project IDs.
3. Run `npm run dev`. The application will automatically attempt to fetch from the cloud backend.
