const express = require('express');
const router = express.Router();
const Review = require('./models/review');
const User = require('./models/user');

router.post('', async (req, res) => {
    let review = new Review({
        reviewer: req.body.reviewer,
        reviewed: req.body.reviewed,
        text: req.body.text
    });

    if (!review.text || typeof review.text !== 'string' || review.comment.trim() === '') {
        res.status(400).json({ error: '"Comment" must be a non-empty string' });
        return;
    }

    try {
        let savedReview = await review.save();
        res.status(201).json({
            self: '/api/v1/reviews/' + savedReview._id,
            id: savedReview._id,
            reviewer: savedReview.reviewer,
            reviewed: savedReview.reviewed,
            rating: savedReview.rating,
            comment: savedReview.comment
        });
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/:userid', async (req, res) => {
    let userId = req.params.userid;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let reviews = await Review.find({ reviewed: userId });

        if (reviews.length === 0) {
            return res.status(404).json({ error: 'No reviews found for this user' });
        }

        res.status(200).json(reviews.map(review => ({
            self: '/api/v1/reviews/' + review._id,
            id: review._id,
            reviewer: review.reviewer,
            reviewed: review.reviewed,
            rating: review.rating,
            comment: review.comment
        })));
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/:id', async (req, res) => {
    let reviewId = req.params.id;

    try {
        let review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error finding review:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;