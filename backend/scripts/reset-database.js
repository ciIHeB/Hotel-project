const { sequelize } = require('../config/database');
require('../models');
require('dotenv').config();
const { spawn } = require('child_process');

async function runNodeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env,
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptPath} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

(async () => {
  try {
    console.log('⚠️  RESET: Dropping and recreating all tables...');
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✅ Tables recreated. Seeding data...');

    // Seed admin and rooms sequentially
    await runNodeScript(require('path').join(__dirname, 'seed-admin.js'));
    await runNodeScript(require('path').join(__dirname, 'seed-rooms.js'));

    console.log('🎉 Database reset and seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed:', err.message);
    console.error(err);
    process.exit(1);
  }
})();
