const express = require('express');
const router = express.Router();
const Exchange = require('./models/exchange');
const User = require('./models/user');
const Listing = require('./models/listing');
const jwt = require('jsonwebtoken');
const tokenChecker = require('./tokenChecker');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['token'] || req.query.token;

    
    if (!authHeader) {
        return res.status(403).json({ error: 'Token mancante' });
    }

    jwt.verify(authHeader, process.env.SUPER_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Token non valido' });
        }
        req.userId = user.id;
        next();
    });
};


// POST /exchange/listing/{listingId}
router.post('/listing/:listingId',authenticateJWT, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { offeredListing, receiver } = req.body;

        if (!offeredListing || !receiver) {
            return res.status(400).json({ error: 'Campi obbligatori mancanti' });
        }

        const [requestedListing, offeredListingDoc, receiverUser] = await Promise.all([
            Listing.findById(listingId),
            Listing.findById(offeredListing),
            User.findById(receiver)
        ]);

        if (!requestedListing || !offeredListingDoc || !receiverUser) {
            return res.status(404).json({ error: 'Listing o utente non trovato' });
        }

        if (offeredListingDoc.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Non sei il proprietario del listing offerto' });
        }

        const exchange = new Exchange({
            sender: req.userId,
            receiver: receiver,
            offeredListing: offeredListing,
            requestedListing: listingId,
            status: 'Pending',
            date: new Date()
        });

        await exchange.save();

        res.location(`/api/v1/exchanges/${exchange._id}`).status(201).json({
            exchangeId: exchange._id,
            sender: `/api/v1/users/${exchange.sender}`,
            receiver: `/api/v1/users/${exchange.receiver}`,
            offeredListing: `/api/v1/listings/${exchange.offeredListing}`,
            requestedListing: `/api/v1/listings/${exchange.requestedListing}`,
            status: exchange.status,
            date: exchange.date.toISOString(),
            self: `/api/v1/exchanges/${exchange._id}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

// GET /exchange?status={status}
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        
        const exchanges = await Exchange.find(query)
            .populate('sender', 'username')
            .populate('receiver', 'username')
            .populate('offeredListing', 'title')
            .populate('requestedListing', 'title');

        if (exchanges.length === 0) {
            return res.status(404).json({ error: 'Nessuno scambio trovato' });
        }

        const formattedExchanges = exchanges.map(exchange => ({
            exchangeId: exchange._id,
            sender: {
                userId: exchange.sender._id,
                username: exchange.sender.username,
                self: `/api/v1/users/${exchange.sender._id}`
            },
            receiver: {
                userId: exchange.receiver._id,
                username: exchange.receiver.username,
                self: `/api/v1/users/${exchange.receiver._id}`
            },
            offeredListing: {
                listingId: exchange.offeredListing._id,
                title: exchange.offeredListing.title,
                self: `/api/v1/listings/${exchange.offeredListing._id}`
            },
            requestedListing: {
                listingId: exchange.requestedListing._id,
                title: exchange.requestedListing.title,
                self: `/api/v1/listings/${exchange.requestedListing._id}`
            },
            status: exchange.status,
            date: exchange.date.toISOString(),
            self: `/api/v1/exchanges/${exchange._id}`
        }));

        res.status(200).json(formattedExchanges);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

// GET /exchange/{exchangeId}
router.get('/:exchangeId', async (req, res) => {
    try {
        const exchange = await Exchange.findById(req.params.exchangeId)
            .populate('sender', 'username')
            .populate('receiver', 'username')
            .populate('offeredListing', 'title')
            .populate('requestedListing', 'title');

        if (!exchange) {
            return res.status(404).json({ error: 'Scambio non trovato' });
        }

        const formattedExchange = {
            exchangeId: exchange._id,
            sender: {
                userId: exchange.sender._id,
                username: exchange.sender.username,
                self: `/api/v1/users/${exchange.sender._id}`
            },
            receiver: {
                userId: exchange.receiver._id,
                username: exchange.receiver.username,
                self: `/api/v1/users/${exchange.receiver._id}`
            },
            offeredListing: {
                listingId: exchange.offeredListing._id,
                title: exchange.offeredListing.title,
                self: `/api/v1/listings/${exchange.offeredListing._id}`
            },
            requestedListing: {
                listingId: exchange.requestedListing._id,
                title: exchange.requestedListing.title,
                self: `/api/v1/listings/${exchange.requestedListing._id}`
            },
            status: exchange.status,
            date: exchange.date.toISOString(),
            self: `/api/v1/exchanges/${exchange._id}`
        };

        res.status(200).json(formattedExchange);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

// PUT /exchange/{exchangeId}
router.put('/:exchangeId', async (req, res) => {
    try {
        const { status } = req.body;
        const { exchangeId } = req.params;

        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Stato non valido' });
        }

        const exchange = await Exchange.findById(exchangeId);
        if (!exchange) {
            return res.status(404).json({ error: 'Scambio non trovato' });
        }

        if (exchange.receiver.toString() !== req.userId) {
            return res.status(403).json({ error: 'Non autorizzato' });
        }

        exchange.status = status;
        await exchange.save();

        res.status(200).json({
            exchangeId: exchange._id,
            status: exchange.status,
            self: `/api/v1/exchanges/${exchange._id}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

// DELETE /exchange/{exchangeId}
router.delete('/:exchangeId', async (req, res) => {
    try {
        const exchange = await Exchange.findById(req.params.exchangeId);
        if (!exchange) {
            return res.status(404).json({ error: 'Scambio non trovato' });
        }

        if (exchange.sender.toString() !== req.userId && exchange.receiver.toString() !== req.userId) {
            return res.status(403).json({ error: 'Non autorizzato' });
        }

        await Exchange.findByIdAndDelete(req.params.exchangeId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

module.exports = router;