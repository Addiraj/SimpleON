import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  member_id: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  wallet_address: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  wallet_provider: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  is_connected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  last_connected_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'active',
  }
}, {
  hooks: {
    beforeValidate: async (user, options) => {
      // Automatically generate member_id like SM000001 if it's not set
      if (!user.member_id) {
        try {
          // Find the user with the highest id/member_id
          const lastUser = await User.findOne({
            order: [['id', 'DESC']],
            attributes: ['member_id'],
            raw: true
          });

          let nextNum = 1;
          if (lastUser && lastUser.member_id && lastUser.member_id.startsWith('SM')) {
            const lastNum = parseInt(lastUser.member_id.replace('SM', ''), 10);
            if (!isNaN(lastNum)) {
              nextNum = lastNum + 1;
            }
          }
          user.member_id = `SM${String(nextNum).padStart(6, '0')}`;
        } catch (error) {
          console.error("Error generating member_id:", error);
          // Fallback, should theoretically only happen on first run if table is empty and errors
          user.member_id = `SM${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
        }
      }
    }
  }
});

export default User;
