const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Booking, Room, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user's bookings or all bookings (admin)
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled']).withMessage('Invalid status')
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

    // Build filter
    let filter = {};
    
    // If not admin, only show user's bookings
    if (req.user.role !== 'admin') {
      filter.userId = req.user.id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.userId && req.user.role === 'admin') {
      filter.userId = req.query.userId;
    }

    const { rows: bookings, count: total } = await Booking.findAndCountAll({
      where: filter,
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] },
        { model: Room, attributes: ['roomNumber', 'type', 'title', 'price', 'images'] }
      ],
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit
    });

    res.json({
      success: true,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] },
        { model: Room, attributes: ['roomNumber', 'type', 'title', 'price', 'images', 'amenities'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', protect, [
  body('roomType').notEmpty().withMessage('Room type is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
  body('guestsAdults').isInt({ min: 1 }).withMessage('At least 1 adult is required'),
  body('guestsChildren').optional().isInt({ min: 0 }).withMessage('Children count cannot be negative'),
  body('contactPhone').notEmpty().withMessage('Phone number is required'),
  body('contactEmail').isEmail().withMessage('Valid email is required')
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

    const {
      contactEmail,
      contactPhone,
      roomType,
      checkIn,
      checkOut,
      guestsAdults,
      guestsChildren = 0,
      specialRequests,
      status = 'pending'
    } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    // Find the room by type
    const room = await Room.findOne({ where: { type: roomType } });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (!room.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available'
      });
    }

    // Check room capacity
    if (guestsAdults > room.capacityAdults || guestsChildren > room.capacityChildren) {
      return res.status(400).json({
        success: false,
        message: 'Room capacity exceeded'
      });
    }

    // Check if room is already booked for these dates
    const conflictingBooking = await Booking.findOne({
      where: {
        roomId: room.id,
        status: ['confirmed', 'checked-in'],
        checkIn: { [Op.lt]: checkOutDate },
        checkOut: { [Op.gt]: checkInDate }
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for the selected dates'
      });
    }

    // Calculate total amount
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * room.price;

    // Generate a unique bookingId
    const bookingId = 'BK' + Date.now();

    // Create booking
    const booking = await Booking.create({
      bookingId,
      userId: req.user.id,
      roomId: room.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestsAdults,
      guestsChildren,
      totalAmount,
      status,
      paymentStatus: 'pending',
      paymentMethod: 'none',
      contactPhone,
      contactEmail,
      specialRequests,
      nights
    });

    const populatedBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Room, attributes: ['roomNumber', 'type', 'title', 'price', 'images'] },
        { model: User, attributes: ['firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin or booking owner for cancellation)
router.put('/:id/status', protect, [
  body('status').isIn(['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled']).withMessage('Invalid status'),
  body('cancellationReason').optional().isLength({ max: 200 }).withMessage('Cancellation reason cannot exceed 200 characters')
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

    const { status, cancellationReason } = req.body;
    
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    const isOwner = booking.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Only allow cancellation for non-admin users
    if (!isAdmin && status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your booking'
      });
    }

    // Update booking
    const updateData = { status };
    if (status === 'cancelled' && cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }

    await Booking.update(updateData, { where: { id: req.params.id } });
    const updatedBooking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Room, attributes: ['roomNumber', 'type', 'title', 'price'] },
        { model: User, attributes: ['firstName', 'lastName', 'email'] }
      ]
    });

    // Send email notification to user if status changed to confirmed or cancelled
    if (['confirmed', 'cancelled'].includes(status) && updatedBooking.User?.email) {
      const { sendMail } = require('../utils/mailer');
      let subject = '', html = '';
      if (status === 'confirmed') {
        subject = 'Votre réservation a été confirmée';
        html = `<p>Bonjour ${updatedBooking.User.firstName},<br><br>Votre réservation (<b>${updatedBooking.bookingId}</b>) pour la chambre <b>${updatedBooking.Room.title || updatedBooking.Room.type}</b> a été <b>confirmée</b>.<br>Nous avons hâte de vous accueillir !</p>`;
      } else if (status === 'cancelled') {
        subject = 'Votre réservation a été annulée';
        html = `<p>Bonjour ${updatedBooking.User.firstName},<br><br>Nous sommes désolés de vous informer que votre réservation (<b>${updatedBooking.bookingId}</b>) a été <b>annulée</b>.<br>Contactez-nous pour plus d'informations.</p>`;
      }
      sendMail({
        to: updatedBooking.User.email,
        subject,
        html,
        text: html.replace(/<[^>]+>/g, '')
      }).catch(err => console.error('Erreur envoi email réservation:', err));
    }

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/bookings/search/:bookingId
// @desc    Search booking by booking ID
// @access  Public (for guests to check their booking)
router.get('/search/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { bookingId: req.params.bookingId },
      include: [
        { model: Room, attributes: ['roomNumber', 'type', 'title', 'price', 'images', 'amenities'] },
        { model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
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
