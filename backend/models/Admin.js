const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

class Admin extends Model {
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

Admin.init({
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'admin', 'manager'),
    defaultValue: 'admin',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      rooms: { create: true, read: true, update: true, delete: true },
      bookings: { create: true, read: true, update: true, delete: false },
      users: { create: false, read: true, update: true, delete: false }
    }
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING(50),
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Admin',
  tableName: 'admins',
  timestamps: true,
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
      }
    }
  }
});

module.exports = Admin;
