'use strict';
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { validateLogin } = require('../utils/validators');
/**
 * GET /admin/login
 */
async function showLogin(req, res) {
  res.render('admin/login', {
    title: 'Admin Login — WeapAI Platform',
    error: null,
    email: '',
  });
}
/**
 * POST /admin/login
 */
async function processLogin(req, res) {
  const { email, password } = req.body;
  const errors = validateLogin({ email, password });
  if (errors.length > 0) {
    return res.render('admin/login', {
      title: 'Admin Login',
      error: errors[0],
      email: email || '',
    });
  }
  try {
    const result = await pool.query(
      'SELECT id, nama, email, password, role FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    if (result.rows.length === 0) {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Email atau password salah.',
        email: email,
      });
    }
    const user = result.rows[0];
    if (user.role !== 'admin') {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Akun ini tidak memiliki akses admin.',
        email: email,
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Email atau password salah.',
        email: email,
      });
    }
    // Set session
    req.session.user = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
    };
    // Regenerate session ID to prevent fixation
    req.session.regenerate((err) => {
      if (err) {
        req.session.user = {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
        };
      }
      req.session.user = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      };
      res.redirect('/admin/dashboard');
    });
  } catch (err) {
    console.error('[AuthController] Login error:', err);
    next(err);
  }
}
/**
 * POST /admin/logout
 */
async function processLogout(req, res) {
  req.session.destroy((err) => {
    if (err) console.error('[AuthController] Logout error:', err);
    res.clearCookie('weapai.sid');
    res.redirect('/admin/login');
  });
}
module.exports = { showLogin, processLogin, processLogout };
