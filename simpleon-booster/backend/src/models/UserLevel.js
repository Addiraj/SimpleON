import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UserLevel = sequelize.define('UserLevel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  activatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

export default UserLevel;
