const express = require('express');
const router = express.Router();
const dns = require('dns');
const { URL } = require('url');
const Url = require('../models/Url');

// Helper function to validate URL
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

// POST a new URL to create a short URL
router.post('/shorturl', async (req, res) => {
    const { url } = req.body;

    // Validate URL format
    if (!isValidUrl(url)) {
        return res.json({ error: 'invalid url' });
    }

    try {
        // Extract hostname for DNS lookup
        const urlObj = new URL(url);

        // Use DNS lookup to validate the hostname
        dns.lookup(urlObj.hostname, async (err) => {
            if (err) {
                return res.json({ error: 'invalid url' });
            }

            // Check if URL already exists in database
            let urlDoc = await Url.findOne({ original_url: url });

            if (urlDoc) {
                // Return existing record
                return res.json({
                    original_url: urlDoc.original_url,
                    short_url: urlDoc.short_url
                });
            }

            // Get the count of documents to create a sequential short_url
            const count = await Url.countDocuments();
            const short_url = count + 1;

            // Create new URL document
            urlDoc = new Url({
                original_url: url,
                short_url
            });

            await urlDoc.save();

            return res.json({
                original_url: url,
                short_url
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET request to redirect to the original URL
router.get('/shorturl/:short_url', async (req, res) => {
    try {
        const { short_url } = req.params;

        // Validate short_url is a number
        if (isNaN(Number(short_url))) {
            return res.status(400).json({ error: 'Wrong format' });
        }

        // Find the URL document
        const urlDoc = await Url.findOne({ short_url: Number(short_url) });

        if (!urlDoc) {
            return res.status(404).json({ error: 'No short URL found for the given input' });
        }

        // Redirect to the original URL
        return res.redirect(urlDoc.original_url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 