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

    if(!listing.title || typeof listing.title !== 'string' || listing.title.trim() === '' || !checkTitle(listing.title)) {
        res.status(400).json({ error: '"Title" must be a non-empty string between 3 and 30 characters' });
        return;
    }
    if(typeof listing.description !== 'string' || !checkDescription(listing.description)){
        res.status(400).json({ error: '"Description" must be a non-empty string between 3 and 2000 characters' });
        return;
    }
    if(!listing.status){
        res.status(400).json({ error: '"Status" must be selected'});
        return;
    }
    try {
        let savedListing = await listing.save();
        res.status(201).json({
             //https://expressjs.com/en/5x/api.html#req.body
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

router.get('', async (req, res) => {
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    try{
        let listings;
        if(req.query.title){
            //https://mongoosejs.com/docs/api/query.html#Query.find
            listings = await Listing.find({ title:req.query.title, });
            if (listings.length === 0) {
                return res.status(404).json({ error: 'No listings found with the specified title' });
            }else{
                listings = listings.map( listing =>{
                    return {
                        self: '/api/v1/listings/' + listing._id,
                        id: listing._id,
                        username: listing.username,
                        description: listing.description,
                        status: listing.status,
                        available: listing.available
                    };
                })
                res.status(200).json(listings);
            }
        }else{
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

router.delete('/:id', async(req,res) =>{
    try{
        //https://expressjs.com/en/5x/api.html#req.params
        let listingId = req.params.id;
        //https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()
        let deletedListing = await Listing.findByIdAndDelete(listingId);
        if (!deletedListing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.status(204).send();
    }catch(error){
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/:id', async(req,res) => {
    try{
        let listingId = req.params.id;
        let listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Update the listing with the new data
        if(req.body.title){
            if(!listing.title || typeof listing.title !== 'string' || listing.title.trim() === '' || !checkTitle(listing.title)) {
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
        if(req.body.available) listing.available = req.body.available;

        await listing.save();
        res.status(200).json({
            self: 'api/v1/listings'+listing._id,
            title: listing.title,
            id: listing._id,
            username: listing.username,
            description: listing.description,
            status: listing.status,
            available: listing.available
        })
    }catch(error){
        console.error('Error updating listing:',error);
        res.status(500).json({error: 'Internal server error'});
    }
})

function checkTitle(title){
    if(title.length < 3 || title.length > 30){
        return false;
    }else
        return true;
}

function checkDescription(description){
    if(description.length < 3 || description.lenght > 2000){
        return false;
    }
    return true;
}