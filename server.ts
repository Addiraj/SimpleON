import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/auth.routes.js';
import userRoutes from './server/routes/user.routes.js';
import boosterRoutes from './server/routes/booster.routes.js';
import matrixRoutes from './server/routes/matrix.routes.js';
import statsRoutes from './server/routes/stats.routes.js';
import contractRoutes from './server/routes/contract.routes.js';
import { errorHandler } from './server/middlewares/errorHandler.js';
import { logger } from './server/utils/logger.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/booster', boosterRoutes);
  app.use('/api/matrix', matrixRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/contract', contractRoutes);

  // Healthcheck endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Global Error Handler
  app.use(errorHandler);

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Starting Vite Dev Middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    logger.info('Serving static build from /dist...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`SimpleOn Full-Stack Web3 Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
  process.exit(1);
});
