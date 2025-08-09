const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Booking, Room, User } = require('../models');
const { adminProtect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings (admin)
// @access  Private (Admin)
router.get('/', adminProtect, [
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

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.userId) {
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
    console.error('POST /api/bookings failed:', {
      body: req.body,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking (admin)
// @access  Private (Admin)
router.get('/:id', adminProtect, async (req, res) => {
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

    // Admin-only endpoint; access granted via adminProtect

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
// @access  Public (guest bookings allowed)
router.post('/', [
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
      specialRequests
    } = req.body;

    // Normalize date strings to midnight to avoid timezone issues
    const normalizeDate = (d) => {
      const dt = new Date(d);
      // If invalid date
      if (isNaN(dt.getTime())) return null;
      dt.setHours(0, 0, 0, 0);
      return dt;
    };

    const checkInDate = normalizeDate(checkIn);
    const checkOutDate = normalizeDate(checkOut);
    const today = new Date(); today.setHours(0, 0, 0, 0);

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    // Normalize roomType from UI labels (e.g., "Chambre Deluxe") to model ENUM
    const normalizeRoomType = (t) => {
      if (!t) return null;
      const s = String(t).toLowerCase().trim();
      if (['standard', 'chambre standard'].includes(s)) return 'standard';
      if (['deluxe', 'chambre deluxe'].includes(s)) return 'deluxe';
      if (['suite', 'chambre suite'].includes(s)) return 'suite';
      if (['presidential', 'présidentielle', 'presidentielle', 'chambre présidentielle', 'chambre presidentielle'].includes(s)) return 'presidential';
      return null;
    };

    const normalizedType = normalizeRoomType(roomType);
    if (!normalizedType) {
      return res.status(400).json({ success: false, message: 'Invalid room type selected.' });
    }

    // Find the room by type (fallback: create a basic placeholder room if none exist)
    let room = await Room.findOne({ where: { type: normalizedType } });
    if (!room) {
      try {
        room = await Room.create({
          roomNumber: `AUTO-${Date.now()}`,
          type: normalizedType,
          title: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room`,
          description: 'Auto-created placeholder room for booking request.',
          price: 100,
          capacityAdults: 2,
          capacityChildren: 2,
          bedType: 'queen',
          size: 20,
          amenities: [],
          images: [],
          isAvailable: true,
          floor: 1,
          smokingAllowed: false,
          petFriendly: false
        });
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Selected room type is not available.' });
      }
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

    // Check if room is already booked for these dates (only for confirmed/checked-in)
    const conflictingBooking = await Booking.findOne({
      where: {
        roomId: room.id,
        status: { [Op.in]: ['confirmed', 'checked-in'] },
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

    // Calculate total amount (ensure at least 1 night)
    const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
    const totalAmount = nights * room.price;

    // Generate a unique bookingId
    const bookingId = 'BK' + Date.now();

    // Create booking (userId optional for guests)
    const booking = await Booking.create({
      bookingId,
      userId: (req.user && req.user.id) ? req.user.id : null,
      roomId: room.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestsAdults,
      guestsChildren,
      totalAmount,
      status: 'pending',
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
// @access  Private (Admin)
router.put('/:id/status', adminProtect, [
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

    // Admin-only permissions enforced by adminProtect

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

// @route   PATCH /api/bookings/:id
// @desc    Update booking details (Admin only)
// @access  Private/Admin
router.patch('/:id', adminProtect, [
  body('status').optional().isIn(['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled']).withMessage('Invalid status'),
  body('paymentStatus').optional().isIn(['pending', 'paid', 'refunded', 'failed']).withMessage('Invalid payment status'),
  body('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters'),
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

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.paymentStatus !== undefined) updateData.paymentStatus = req.body.paymentStatus;
    if (req.body.specialRequests !== undefined) updateData.specialRequests = req.body.specialRequests;
    if (req.body.cancellationReason !== undefined) updateData.cancellationReason = req.body.cancellationReason;

    await Booking.update(updateData, { where: { id: req.params.id } });
    const updatedBooking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Room, attributes: ['roomNumber', 'type', 'title', 'price'] },
        { model: User, attributes: ['firstName', 'lastName', 'email'] }
      ]
    });

    res.json({
      success: true,
      message: 'Booking updated successfully',
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

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking (admin)
// @access  Private (Admin)
router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await Booking.destroy({ where: { id: req.params.id } });

    res.json({
      success: true,
      message: 'Booking deleted successfully'
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
