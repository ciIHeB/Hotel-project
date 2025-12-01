const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { adminProtect, generateAdminToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public (credentials required)
router.post('/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    await Admin.update({ lastLogin: new Date() }, { where: { id: admin.id } });

    const token = generateAdminToken(admin.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/me
// @desc    Get current admin
// @access  Private (admin)
router.get('/me', adminProtect, async (req, res) => {
  try {
    const admin = req.admin;
    res.json({
      success: true,
      user: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
