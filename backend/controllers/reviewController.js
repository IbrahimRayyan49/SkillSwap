const Review = require('../models/Reviews');
const Match = require('../models/Match');
const User = require('../models/User');

const createReview = async (req, res) => {
  try {
    const { reviewedId, rating, comment } = req.body;

    const acceptedMatch = await Match.findOne({
      $or: [
        { sender: req.user._id, receiver: reviewedId },
        { sender: reviewedId, receiver: req.user._id }
      ],
      status: 'accepted'
    });

    if (!acceptedMatch) {
      return res.status(400).json({ 
        message: 'You can only review someone you have completed a match with' 
      });
    }

    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      reviewed: reviewedId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this person' 
      });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewed: reviewedId,
      rating,
      comment
    });

    const allReviews = await Review.find({ reviewed: reviewedId });

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await User.findByIdAndUpdate(reviewedId, {
      rating: averageRating,
      reviewCount: allReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewed: req.params.id })
      .populate('reviewer', 'name');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getUserReviews };