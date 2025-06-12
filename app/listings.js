const express = require('express');
const router = express.Router();
const Listing = require('./models/listing');

router.post('', async (req, res) => {
    let listing = new Listing({
        title: req.body.title,
        username: req.body.username,
        userId: req.body.userId,
        description: req.body.description,
        status: req.body.status,
        available: req.body.available 
    });

    if(!listing.title || typeof listing.title !== 'string' || listing.title.trim() === '') {
        res.status(400).json({ error: '"Title" must be a non-empty string' });
        return;
    }
    try {
        let savedListing = await listing.save();
        res.status(201).json({
            self: '/api/v1/listings/' + savedListing._id,
            id: savedListing._id,
            title: savedListing.title,
            username: savedListing.username,
            userId: savedListing.userId,
            description: savedListing.description,
            status: savedListing.status,
            available: savedListing.available
        });
    } catch (error) {
        console.error('Error saving listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

})