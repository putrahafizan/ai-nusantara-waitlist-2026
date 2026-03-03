/**
 * Waitlist Routes
 * Handle email signups for landing page
 */

const express = require('express');
const router = express.Router();
const { addEmail, getEmailStats, checkEmailExists } = require('../services/waitlistService');
const { sendConfirmationEmail } = require('../services/emailService');
const { validateEmail } = require('../utils/validation');

/**
 * POST /api/waitlist
 * Add email to waitlist
 */
router.post('/', async (req, res) => {
  try {
    const { email, name, role, university } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        code: 'EMAIL_REQUIRED'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    // Check if email already exists
    const existing = await checkEmailExists(email);
    if (existing) {
      return res.status(409).json({
        error: 'Email already registered',
        code: 'EMAIL_EXISTS',
        message: 'Terima kasih! Email Anda sudah terdaftar di waitlist kami.'
      });
    }

    // Add email to waitlist
    const result = await addEmail({
      email,
      name: name || null,
      role: role || null,
      university: university || null,
      source: req.body.source || 'landing-page',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });

    // Send confirmation email (async, don't wait)
    sendConfirmationEmail(email, name).catch(err => {
      console.error('Failed to send confirmation email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil bergabung dengan waitlist! Terima kasih.',
      data: {
        email: result.email,
        createdAt: result.created_at
      }
    });

  } catch (error) {
    console.error('Error adding to waitlist:', error);

    res.status(500).json({
      error: 'Failed to add email to waitlist',
      code: 'SERVER_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/waitlist/stats
 * Get waitlist statistics (protected with API key in production)
 */
router.get('/stats', async (req, res) => {
  try {
    // Simple API key check for stats endpoint
    const apiKey = req.headers['x-api-key'];
    if (process.env.NODE_ENV === 'production' && apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'INVALID_API_KEY'
      });
    }

    const stats = await getEmailStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching stats:', error);

    res.status(500).json({
      error: 'Failed to fetch statistics',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;
