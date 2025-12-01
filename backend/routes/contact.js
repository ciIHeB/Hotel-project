const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

// Configure nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// @route   POST /api/contact
// @desc    Send contact form message
// @access  Public
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('phone').optional().isMobilePhone().withMessage('Please include a valid phone number'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
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

    const { name, email, phone, subject, message } = req.body;

    // Create email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>This message was sent from the hotel website contact form.</small></p>
    `;

    // Auto-reply content
    const autoReplyContent = `
      <h2>Thank you for contacting us!</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you within 24 hours.</p>
      <p><strong>Your message:</strong></p>
      <p><em>${message}</em></p>
      <br>
      <p>Best regards,<br>Hotel Management Team</p>
    `;

    try {
      const transporter = createTransporter();

      // Send email to hotel management
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Contact Form: ${subject}`,
        html: emailContent,
        replyTo: email
      });

      // Send auto-reply to customer
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting us - Hotel',
        html: autoReplyContent
      });

      res.json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Still return success to user, but log the error
      res.json({
        success: true,
        message: 'Your message has been received. We will get back to you soon!'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/contact/newsletter
// @desc    Subscribe to newsletter
// @access  Public
router.post('/newsletter', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty')
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

    const { email, name } = req.body;

    // In a real application, you would save this to a newsletter database
    // For now, we'll just send a confirmation email

    const confirmationContent = `
      <h2>Welcome to our Newsletter!</h2>
      <p>Dear ${name || 'Valued Guest'},</p>
      <p>Thank you for subscribing to our hotel newsletter. You'll receive updates about:</p>
      <ul>
        <li>Special offers and discounts</li>
        <li>New amenities and services</li>
        <li>Local events and attractions</li>
        <li>Seasonal packages</li>
      </ul>
      <p>We promise not to spam you and you can unsubscribe at any time.</p>
      <br>
      <p>Best regards,<br>Hotel Management Team</p>
    `;

    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to our Newsletter - Hotel',
        html: confirmationContent
      });

      res.json({
        success: true,
        message: 'Thank you for subscribing to our newsletter!'
      });
    } catch (emailError) {
      console.error('Newsletter email error:', emailError);
      
      res.json({
        success: true,
        message: 'Thank you for subscribing to our newsletter!'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
