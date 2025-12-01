const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Room extends Model {}

Room.init({
  roomNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('standard', 'deluxe', 'suite', 'presidential'),
    allowNull: false,
    defaultValue: 'standard',
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  capacityAdults: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  capacityChildren: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  bedType: {
    type: DataTypes.ENUM('single', 'double', 'queen', 'king', 'twin'),
    allowNull: false,
  },
  size: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  amenities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  smokingAllowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  petFriendly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Room',
  timestamps: true,
});

module.exports = Room;

