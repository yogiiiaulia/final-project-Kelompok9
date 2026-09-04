'use strict';
const express = require('express');
const router = express.Router();
const { requireAdmin, redirectIfAdmin } = require('../middleware/auth');
const { loginRateLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
// ─── AUTH ────────────────────────────────────────────────────
router.get('/login', redirectIfAdmin, authController.showLogin);
router.post('/login', loginRateLimiter, redirectIfAdmin, authController.processLogin);
router.post('/logout', requireAdmin, authController.processLogout);
// ─── DASHBOARD ───────────────────────────────────────────────
router.get('/dashboard', requireAdmin, adminController.showDashboard);
// ─── SECTIONS ────────────────────────────────────────────────
router.get('/sections', requireAdmin, adminController.listSections);
router.post('/sections', requireAdmin, adminController.createSection);
router.get('/sections/:id/edit', requireAdmin, adminController.showEditSection);
router.post('/sections/:id/update', requireAdmin, adminController.updateSection);
router.post('/sections/:id/delete', requireAdmin, adminController.deleteSection);
// ─── CONTENT BLOCKS ──────────────────────────────────────────
router.get('/content', requireAdmin, adminController.listContent);
router.get('/content/new', requireAdmin, adminController.showCreateContent);
router.post('/content', requireAdmin, adminController.createContent);
router.get('/content/:id/edit', requireAdmin, adminController.showEditContent);
router.post('/content/:id/update', requireAdmin, adminController.updateContent);
router.post('/content/:id/delete', requireAdmin, adminController.deleteContent);
// Redirect /admin → /admin/dashboard
router.get('/', (req, res) => res.redirect('/admin/dashboard'));
module.exports = router;