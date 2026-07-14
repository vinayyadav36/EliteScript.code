# Local Mode & Fallbacks

## Running Without Appwrite

The application is designed to work gracefully without an active Appwrite backend. When Appwrite SDK calls fail or return errors, the UI falls back to the hardcoded data defined in `src/data.ts`.

### What works without Appwrite

- All navigation and page views
- Service catalog and pricing (from `data.ts`)
- Cart and checkout flow (Express API to `orders.json`)
- Contact form submission (mock — generates transaction hash client-side)

### What requires Appwrite

- Dynamic product catalog from the `products` collection
- Contact lead persistence to the `contact_leads` collection
- Product image serving from the `product_assets` storage bucket
- Service data from the `services` collection

## Fallback Behavior

```typescript
// In any component that fetches from Appwrite:
try {
  const products = await databases.listDocuments(
    DATABASE_ID,
    PRODUCTS_COLLECTION_ID,
    [Query.equal('status', 'active')]
  );
  setProducts(products.documents);
} catch (err) {
  console.warn('Appwrite unavailable, using static data');
  setProducts(STATIC_FALLBACK_PRODUCTS);
}
```

## Express API Fallbacks

| Scenario | Behavior |
|----------|----------|
| `orders.json` doesn't exist | Returns empty `[]` |
| JSON parse error | Returns empty `[]`, logs error |
| Write failure | Logs error, returns stale data |
| Vercel serverless | Uses `/tmp/orders.json` (ephemeral) |

## Tide Payment Integration

The checkout flow uses Tide Business PayLink. This is a client-side redirect — no server-side payment processing occurs. The order is persisted with `status: 'Awaiting Tide Payment'` and the customer is redirected to Tide to complete payment.

## Environment Variables

All `VITE_`-prefixed variables are available in the client bundle. Non-prefixed variables (`APPWRITE_API_KEY`) are server-side only.

See [`.env.example`](../.env.example) for the full list.
