const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Booking extends Model {}

Booking.init({
  bookingId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  checkIn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  guestsAdults: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  guestsChildren: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit-card', 'debit-card', 'paypal', 'bank-transfer', 'cash'),
    defaultValue: 'credit-card',
  },
  specialRequests: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  cancellationReason: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  nights: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Booking',
  timestamps: true,
  hooks: {
    beforeValidate: (booking) => {
      // Generate bookingId if not present
      if (!booking.bookingId) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        booking.bookingId = `HTL-${timestamp}-${random}`.toUpperCase();
      }
      // Calculate nights
      if (booking.checkIn && booking.checkOut) {
        const timeDiff = new Date(booking.checkOut) - new Date(booking.checkIn);
        booking.nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
    }
  }
});

module.exports = Booking;

