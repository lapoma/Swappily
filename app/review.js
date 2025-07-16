const express = require('express');
const router = express.Router();
const Review = require('./models/review');
const User = require('./models/user');

// POST /api/v1/reviews
router.post('', async (req, res) => {
  const { reviewer, reviewed, text } = req.body;

  if (!reviewer || !reviewed || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: '"text" must be a non-empty string' });
  }

  if (reviewer === reviewed) {
    return res.status(400).json({ error: 'You cannot review yourself' });
  }
        if (req.body.text.length > 2000) {
            return res.status(400).json({ error: 'Text too long (max 2000 chars)' });
        }

  const review = new Review({
    reviewer,
    reviewed,
    text: text.trim()
  });

  try {
    const saved = await review.save();
    return res.status(201).json({
      self:     `/api/v1/reviews/${saved._id}`,
      id:       saved._id,
      reviewer: saved.reviewer,
      reviewed: saved.reviewed,
      text:     saved.text,
      date:     saved.date.toISOString()
    });
  } catch (err) {
    console.error('Error saving review:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/reviews/:userid
router.get('/:userid', async (req, res) => {
  const userId = req.params.userid;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reviews = await Review.find({ reviewed: userId });
    if (reviews.length === 0) {
      return res.status(404).json({ error: 'No reviews found for this user' });
    }

    return res.status(200).json(
      reviews.map(r => ({
        self:     `/api/v1/reviews/${r._id}`,
        id:       r._id,
        reviewer: r.reviewer,
        reviewed: r.reviewed,
        text:     r.text,
        date:     r.date.toISOString()
      }))
    );
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/reviews/:id
router.delete('/:id', async (req, res) => {
  const reviewId = req.params.id;

  try {
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting review:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
