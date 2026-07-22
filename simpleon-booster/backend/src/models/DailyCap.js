import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const DailyCap = sequelize.define('DailyCap', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  }
});

export default DailyCap;
