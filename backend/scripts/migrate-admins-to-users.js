require('dotenv').config();
const { sequelize } = require('../config/database');
const { User, Admin } = require('../models');

(async () => {
  try {
    console.log('🔄 Starting migration: admins -> users');

    await sequelize.authenticate();
    console.log('✅ DB connected');

    const admins = await Admin.findAll();
    console.log(`Found ${admins.length} admin(s) to migrate`);

    let created = 0;
    let skipped = 0;

    for (const admin of admins) {
      const existing = await User.findOne({ where: { email: admin.email } });
      if (existing) {
        console.log(`⏭️  Skipping ${admin.email} (already exists in users)`);
        skipped++;
        continue;
      }

      // Create user with the SAME hashed password and role 'admin'.
      // IMPORTANT: disable hooks so we don't re-hash the already-hashed password.
      await User.create({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: admin.password, // already hashed in Admin model
        phone: admin.phone || null,
        role: 'admin',
        isActive: admin.isActive ?? true,
        profileImage: admin.profileImage || null,
        preferences: null,
      }, { hooks: false });

      console.log(`✅ Migrated admin -> user: ${admin.email}`);
      created++;
    }

    console.log('—'.repeat(60));
    console.log(`🎉 Migration complete. Created: ${created}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error(err);
    process.exit(1);
  }
})();
