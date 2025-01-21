// src/MovieEmbed.js
import React from 'react';
import { useParams } from 'react-router-dom';

function MovieEmbed() {
  const { id } = useParams(); // read :id from URL

  return (
    <div style={{ padding: '1rem' }}>
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
          src={`https://embed.su/embed/movie/${id}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default MovieEmbed;
