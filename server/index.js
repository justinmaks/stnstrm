require('dotenv').config(); // Loads variables from ../.env by default if in root
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Basic CORS setup (adjust as needed)
app.use(cors());

// Simple health check or root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

/**
 * GET /api/search
 * Searches for a movie on TMDB by query string.
 */
app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing "query" parameter.' });
  }

  try {
    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    const response = await axios.get(tmdbUrl);

    // Return minimal data: id, title, poster_path
    const results = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
    }));

    res.json(results);
  } catch (error) {
    console.error('TMDB Search Error:', error.message);
    res.status(500).json({ error: 'Failed to search movies on TMDB.' });
  }
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
