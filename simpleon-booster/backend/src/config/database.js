import { Sequelize } from 'sequelize';
import { env } from './env.js';

if (!env.DB_URI) {
  console.warn('WARNING: DB_URI is not set in environment variables');
}

export const sequelize = new Sequelize(env.DB_URI || 'postgres://localhost:5432/postgres', {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
});
