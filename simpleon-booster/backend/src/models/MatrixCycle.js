import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const MatrixCycle = sequelize.define('MatrixCycle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cycleNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

export default MatrixCycle;
