// src/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSelectMovie = (id) => {
    // Navigate to /movie/:id
    navigate(`/movie/${id}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Movie Streamer</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 300, marginRight: 8 }}
        />
        <button type="submit">Search</button>
      </form>

      {/* Display search results */}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem', gap: '1rem' }}>
        {movies.map((movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image';

          return (
            <div
              key={movie.id}
              style={{ width: 150, textAlign: 'center', cursor: 'pointer' }}
              onClick={() => handleSelectMovie(movie.id)}
            >
              <img
                src={posterUrl}
                alt={movie.title}
                style={{ width: '100%', borderRadius: 6 }}
              />
              <p>{movie.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
