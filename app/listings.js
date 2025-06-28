const express = require('express');
const router = express.Router();
const Listing = require('./models/listing');
const User = require('./models/user');
const tokenChecker = require('./authentication/tokenChecker');

router.post('', tokenChecker, async (req, res) => {

    const { id, title, username, userId, description, status, available } = req.body;

    if(!title || typeof title !== 'string' || title.trim() === '' || !checkTitle(title)) {
        res.status(400).json({ error: '"Title" must be a non-empty string between 3 and 30 characters' });
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
    if(!userId || !User.exists(userId)) {
        res.status(400).json({ error: '"userId" must be a valid ObjectId' });
        return;
    }
    try {
        //const hashedPassword = await bcrypt.hash(req.body.password, 10); // Assuming password is part of the request body
        const listing = new Listing({
            title,
            username, // Assuming req.user is set by authentication middleware
            userId, // Assuming req.user._id is the user's ID
            description,
            status,
            available: available || true // Default to true if not provided
        });

        let savedListing = await listing.save();

        res.location('/api/v1/listings/${savedListing._id}');
        res.status(201).json({
             //https://expressjs.com/en/5x/api.html#req.body
            self: '/api/v1/listings/${savedListing._id}',
            id: savedListing.id,
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
                        available: listing.available
                    };
                })
                res.status(200).json(listings);
            }
        }
    else{
            listings = await Listing.find({});
            listings = listings.map( listing =>{
            return {
                self: '/api/v1/listings' + listing._id,
                id: listing._id,
                username: listing.username,
                description: listing.description,
                status: listing.status,
                available: listing.available
            }
        });
        res.status(200).json(listings); 
        }
        
    }catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/:userId/favorites', async (req, res) => {
    try {
        let userId = req.params.userId;
        //https://mongoosejs.com/docs/api/model.html#Model.findById()
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        //https://mongoosejs.com/docs/api/model.html#Model.find()
        //https://www.mongodb.com/docs/manual/reference/operator/query/in/
        let listings = await Listing.find({ _id: { $in: user.favorite } });
        if (listings.length === 0) {
            return res.status(404).json({ error: 'No favorite listings found for this user' });
        }
        listings = listings.map( listing =>{
            return {
                self: '/api/v1/listings/' + listing._id,
                id: listing._id,
                title: listing.title,
                username: listing.username,
                userId: listing.userId,
                description: listing.description,
                status: listing.status,
                available: listing.available
            };
        })
        res.status(200).json(listings);
    } catch (error) {
        console.error('Error fetching favorite listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/:userId/following', async (req, res) => {
    try {
        const userId = req.params.userId;
        //https://mongoosejs.com/docs/api/model.html#Model.findById()
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        //https://mongoosejs.com/docs/api/model.html#Model.find()
        const listings = await Listing.find({ userId: { $in: user.following } });
        if (listings.length === 0) {
            return res.status(404).json({ error: 'No following listings found for this user' });
        }
        listings = listings.map( listing =>{
            return {
                self: '/api/v1/listings/' + listing._id,
                id: listing._id,
                title: listing.title,
                username: listing.username,
                userId: listing.userId,
                description: listing.description,
                status: listing.status,
                available: listing.available
            };
        })
        res.status(200).json(listings);
    } catch (error) {
        console.error('Error fetching following listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

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
            available: listing.available
        });
    }catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    //https://expressjs.com/en/guide/routing.html#route-parameters
})

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

        // Update the listing with the new data
        if(req.body.title){
            if(!req.body.title || typeof req.body.title !== 'string' || req.body.title.trim() === '' || !checkTitle(req.body.title)) {
                res.status(400).json({ error: '"Title" must be a non-empty string between 3 and 30 characters' });
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
            if(!listing.status){
                res.status(400).json({ error: '"Status" must be selected'});
                return;
            }
            listing.status = req.body.status;
        } 
        if(req.body.available) {
            listing.available = req.body.available;
        }

        //https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
        const savedListing = await Listing.findByIdAndUpdate(listingId, listing, { new: true });
        res.location('/api/v1/listings/${savedListing._id}');
        res.status(200).json({
             //https://expressjs.com/en/5x/api.html#req.body
            self: '/api/v1/listings/${savedListing._id}',
            id: savedListing.id,
            title: savedListing.title,
            username: savedListing.username,
            userId: savedListing.userId,
            description: savedListing.description,
            status: savedListing.status,
            available: savedListing.available
        });
    }catch(error){
        console.error('Error updating listing:',error);
        res.status(500).json({error: 'Internal server error'});
    }
})

function checkTitle(title){
    if(title.length < 3 || title.length > 30){
        return false;
    }
    return true;
}

function checkDescription(description){
    if(description.length < 3 || description.lenght > 2000){
        return false;
    }
    return true;
}

function checkStatus(status){
    if(status === 'Very good' || status === 'Good' || status === 'Ok' || status === 'Not Good'){
        return true;
    }
    return false;
}

module.exports = router;