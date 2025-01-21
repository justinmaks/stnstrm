import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSelectedMovieId(null);
    try {
      // Assume server is reachable at http://localhost:3001 OR via Docker Compose
      const response = await fetch(`http://localhost:3001/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      console.log('Received data:', data);
      setMovies(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSelectMovie = (id) => {
    setSelectedMovieId(id);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Movie Streamer</h1>
      {/* Search bar */}
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

      {/* Embed player if a movie is selected */}
      {selectedMovieId && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Movie Player</h2>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 800,
              aspectRatio: '16/9',
            }}
          >
            <iframe
              title="Movie Player"
              src={`https://embed.su/embed/movie/${selectedMovieId}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
