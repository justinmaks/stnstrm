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
    <div className="container">
      <h1>Movie Streamer</h1>

      {/* Search Form */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {/* Display search results */}
      <div className="movie-grid">
        {movies.map((movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image';

          return (
            <div
              key={movie.id}
              className="movie-item"
              onClick={() => handleSelectMovie(movie.id)}
            >
              <img src={posterUrl} alt={movie.title} />
              <p>{movie.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
