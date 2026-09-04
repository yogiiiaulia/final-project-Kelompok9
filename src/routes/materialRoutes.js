'use strict';
const express = require('express');
const router = express.Router();
const { showMaterialIndex, showSection } = require('../controllers/materialController');
router.get('/', showMaterialIndex);
router.get('/:id', showSection);
module.exports = router;
