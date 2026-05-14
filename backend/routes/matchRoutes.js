const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  sendMatchRequest,
  getMyMatches,
  respondToMatch
} = require('../controllers/matchController');

router.post('/request', protect, sendMatchRequest);
router.get('/', protect, getMyMatches);
router.put('/:id/respond', protect, respondToMatch);

module.exports = router;