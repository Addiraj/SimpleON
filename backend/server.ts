import { startServer } from './server/server.js';

startServer().catch((err) => {
  console.error('Fatal Server Error during startup:', err);
  process.exit(1);
});
