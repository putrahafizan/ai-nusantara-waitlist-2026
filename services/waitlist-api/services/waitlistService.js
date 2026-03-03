/**
 * Waitlist Service
 * Handle data storage for waitlist emails
 */

require('dotenv').config();

// Try to initialize Supabase if available
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    console.log('✅ Supabase client initialized');
  } catch (error) {
    console.error('⚠️  Failed to initialize Supabase:', error.message);
  }
}

// Fallback to local file storage
const fs = require('fs').promises;
const path = require('path');

const LOCAL_FILE_PATH = path.join(__dirname, '../../data/waitlist.json');

/**
 * Ensure local data directory and file exist
 */
async function ensureLocalFile() {
  try {
    const dir = path.dirname(LOCAL_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });

    try {
      await fs.access(LOCAL_FILE_PATH);
    } catch {
      // File doesn't exist, create it with empty array
      await fs.writeFile(LOCAL_FILE_PATH, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error ensuring local file:', error);
    throw error;
  }
}

/**
 * Read from local file
 */
async function readLocalFile() {
  await ensureLocalFile();
  const content = await fs.readFile(LOCAL_FILE_PATH, 'utf-8');
  return JSON.parse(content);
}

/**
 * Write to local file
 */
async function writeLocalFile(data) {
  await ensureLocalFile();
  await fs.writeFile(LOCAL_FILE_PATH, JSON.stringify(data, null, 2));
}

/**
 * Add email to waitlist
 * @param {Object} data - Email data
 * @returns {Object} Created record
 */
async function addEmail(data) {
  const emailData = {
    email: data.email.toLowerCase(),
    name: data.name || null,
    role: data.role || null,
    university: data.university || null,
    source: data.source || 'landing-page',
    ip_address: data.ipAddress || null,
    user_agent: data.userAgent || null,
    created_at: new Date().toISOString()
  };

  // Try Supabase first
  if (supabase) {
    try {
      const { data: result, error } = await supabase
        .from('waitlist')
        .insert([emailData])
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Email added to Supabase:', emailData.email);
      return result;
    } catch (error) {
      console.error('⚠️  Supabase error, falling back to local storage:', error.message);
      // Fall through to local storage
    }
  }

  // Fallback to local file storage
  try {
    const waitlist = await readLocalFile();

    // Check for duplicates
    const exists = waitlist.some(item => item.email === emailData.email);
    if (exists) {
      throw new Error('Email already exists');
    }

    waitlist.push(emailData);
    await writeLocalFile(waitlist);

    console.log('✅ Email added to local storage:', emailData.email);
    return emailData;
  } catch (error) {
    console.error('Error adding email to local storage:', error);
    throw error;
  }
}

/**
 * Check if email exists
 * @param {string} email - Email to check
 * @returns {boolean} True if email exists
 */
async function checkEmailExists(email) {
  const normalizedEmail = email.toLowerCase();

  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', normalizedEmail)
        .single();

      if (data && data.email) return true;
      if (error && error.code !== 'PGRST116') throw error; // Ignore not found errors
    } catch (error) {
      console.error('Supabase check error:', error.message);
      // Fall through to local storage
    }
  }

  // Fallback to local file
  try {
    const waitlist = await readLocalFile();
    return waitlist.some(item => item.email === normalizedEmail);
  } catch (error) {
    console.error('Error checking email in local storage:', error);
    return false;
  }
}

/**
 * Get waitlist statistics
 * @returns {Object} Statistics
 */
async function getEmailStats() {
  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*');

      if (error) throw error;

      return calculateStats(data);
    } catch (error) {
      console.error('Supabase stats error:', error.message);
      // Fall through to local storage
    }
  }

  // Fallback to local file
  try {
    const waitlist = await readLocalFile();
    return calculateStats(waitlist);
  } catch (error) {
    console.error('Error getting stats from local storage:', error);
    return {
      total: 0,
      byRole: {},
      bySource: {},
      latestSignups: []
    };
  }
}

/**
 * Calculate statistics from waitlist data
 */
function calculateStats(data) {
  const byRole = {};
  const bySource = {};

  data.forEach(item => {
    // Count by role
    if (item.role) {
      byRole[item.role] = (byRole[item.role] || 0) + 1;
    }

    // Count by source
    if (item.source) {
      bySource[item.source] = (bySource[item.source] || 0) + 1;
    }
  });

  // Get latest 10 signups
  const latestSignups = data
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10)
    .map(item => ({
      email: item.email,
      role: item.role,
      created_at: item.created_at
    }));

  return {
    total: data.length,
    byRole,
    bySource,
    latestSignups
  };
}

module.exports = {
  addEmail,
  checkEmailExists,
  getEmailStats
};
