# SALTEDHASH

Venture studio and brand umbrella. Builds intelligent software and curates natural products.

## Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS v4 · Framer Motion · Express · Appwrite SDK

## Setup

```bash
npm install
cp .env.example .env
# Fill in .env with your Appwrite project credentials
```

## Dev

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Deploy

Connect repo to Vercel. Set environment variables from `.env` in Vercel dashboard. Deploy.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Appwrite Setup](APPWRITE_SETUP.md)
- [Vercel Deployment](docs/VERCEL_DEPLOYMENT.md)
- [Local Mode & Fallbacks](docs/LOCAL_MODE.md)

## Routes

| Path | View |
|------|------|
| `/` | Home — venture studio landing |
| `/studio` | The Studio — tech & AI/ML services |
| `/triu` | TRIU Naturals — botanical product catalog |
| `/about` | Our Philosophy — brand story |
| `/contact` | Initiate Inquiry — contact and lead form |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health and status check |
| `GET` | `/api/orders` | Retrieve all orders |
| `POST` | `/api/orders` | Create a new order |
| `POST` | `/api/orders/:id/status` | Update order status |

## Env Variables

See [`.env.example`](.env.example) for all required environment variables.

## License

Apache License 2.0
