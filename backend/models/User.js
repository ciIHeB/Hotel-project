const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

class User extends Model {
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

User.init({
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
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('guest', 'admin'),
    defaultValue: 'guest',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

module.exports = User;

