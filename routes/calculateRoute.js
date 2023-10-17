const express = require('express');

//controllers
const calculateController = require('../controllers/calculateController');

//start mini app
const router = express.Router();

//PUBLIC ROUTES
router.post(
  '/calculate',
  calculateController.computeSolutionName,
  calculateController.calculate
);

//export mini app
module.exports = router;
