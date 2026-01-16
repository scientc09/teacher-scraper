const express = require('express');
const fetch   = require('node-fetch');
const app     = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing ?url=');
  try {
    const raw = await fetch(url, { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!raw.ok) throw new Error(raw.statusText);
    const html = await raw.text();
    res.type('text/html').send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Scrape failed');
  }
});

const PORT = process.env.PORT || 3000;
// Health-check / fallback route
app.get('/', (req, res) => {
  res.send('Teacher-scraper server is live. Use /scrape?url=...');
});
app.listen(PORT, () => console.log(`Scraper on ${PORT}`));