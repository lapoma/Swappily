const express = require('express');
const router = express.Router();
const Report = require('./models/report');
const User = require('./models/user');
const Listing = require('./models/listing');
const listing = require('./models/listing');

router.post('', async (req, res) => {
    let reporterUrl = req.body.reporter;
    let reporteeUrl = req.body.reportee;
    let listingUrl = req.body.listing;

    let reporterId = reporterUrl.split('/').pop();
    let reporteeId = reporteeUrl.split('/').pop();
    let listingId = listingUrl.split('/').pop();

    try {
        let reporter = await User.findById(reporterId);
        if (!reporter) {
            return res.status(404).json({ error: 'Reporter not found' });
        }
    }catch (error) {
    }
    try {
        let reportee = await User.findById(reporteeId);
        if (!reportee) {
            return res.status(404).json({ error: 'Reportee not found' });
        }
    }catch (error) {
    }
    try {
        let listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
    }catch (error) {
    }

    let report = new Report({
        reporter: reporter._id,
        reportee: reportee._id,
        listing: listing._id,
        text:  req.body.text,
    });

    report = report.save();

    if (!report.text || typeof report.reason !== 'string' || report.reason.trim() === '') {
        res.status(400).json({ error: '"Text" must be a non-empty string' });
        return;
    }

    try {
        let savedReport = await report.save();
        res.status(201).json({
            self: '/api/v1/reports/' + savedReport._id,
            id: savedReport._id,
            reporter: savedReport.reporter,
            listing: savedReport.listing,
            reason: savedReport.reason,
            comment: savedReport.comment
        });
    } catch (error) {
        console.error('Error saving report:', error);
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

        let reports = await Report.find({ reportee: userId });

        if (reports.length === 0) {
            return res.status(404).json({ error: 'No reports found for this user' });
        }

        res.status(200).json(reports.map(report => ({
            self: '/api/v1/reports/' + report._id,
            id: report._id,
            reporter: report.reporter,
            reportee: report.reportee,
            listing: report.listing,
            text: report.text
        })));
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})