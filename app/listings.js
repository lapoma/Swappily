const express = require('express');
const router = express.Router();
const Listing = require('./models/listing');
const User = require('./models/user');
const mongoose = require('mongoose');
const tokenChecker = require('./authentication/tokenChecker');

// POST listing
router.post('',tokenChecker, async (req, res) => {

    const { title, username, userId, description, status, available, listing_url } = req.body;

    if(!title || typeof title !== 'string' || title.trim() === '' || !checkTitle(title)) {
        res.status(400).json({ error: '"Title" must be a non-empty string between 3 and 50 characters' });
        console.log(error);
        return;
    }
    if(typeof description !== 'string' || !checkDescription(description)){
        res.status(400).json({ error: '"Description" must be a non-empty string between 3 and 2000 characters' });
        return;
    }
    if(!status || !checkStatus(status)){
        res.status(400).json({ error: '"Status" must be selected'});
        return;
    }
    //https://mongoosejs.com/docs/api/model.html#Model.exists()
    if(!userId || !(await User.exists({_id: userId}))) {
        res.status(400).json({ error: '"userId" must be a valid ObjectId' });
        return;
    }
    if(listing_url && (!Array.isArray(listing_url) || listing_url.length > 10 || !listing_url.every(url => typeof url === 'string'))){
        res.status(400).json({ error: '"listing_url" must be an array of max 10 strings' });
        return;
    }

    try {
        const listing = new Listing({
            title,
            username, 
            userId, 
            description,
            status,
            available: typeof available === 'boolean' ? available : true,
            listing_url: listing_url || []
        });

        let savedListing = await listing.save();

        res.location(`/api/v1/listings/${savedListing._id}`);
        res.status(201).json({
             //https://expressjs.com/en/5x/api.html#req.body
            self: `/api/v1/listings/${savedListing._id}`,
            id: savedListing._id,
            title: savedListing.title,
            username: savedListing.username,
            userId: savedListing.userId,
            description: savedListing.description,
            status: savedListing.status,
            available: savedListing.available,
            listing_url: savedListing.listing_url
        });
    } catch (error) {
        console.error('Error saving listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

})

// GET listing da titolo e status
router.get('', async (req, res) => {
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    try{
        const { title, status} = req.query;
        let filter={};
        let listings;
        
        if(title || status){
            if (title) filter.title = title;
            if(status) filter.status = status;

            //https://mongoosejs.com/docs/api/query.html#Query.find
            listings = await Listing.find(filter);
            if (listings.length === 0) {
                return res.status(404).json({ error: 'No listings found with the specified title' });
            }else{
                listings = listings.map( listing =>{
                    return {
                        self: '/api/v1/listings/' + listing._id,
                        id: listing._id,
                        title: listing.title,
                        username: listing.username,
                        userId: listing.userId,
                        description: listing.description,
                        status: listing.status,
                        available: listing.available,
                        listing_url: listing.listing_url
                    };
                })
                res.status(200).json(listings);
            }
        }
    else{
            listings = await Listing.find({});
            listings = listings.map( listing =>{
            return {
                self: '/api/v1/listings/' + listing._id,
                id: listing._id,
                title: listing.title,
                username: listing.username,
                userId: listing.userId,
                description: listing.description,
                status: listing.status,
                available: listing.available,
                listing_url: listing.listing_url
            }
        });
        res.status(200).json(listings); 
        }
        
    }catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// GET listing
router.get('/:id', async (req,res) =>{
    try{
        //https://expressjs.com/en/5x/api.html#req.params
        let listingId = req.params.id;
        //https://mongoosejs.com/docs/api/model.html#Model.findById()
        let listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.status(200).json({
            self: '/api/v1/listings/' + listing._id,
            id: listing._id,
            title: listing.title,
            username: listing.username,
            userId: listing.userId,
            description: listing.description,
            status: listing.status,
            available: listing.available,
            listing_url: listing.listing_url
        });
    }catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    //https://expressjs.com/en/guide/routing.html#route-parameters
})

// DELETE listing
router.delete('/:id',tokenChecker, async(req,res) =>{
    try{
        //https://expressjs.com/en/5x/api.html#req.params
        let listingId = req.params.id;
        let listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        if(req.loggedUser.id !== listing.userId.toString()){
        return res.status(403).json({ error: 'Forbidden' });
        }
        //https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()
        let deletedListing = await Listing.findByIdAndDelete(listingId);
        console.log(deletedListing);
        
        res.status(204).send();
    }catch(error){
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// PUT aggiorna listing
router.put('/:id',tokenChecker, async(req,res) => {
    try{
        let listingId = req.params.id;
        let listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        if(req.loggedUser.id !== listing.userId.toString()){
        return res.status(403).json({ error: 'Forbidden' });
        }

        // Aggiorna il listing
        if(req.body.title){
            if(!req.body.title || typeof req.body.title !== 'string' || req.body.title.trim() === '' || !checkTitle(req.body.title)) {
                res.status(400).json({ error: '"Title" must be a non-empty string between 3 and 50 characters' });
                return;
            }
            listing.title = req.body.title; 
        } 
        if(req.body.description){
            listing.description = req.body.description;
            if(typeof listing.description !== 'string' || !checkDescription(listing.description)){
                res.status(400).json({ error: '"Description" must be a non-empty string between 3 and 2000 characters' });
            return;
            }
        } 
        if(req.body.status){
            if(!req.body.status || !checkStatus(req.body.status)){
                res.status(400).json({ error: '"Status" must be selected'});
                return;
            }
            listing.status = req.body.status;
        } 
        if(typeof req.body.available === 'boolean') {
            listing.available = req.body.available;
        }
        if(req.body.listing_url){
            if(!Array.isArray(req.body.listing_url) || req.body.listing_url.length > 10 || !req.body.listing_url.every(url => typeof url === 'string')) {
                res.status(400).json({ error: '"listing_url" must be an array of max 10 strings' });
                return;
            }
            listing.listing_url = req.body.listing_url;
        }

        //https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
        const savedListing = await Listing.findByIdAndUpdate(listingId, listing, { new: true });
        res.location(`/api/v1/listings/${savedListing._id}`);
        res.status(200).json({
             //https://expressjs.com/en/5x/api.html#req.body
            self: `/api/v1/listings/${savedListing._id}`,
            id: savedListing._id,
            title: savedListing.title,
            username: savedListing.username,
            userId: savedListing.userId,
            description: savedListing.description,
            status: savedListing.status,
            available: savedListing.available,
            listing_url: savedListing.listing_url
        });
    }catch(error){
        console.error('Error updating listing:',error);
        res.status(500).json({error: 'Internal server error'});
    }
})

function checkTitle(title){
    if(title.length < 3 || title.length > 50){
        return false;
    }
    return true;
}

function checkDescription(description){
    if(description.length < 3 || description.length > 2000){
        return false;
    }
    return true;
}

function checkStatus(status){
    if(status === 'As new' || status === 'Good' || status === 'Ok' || status === 'Not Good'){
        return true;
    }
    return false;
}

// GET listing di uno user
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        if(!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: '"userId" must be a valid ObjectId' });
        }

        const listings = await Listing.find({ userId: userId });
        
        if (listings.length === 0) {
            return res.status(404).json({ error: 'No listings found for this user' });
        }

        const formattedListings = listings.map(listing => {
            return {
                self: '/api/v1/listings/' + listing._id,
                id: listing._id,
                title: listing.title,
                username: listing.username,
                userId: listing.userId,
                description: listing.description,
                status: listing.status,
                available: listing.available,
                listing_url: listing.listing_url
            };
        });

        res.status(200).json(formattedListings);
    } catch (error) {
        console.error('Error fetching user listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
