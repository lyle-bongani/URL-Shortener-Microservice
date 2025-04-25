const express = require('express');
const router = express.Router();
const dns = require('dns');
const { URL } = require('url');

// In-memory storage for URLs
const urls = [];

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
    try {
        const { url } = req.body;
        console.log('Received URL:', url);

        // Validate URL format
        if (!isValidUrl(url)) {
            console.log('Invalid URL format');
            return res.json({ error: 'invalid url' });
        }

        // Extract hostname for DNS lookup
        const urlObj = new URL(url);

        // Use DNS lookup to validate hostname
        dns.lookup(urlObj.hostname, (err, address) => {
            if (err) {
                console.log('DNS Lookup Error:', err.message);
                return res.json({ error: 'invalid url' });
            }

            // Check if URL already exists in our array
            const existingUrl = urls.find(entry => entry.original_url === url);

            if (existingUrl) {
                console.log('URL already exists:', existingUrl);
                return res.json({
                    original_url: existingUrl.original_url,
                    short_url: existingUrl.short_url
                });
            }

            // Create new short URL
            const short_url = urls.length + 1;

            // Save to our array
            urls.push({
                original_url: url,
                short_url
            });

            console.log('New URL added:', url, 'with short_url:', short_url);
            return res.json({
                original_url: url,
                short_url
            });
        });
    } catch (err) {
        console.error('Server Error:', err.message);
        return res.json({ error: 'invalid url' });
    }
});

// GET request to redirect to the original URL
router.get('/shorturl/:short_url', (req, res) => {
    try {
        const short_url = parseInt(req.params.short_url);
        console.log('Redirect request for short_url:', short_url);

        // Validate short_url is a number
        if (isNaN(short_url)) {
            console.log('Invalid short_url format (not a number)');
            return res.json({ error: 'invalid url' });
        }

        // Find the URL in our array
        const urlEntry = urls.find(entry => entry.short_url === short_url);

        if (!urlEntry) {
            console.log('Short URL not found in database');
            return res.json({ error: 'invalid url' });
        }

        console.log('Redirecting to:', urlEntry.original_url);
        // Redirect to the original URL
        return res.redirect(urlEntry.original_url);
    } catch (err) {
        console.error('Redirect Error:', err.message);
        return res.json({ error: 'invalid url' });
    }
});

module.exports = router; 