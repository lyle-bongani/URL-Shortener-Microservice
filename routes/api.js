const express = require('express');
const router = express.Router();
const dns = require('dns');
const { URL } = require('url');
const Url = require('../models/Url');

// Helper function to validate URL
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        // Make sure the URL has a protocol and hostname
        return (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && urlObj.hostname;
    } catch (err) {
        return false;
    }
}

// Helper function to perform DNS lookup with a Promise
function dnsLookupPromise(hostname) {
    return new Promise((resolve, reject) => {
        dns.lookup(hostname, (err, address) => {
            if (err) reject(err);
            else resolve(address);
        });
    });
}

// POST a new URL to create a short URL
router.post('/shorturl', async (req, res) => {
    let { url } = req.body;

    // Validate URL format
    if (!isValidUrl(url)) {
        return res.json({ error: 'invalid url' });
    }

    try {
        // Extract hostname for DNS lookup
        const urlObj = new URL(url);

        try {
            // Verify the hostname exists with DNS lookup
            await dnsLookupPromise(urlObj.hostname);

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
        } catch (dnsErr) {
            // DNS lookup failed - hostname doesn't exist
            return res.json({ error: 'invalid url' });
        }
    } catch (err) {
        console.error(err);
        return res.json({ error: 'Server error' });
    }
});

// GET request to redirect to the original URL
router.get('/shorturl/:short_url', async (req, res) => {
    try {
        const short_url = parseInt(req.params.short_url);

        // Validate short_url is a number
        if (isNaN(short_url)) {
            return res.json({ error: 'invalid url' });
        }

        // Find the URL document
        const urlDoc = await Url.findOne({ short_url });

        if (!urlDoc) {
            return res.json({ error: 'invalid url' });
        }

        // Redirect to the original URL
        return res.redirect(urlDoc.original_url);
    } catch (err) {
        console.error(err);
        return res.json({ error: 'invalid url' });
    }
});

module.exports = router; 