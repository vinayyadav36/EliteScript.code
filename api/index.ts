import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());

// Determine order persistence based on environment.
// WARNING: Vercel serverless environments are ephemeral and read-only.
// Writing to '/tmp/orders.json' works temporarily but gets wiped during cold starts
// or when requests scale to different serverless instances.
// This local JSON file persistence is intended for development and local testing only.
// In a true production environment, migrate order persistence to Appwrite databases.
const isVercel = process.env.VERCEL === '1';
const ORDERS_FILE = isVercel 
  ? '/tmp/orders.json' 
  : path.join(process.cwd(), 'orders.json');

// Ensure database helper is safe
function readOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading orders database:', error);
  }
  return [];
}

function writeOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing orders database:', error);
  }
}

// Health and Status API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: isVercel ? 'vercel-serverless' : 'local-node',
  });
});

// Retrieve Order History
app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  res.json({ success: true, orders });
});

// Save New Order
app.post('/api/orders', (req, res) => {
  const { order } = req.body;
  if (!order || !order.id) {
    return res.status(400).json({ success: false, error: 'Malformed order details provided.' });
  }

  const orders = readOrders();
  const exists = orders.some((o: any) => o.id === order.id);

  if (!exists) {
    const updatedOrders = [order, ...orders];
    writeOrders(updatedOrders);
  }

  res.json({ success: true, order });
});

// Simulate Order Status update (e.g. mock payments moving from Awaiting to Processing)
app.post('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, error: 'Status string is required.' });
  }

  const orders = readOrders();
  const orderIdx = orders.findIndex((o: any) => o.id === id);

  if (orderIdx === -1) {
    return res.status(404).json({ success: false, error: 'Requested order reference not found.' });
  }

  orders[orderIdx].status = status;
  writeOrders(orders);

  res.json({ success: true, order: orders[orderIdx] });
});

export default app;
