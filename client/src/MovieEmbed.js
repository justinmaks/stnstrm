// src/MovieEmbed.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieEmbed() {
  const { id } = useParams();         // :id from the route /movie/:id
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // On load (or when id changes), fetch movie details
    async function fetchMovieDetails() {
      try {
        // Call your new backend endpoint
        const response = await fetch(`http://localhost:3001/api/movie/${id}`);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    }

    fetchMovieDetails();
  }, [id]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Movie Details</h2>

      {/* If details are loaded, display relevant info */}
      {details && (
        <div style={{ marginBottom: '1rem' }}>
          <h3>{details.title}</h3>
          <p><strong>Release Date:</strong> {details.release_date}</p>
          <p><strong>Overview:</strong> {details.overview}</p>
          {/* You can add more fields like runtime, genres, etc. */}
        </div>
      )}

      {/* The embedded player */}
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
          src={`https://embed.su/embed/movie/${id}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default MovieEmbed;
