const User = require('../models/User');

// GET /api/users/me
const getMyProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/me/skills
const updateSkills = async (req, res) => {
  try {
    const { skillsToTeach, skillsToLearn } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skillsToTeach, skillsToLearn },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/matches/suggestions
const getMatchSuggestions = async (req, res) => {
  try {
    const me = req.user;

    const suggestions = await User.find({
      _id: { $ne: me._id },
      skillsToTeach: { $in: me.skillsToLearn },
      skillsToLearn: { $in: me.skillsToTeach },
    }).select('-password');

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyProfile, updateSkills, getUserById, getMatchSuggestions };