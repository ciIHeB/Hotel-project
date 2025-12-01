const { sequelize } = require('./config/database');
require('./models');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    console.log('✅ Database tables synchronized');
    
    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

setupDatabase();
