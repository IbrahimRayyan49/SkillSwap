const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getMyProfile,
  updateSkills,
  getUserById,
  getMatchSuggestions
} = require('../controllers/userController');

router.get('/me', protect, getMyProfile);
router.put('/me/skills', protect, updateSkills);
router.get('/matches/suggestions', protect, getMatchSuggestions);
router.get('/:id', protect, getUserById);

module.exports = router;