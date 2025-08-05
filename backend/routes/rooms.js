const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Room, Booking } = require('../models');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

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

    // Build filter object
    const filter = { isAvailable: true };
    
    if (req.query.type) filter.type = req.query.type;
    if (req.query.bedType) filter.bedType = req.query.bedType;
    if (req.query.smokingAllowed !== undefined) filter.smokingAllowed = req.query.smokingAllowed === 'true';
    if (req.query.petFriendly !== undefined) filter.petFriendly = req.query.petFriendly === 'true';
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.adults || req.query.children) {
      if (req.query.adults) filter['capacity.adults'] = { $gte: parseInt(req.query.adults) };
      if (req.query.children) filter['capacity.children'] = { $gte: parseInt(req.query.children) };
    }

    if (req.query.amenities) {
      const amenities = req.query.amenities.split(',');
      filter.amenities = { $in: amenities };
    }

    // Sort options
    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort = { price: 1 }; // Default sort by price ascending
    }

    const { rows: rooms, count: total } = await Room.findAndCountAll({
      where: filter,
      order: [Object.entries(sort)[0] || ['price', 'ASC']],
      offset: skip,
      limit: limit
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

// @route   GET /api/rooms/:id
// @desc    Get single room
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

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
router.post('/', protect, authorize('admin'), [
  body('roomNumber').notEmpty().withMessage('Room number is required'),
  body('type').isIn(['standard', 'deluxe', 'suite', 'presidential']).withMessage('Invalid room type'),
  body('title').notEmpty().withMessage('Room title is required'),
  body('description').notEmpty().withMessage('Room description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacity.adults').isInt({ min: 1 }).withMessage('Adult capacity must be at least 1'),
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

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    if (error.code === 11000) {
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
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Room.update(req.body, { where: { id: req.params.id } });
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      message: 'Room updated successfully',
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

// @route   DELETE /api/rooms/:id
// @desc    Delete room (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

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
