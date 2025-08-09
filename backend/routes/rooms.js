const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Room, Booking } = require('../models');
const { adminProtect } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'rooms');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({ storage });

// @route   GET /api/rooms
// @desc    Get all rooms with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('adults').optional().isInt({ min: 1 }).withMessage('Adults must be at least 1'),
  query('children').optional().isInt({ min: 0 }).withMessage('Children cannot be negative')
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object (Sequelize)
    const where = {};
    if (req.query.isAvailable !== undefined) {
      where.isAvailable = req.query.isAvailable === 'true';
    }
    if (req.query.type) where.type = req.query.type;
    if (req.query.bedType) where.bedType = req.query.bedType;
    if (req.query.smokingAllowed !== undefined) where.smokingAllowed = req.query.smokingAllowed === 'true';
    if (req.query.petFriendly !== undefined) where.petFriendly = req.query.petFriendly === 'true';
    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice) where.price[Op.gte] = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) where.price[Op.lte] = parseFloat(req.query.maxPrice);
    }
    if (req.query.adults) where.capacityAdults = { [Op.gte]: parseInt(req.query.adults) };
    if (req.query.children) where.capacityChildren = { [Op.gte]: parseInt(req.query.children) };

    // Sorting
    const order = [];
    if (req.query.sortBy) {
      const sortOrder = (req.query.sortOrder === 'desc' ? 'DESC' : 'ASC');
      order.push([req.query.sortBy, sortOrder]);
    } else {
      order.push(['price', 'ASC']);
    }

    const { rows: rooms, count: total } = await Room.findAndCountAll({
      where,
      order,
      offset: skip,
      limit
    });

    res.json({
      success: true,
      count: rooms.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// IMPORTANT: define more specific route BEFORE the generic ":id" route
// @route   GET /api/rooms/availability/check
// @desc    Check room availability for specific dates
// @access  Public
router.get('/availability/check', [
  query('checkIn').isISO8601().withMessage('Check-in date must be a valid date'),
  query('checkOut').isISO8601().withMessage('Check-out date must be a valid date'),
  query('adults').optional().isInt({ min: 1 }).withMessage('Adults must be at least 1'),
  query('children').optional().isInt({ min: 0 }).withMessage('Children cannot be negative')
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

    const { checkIn, checkOut, adults = 1, children = 0 } = req.query;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    const bookedRooms = await Booking.findAll({
      where: {
        status: ['confirmed', 'checked-in'],
        checkIn: { [require('sequelize').Op.lt]: checkOutDate },
        checkOut: { [require('sequelize').Op.gt]: checkInDate }
      },
      attributes: ['roomId']
    });
    const bookedRoomIds = bookedRooms.map(b => b.roomId);

    const filter = {
      isAvailable: true,
      id: { [require('sequelize').Op.notIn]: bookedRoomIds },
      capacityAdults: { [require('sequelize').Op.gte]: parseInt(adults) },
      capacityChildren: { [require('sequelize').Op.gte]: parseInt(children) }
    };

    const availableRooms = await Room.findAll({ where: filter });

    res.json({
      success: true,
      count: availableRooms.length,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      data: availableRooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get single room
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/rooms/availability/check
// @desc    Check room availability for specific dates
// @access  Public
router.get('/availability/check', [
  query('checkIn').isISO8601().withMessage('Check-in date must be a valid date'),
  query('checkOut').isISO8601().withMessage('Check-out date must be a valid date'),
  query('adults').optional().isInt({ min: 1 }).withMessage('Adults must be at least 1'),
  query('children').optional().isInt({ min: 0 }).withMessage('Children cannot be negative')
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

    const { checkIn, checkOut, adults = 1, children = 0 } = req.query;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Find rooms that are not booked during the specified period
    const bookedRooms = await Booking.findAll({
      where: {
        status: ['confirmed', 'checked-in'],
        checkIn: { [require('sequelize').Op.lt]: checkOutDate },
        checkOut: { [require('sequelize').Op.gt]: checkInDate }
      },
      attributes: ['roomId']
    });
    const bookedRoomIds = bookedRooms.map(b => b.roomId);

    // Find available rooms
    const filter = {
      isAvailable: true,
      id: { [require('sequelize').Op.notIn]: bookedRoomIds },
      capacityAdults: { [require('sequelize').Op.gte]: parseInt(adults) },
      capacityChildren: { [require('sequelize').Op.gte]: parseInt(children) }
    };

    const availableRooms = await Room.findAll({ where: filter });

    res.json({
      success: true,
      count: availableRooms.length,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      data: availableRooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/rooms
// @desc    Create new room (Admin only)
// @access  Private/Admin
router.post('/', adminProtect, upload.array('images', 5), [
  body('roomNumber').notEmpty().withMessage('Room number is required'),
  body('type').isIn(['standard', 'deluxe', 'suite', 'presidential']).withMessage('Invalid room type'),
  body('title').notEmpty().withMessage('Room title is required'),
  body('description').notEmpty().withMessage('Room description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacityAdults').isInt({ min: 1 }).withMessage('Adult capacity must be at least 1'),
  body('capacityChildren').optional().isInt({ min: 0 }).withMessage('Children capacity cannot be negative'),
  body('bedType').isIn(['single', 'double', 'queen', 'king', 'twin']).withMessage('Invalid bed type'),
  body('size').isFloat({ min: 10 }).withMessage('Room size must be at least 10 sqm'),
  body('floor').isInt({ min: 1 }).withMessage('Floor must be at least 1')
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
    // Parse payload and uploaded images
    const payload = {
      roomNumber: req.body.roomNumber,
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      capacityAdults: parseInt(req.body.capacityAdults),
      capacityChildren: req.body.capacityChildren !== undefined ? parseInt(req.body.capacityChildren) : 0,
      bedType: req.body.bedType,
      size: parseFloat(req.body.size),
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === 'true' || req.body.isAvailable === true : true,
      floor: parseInt(req.body.floor),
      smokingAllowed: req.body.smokingAllowed === 'true' || req.body.smokingAllowed === true,
      petFriendly: req.body.petFriendly === 'true' || req.body.petFriendly === true,
      amenities: [],
      images: []
    };

    // amenities may come as JSON string or comma-separated
    if (req.body.amenities) {
      try {
        const parsed = JSON.parse(req.body.amenities);
        payload.amenities = Array.isArray(parsed) ? parsed : [];
      } catch {
        payload.amenities = String(req.body.amenities).split(',').map(a => a.trim()).filter(Boolean);
      }
    }

    // Uploaded images
    if (req.files && Array.isArray(req.files)) {
      const base = '/uploads/rooms/';
      payload.images = req.files.map(f => base + path.basename(f.path));
    }

    const room = await Room.create(payload);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    if (error && error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Room number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update room (Admin only)
// @access  Private/Admin
router.put('/:id', adminProtect, upload.array('images', 5), async (req, res) => {
  try {
    const existing = await Room.findByPk(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Build updates
    const updates = {
      roomNumber: req.body.roomNumber ?? existing.roomNumber,
      type: req.body.type ?? existing.type,
      title: req.body.title ?? existing.title,
      description: req.body.description ?? existing.description,
      price: req.body.price !== undefined ? parseFloat(req.body.price) : existing.price,
      capacityAdults: req.body.capacityAdults !== undefined ? parseInt(req.body.capacityAdults) : existing.capacityAdults,
      capacityChildren: req.body.capacityChildren !== undefined ? parseInt(req.body.capacityChildren) : existing.capacityChildren,
      bedType: req.body.bedType ?? existing.bedType,
      size: req.body.size !== undefined ? parseFloat(req.body.size) : existing.size,
      isAvailable: req.body.isAvailable !== undefined ? (req.body.isAvailable === 'true' || req.body.isAvailable === true) : existing.isAvailable,
      floor: req.body.floor !== undefined ? parseInt(req.body.floor) : existing.floor,
      smokingAllowed: req.body.smokingAllowed !== undefined ? (req.body.smokingAllowed === 'true' || req.body.smokingAllowed === true) : existing.smokingAllowed,
      petFriendly: req.body.petFriendly !== undefined ? (req.body.petFriendly === 'true' || req.body.petFriendly === true) : existing.petFriendly,
      amenities: existing.amenities || [],
      images: existing.images || []
    };

    if (req.body.amenities) {
      try {
        const parsed = JSON.parse(req.body.amenities);
        updates.amenities = Array.isArray(parsed) ? parsed : updates.amenities;
      } catch {
        updates.amenities = String(req.body.amenities).split(',').map(a => a.trim()).filter(Boolean);
      }
    }

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const base = '/uploads/rooms/';
      const newImages = req.files.map(f => base + path.basename(f.path));
      updates.images = [...updates.images, ...newImages];
    }

    await Room.update(updates, { where: { id: req.params.id } });
    const updated = await Room.findByPk(req.params.id);

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete room (Admin only)
// @access  Private/Admin
router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    await Room.destroy({ where: { id: req.params.id } });

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
