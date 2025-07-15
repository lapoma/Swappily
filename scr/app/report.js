const express = require('express');
const router = express.Router();
const Report = require('./models/report');
const User = require('./models/user');
const Listing = require('./models/listing');

//estrae ID dall'URL
function extractIdFromUrl(url) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

// POST /api/v1/reports
router.post('/', async (req, res) => {
  try {
    const { reporter, reportee, listing, text } = req.body;

    if (!reporter || !text || typeof text !== 'string' || text.trim() === '' || text.length > 2000) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const reporterId = extractIdFromUrl(reporter);
    const reporterExists = await User.findById(reporterId);
    if (!reporterExists) return res.status(404).json({ error: 'Reporter not found' });

    const hasReportee = !!reportee;
    const hasListing = !!listing;

    if (hasReportee && hasListing) {
      return res.status(400).json({ error: 'Cannot report both a user and a listing' });
    }

    const reportData = {
      reporterId,
      text: text.trim()
    };

    // Caso 1: segnalazione contro un utente
    if (hasReportee) {
      const reporteeId = extractIdFromUrl(reportee);
      const reporteeExists = await User.findById(reporteeId);
      if (!reporteeExists) return res.status(404).json({ error: 'Reportee not found' });
      reportData.reporteeId = reporteeId;
    }

    // Caso 2: segnalazione contro un listing
    if (hasListing) {
      const listingId = extractIdFromUrl(listing);
      const listingExists = await Listing.findById(listingId);
      if (!listingExists) return res.status(404).json({ error: 'Listing not found' });
      reportData.listingId = listingId;
    }

    // Caso 3: segnalazione generica
    if (!hasReportee && !hasListing) {
      // Nessun ulteriore controllo necessario
    }

    const report = new Report(reportData);
    const saved = await report.save();

    res.status(201).json({
      id: saved._id,
      reporter: saved.reporterId,
      reportee: saved.reporteeId ?? null,
      listing: saved.listingId ?? null,
      text: saved.text
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/v1/reports/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const reports = await Report.find({ reporteeId: userId });
    if (!reports || reports.length === 0) return res.status(404).json({ error: 'No reports found' });

    const formatted = reports.map(r => ({
      id: r._id,
      reporter: r.reporterId,
      reportee: r.reporteeId ?? null,
      listing: r.listingId ?? null,
      text: r.text
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/v1/reports/:id
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;