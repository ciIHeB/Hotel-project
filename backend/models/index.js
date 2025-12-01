const User = require('./User');
const Room = require('./Room');
const Booking = require('./Booking');
const Admin = require('./Admin');

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

module.exports = {
  User,
  Room,
  Booking,
  Admin
};
