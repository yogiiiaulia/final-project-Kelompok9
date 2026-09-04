'use strict';
/**
 * Middleware: Require admin role
 * Redirects non-admin users to admin login
 */
function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/admin/login');
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).render('error', {
      title: 'Akses Ditolak',
      status: 403,
      message: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
    });
  }
  next();
}
/**
 * Middleware: Redirect if already logged in as admin
 */
function redirectIfAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  next();
}
module.exports = { requireAdmin, redirectIfAdmin };