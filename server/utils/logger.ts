<<<<<<< HEAD
import { logger } from '../config/logger.js';

export { logger };
export default logger;
=======
export const logger = {
  info: (msg: string, meta?: any) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (msg: string, meta?: any) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  error: (msg: string, error?: any) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, error || '');
  }
};
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
