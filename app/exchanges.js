const express = require('express');
const router = express.Router();
const Exchange = require('./models/exchanges');
const User = require('./models/user');
const Listing = require('./models/listing');

router.post('', async (req,res) =>{
    let senderUrl = req.body.sender;
    let receiverUrl = req.body.receiver;
    let offeredListingUrl = req.body.offeredListing;
    let requestedListingUrl = req.body.requestedListing;

    let senderID = senderUrl.split('/').pop();
    let receiverID = receiverUrl.split('/').pop();
    let offeredListingID = offeredListingUrl.split('/').pop();  
    let requestedListingID = requestedListingUrl.split('/').pop();

    try{
        sender = await User.findById(senderID);
        if(sender == null){
        return res.status(404).json({ error: 'Sender not found' });
        }  
    }catch (error) {
    }  
    
    try{
        receiver = await User.findById(receiverID);
        if(receiver == null){  
        return res.status(404).json({ error: 'Receiver not found' });
        }
    }catch (error) {
    }
    
    try{
        offeredListing = await Listing.findById(offeredListingID);
        if(offeredListing == null){
            return res.status(404).json({ error: 'Offered listing not found' });
        }
    }catch (error) {
    }

    try{
        requestedListing = await Listing.findById(requestedListingID);
        if(requestedListing == null){
            return res.status(404).json({ error: 'Requested listing not found' });
        }
    }catch (error) {
    }

    let exchange = new Exchange({
        sender: sender._id,
        receiver: receiver._id,
        offeredListing: offeredListing._id,
        requestedListing: requestedListing._id
    });

    exchange = await exchange.save();

    let exchangeId = exchange._id;

    res.location("/api/v1/exchanges/" + exchangeId).status(201).json({
        id: exchangeId,
        sender: senderUrl,
        receiver: receiverUrl,
        offeredListing: offeredListingUrl,
        requestedListing: requestedListingUrl
    }).send();
})

router.get(' ', async (req, res) => {
    try {
        exchanges = await Exchange.find({}).populate(exchanges);
        exchanges = exchanges.map(exchange => ({
            id: exchange._id,
            self: '/api/v1/exchanges/' + exchange._id,
            sender:{
                self: '/api/v1/users/' + exchange.senderID,
            },
            receiver:{
                self: '/api/v1/users/' + exchange.receiverID,
            },
            offeredListing: {
                self: '/api/v1/listings/' + exchange.offeredListingId
            },
            requestedListing:{
                self: '/api/v1/listings/' + exchange.requestedListingId  
            }
        }));
        res.status(200).json(exchanges);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/:id', async (req, res) => {
    let exchange = await Exchange.findById(req.params.id).exec()
    if(!exchange) {
        res.status(404).send();
        console.error('Exchange not found');
        return;
    }
    try {
        exchange = {
            id: exchange._id,
            self: '/api/v1/exchanges/' + exchange._id,
            sender: {
                self: '/api/v1/users/' + exchange.senderID,
            },
            receiver: {
                self: '/api/v1/users/' + exchange.receiverID,
            },
            offeredListing: {
                self: '/api/v1/listings/' + exchange.offeredListingId
            },
            requestedListing: {
                self: '/api/v1/listings/' + exchange.requestedListingId  
            }
        };
        res.status(200).json(exchange);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/:id', async (req, res) => {
    let exchange = await Exchange.findById(req.params.id).exec() ;
    if(!exchange) {
        res.status(404).send();
        console.error('Exchange not found');
        return;
    }
    try {
        await Exchange.findByIdAndDelete(exchangeId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;