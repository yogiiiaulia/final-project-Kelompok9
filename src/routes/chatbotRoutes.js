'use strict';
const express = require('express');
const router = express.Router();
const { showChatPage, handleChat } = require('../controllers/chatbotController');
const { chatRateLimiter } = require('../middleware/rateLimiter');
// Fullpage chat view
router.get('/', showChatPage);
// API endpoint (rate limited)
router.post('/', chatRateLimiter, handleChat);
module.exports = router;