'use strict';
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./src/config/db');
const indexRoutes = require('./src/routes/indexRoutes');
const materialRoutes = require('./src/routes/materialRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const app = express();
const PORT = process.env.PORT || 3000;
// ─── Security ───────────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net',
          'https://fonts.googleapis.com',
          'https://cdnjs.cloudflare.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
          'https://cdnjs.cloudflare.com',
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com',
        ],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
      },
    },
  })
);
// ─── View Engine ─────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
// ─── Static Files ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// ─── Session ─────────────────────────────────────────────────────────────────
app.use(
  session({
    store: new pgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'fallback-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
    },
    name: 'weapai.sid',
  })
);
// ─── Global template locals ───────────────────────────────────────────────────
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user?.role === 'admin';
  res.locals.currentPath = req.path;
  next();
});
// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/', indexRoutes);
app.use('/materi', materialRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/chat', chatbotRoutes);
app.use('/admin', adminRoutes);
// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const err = new Error('Halaman tidak ditemukan');
  err.status = 404;
  next(err);
});
// ─── Error Handler ───────────────────────────────────────────────────────────
app.use(errorHandler);
// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Weaponized AI E-Learning Platform`);
  console.log(`   Server running at: http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   LLM Model: ${process.env.LLM_MODEL || 'not configured'}\n`);
});
module.exports = app;
