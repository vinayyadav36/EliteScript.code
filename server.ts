import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './api/index';

const PORT = 3000;

async function startServer() {
  // Vite dev server middleware integration
  if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing Vite Development Middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Serving production static assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SALTEDHASH Studio Server] Running perfectly on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Critical failure starting Full-Stack server:', error);
});
