const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'hotel_website',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('📊 MySQL Connected (Sequelize)');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
