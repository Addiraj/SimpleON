import { prisma, checkDatabaseConnection, disconnectDatabase } from '../config/database.js';

export { prisma, checkDatabaseConnection, disconnectDatabase };
export default prisma;
