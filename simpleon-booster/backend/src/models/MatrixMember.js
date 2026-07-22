import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const MatrixMember = sequelize.define('MatrixMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

export default MatrixMember;
