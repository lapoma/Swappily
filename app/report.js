
const express = require('express');
const router = express.Router();
const Report = require('./models/report');
const User = require('./models/user');
const Listing = require('./models/listing');

router.post('/', async (req, res) => {
    try {
        // Estrai gli ID dagli URL, ad es. "reporter": "/api/v1/users/user123"
        // estrae la parte finale dopo l’ultimo /
        const reporterId = req.body.reporter?.split('/').pop();
        const reporteeId = req.body.reportee?.split('/').pop();
        const listingId = req.body.listing?.split('/').pop();

        // Verifica campi obbligatori
        if (!reporterId || !reporteeId || !listingId || !req.body.text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verifica testo non vuoto
        if (typeof req.body.text !== 'string' || req.body.text.trim() === '') {
            return res.status(400).json({ error: 'Text must be a non-empty string' });
        }

        // Verifica esistenza delle entità, se uno non viene trovato errore 404
        const [reporter, reportee, listing] = await Promise.all([
            User.findById(reporterId),
            User.findById(reporteeId),
            Listing.findById(listingId)
        ]);
         // Verifica lunghezza testo
        if (req.body.text.length > 2000) {
            return res.status(400).json({ error: 'Text too long (max 2000 chars)' });
        }

        if (!reporter) return res.status(404).json({ error: 'Reporter not found' });
        if (!reportee) return res.status(404).json({ error: 'Reportee not found' });
        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        // Crea e salva il report
        const report = new Report({
            reporterId,
            reporteeId,
            listingId,
            text: req.body.text
        });

        const savedReport = await report.save();
        
        return res.status(201).json({
            self: `/api/v1/reports/${savedReport._id}`,
            id: savedReport._id,
            reporter: reporterId,
            listing: listingId,
            text: savedReport.text
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:userid', async (req, res) => {
    try {
        const user = await User.findById(req.params.userid);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const reports = await Report.find({ reporteeId: req.params.userid });
        if (reports.length === 0) return res.status(404).json({ error: 'No reports found' });

        return res.status(200).json(reports.map(report => ({
            self: `/api/v1/reports/${report._id}`,
            id: report._id,
            reporter: report.reporterId,
            reportee: report.reporteeId,
            listing: report.listingId,
            text: report.text
        })));
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ error: 'Report not found' });
        return res.status(204).end();
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;