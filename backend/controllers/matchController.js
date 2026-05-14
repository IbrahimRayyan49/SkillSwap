const Match = require('../models/Match');

const sendMatchRequest = async (req, res) => {
  try {
    const { receiver, skillOfferedBySender, skillOfferedByReceiver } = req.body;

    const existing = await Match.findOne({
      sender: req.user._id,
      receiver: receiver,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const match = await Match.create({
      sender: req.user._id,
      receiver: receiver,
      skillOfferedBySender,
      skillOfferedByReceiver
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .populate('sender', 'name email skillsToTeach')
    .populate('receiver', 'name email skillsToTeach');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToMatch = async (req, res) => {
  try {
    const { status } = req.body;

    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (match.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    match.status = status;
    await match.save();

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMatchRequest, getMyMatches, respondToMatch };