require('dotenv').config();
const { sequelize } = require('../config/database');
const { Room } = require('../models');

(async () => {
  console.log('🌱 Seeding rooms if empty...');
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    const count = await Room.count();
    if (count > 0) {
      console.log(`ℹ️ Rooms already exist: ${count}. Skipping seeding.`);
      process.exit(0);
    }

    const rooms = [
      {
        roomNumber: '101',
        type: 'standard',
        title: 'Cozy Standard Room',
        description: 'A comfortable standard room with all essential amenities.',
        price: 89.99,
        capacityAdults: 2,
        capacityChildren: 1,
        bedType: 'queen',
        size: 22,
        amenities: ['wifi', 'tv', 'air-conditioning', 'room-service'],
        images: [],
        isAvailable: true,
        floor: 1,
        smokingAllowed: false,
        petFriendly: false
      },
      {
        roomNumber: '502',
        type: 'suite',
        title: 'Executive Suite',
        description: 'Spacious suite with separate living area and premium amenities.',
        price: 249.0,
        capacityAdults: 3,
        capacityChildren: 2,
        bedType: 'king',
        size: 60,
        amenities: ['wifi', 'tv', 'minibar', 'safe', 'jacuzzi', 'balcony'],
        images: [],
        isAvailable: true,
        floor: 5,
        smokingAllowed: false,
        petFriendly: true
      }
    ];

    await Room.bulkCreate(rooms);
    console.log('✅ Seeded 2 rooms.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
})();
