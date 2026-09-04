'use strict';
const express = require('express');
const router = express.Router();
const { showHome } = require('../controllers/materialController');
router.get('/', showHome);
module.exports = router;
