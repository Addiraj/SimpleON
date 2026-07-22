import { sequelize } from '../config/database.js';
import User from './User.js';
import UserLevel from './UserLevel.js';
import MatrixCycle from './MatrixCycle.js';
import MatrixMember from './MatrixMember.js';
import Transaction from './Transaction.js';
import DailyCap from './DailyCap.js';

// Define Associations

// User -> UserLevel (1:M)
User.hasMany(UserLevel, { foreignKey: 'userId', as: 'levels' });
UserLevel.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> MatrixMember (1:M)
User.hasMany(MatrixMember, { foreignKey: 'userId', as: 'matrixPositions' });
MatrixMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// MatrixCycle -> MatrixMember (1:M)
MatrixCycle.hasMany(MatrixMember, { foreignKey: 'matrixCycleId', as: 'members' });
MatrixMember.belongsTo(MatrixCycle, { foreignKey: 'matrixCycleId', as: 'cycle' });

// MatrixMember -> MatrixMember (Self-referencing for parent/child in matrix)
MatrixMember.hasMany(MatrixMember, { foreignKey: 'parentId', as: 'children' });
MatrixMember.belongsTo(MatrixMember, { foreignKey: 'parentId', as: 'parent' });

// User -> Transaction (1:M)
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> DailyCap (1:M)
User.hasMany(DailyCap, { foreignKey: 'userId', as: 'dailyCaps' });
DailyCap.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> User (Self-referencing for referrals)
User.hasMany(User, { foreignKey: 'referredBy', as: 'referrals' });
User.belongsTo(User, { foreignKey: 'referredBy', as: 'referrer' });


export {
  sequelize,
  User,
  UserLevel,
  MatrixCycle,
  MatrixMember,
  Transaction,
  DailyCap
};
