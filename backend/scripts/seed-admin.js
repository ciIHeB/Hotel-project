const { connectDB } = require('../config/database');
const Admin = require('../models/Admin');
require('dotenv').config();

async function seedAdmin() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Check if any admin exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      console.log('Skipping admin creation.');
      process.exit(0);
    }

    // Create default admin
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@hotel.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'super_admin',
      isActive: true,
      department: 'Management',
      permissions: {
        rooms: { create: true, read: true, update: true, delete: true },
        bookings: { create: true, read: true, update: true, delete: true },
        users: { create: true, read: true, update: true, delete: true }
      }
    };

    const admin = await Admin.create(adminData);
    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('🚨 IMPORTANT: Change the default password after first login!');
    console.log('');
    console.log('You can now login at: /admin-login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

// Run the seeding function
seedAdmin();
