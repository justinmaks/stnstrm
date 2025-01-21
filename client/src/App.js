// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import MovieEmbed from './MovieEmbed';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Home (search & results) */}
      <Route path="/" element={<Home />} />

      {/* Movie player at /movie/:id */}
      <Route path="/movie/:id" element={<MovieEmbed />} />
    </Routes>
  );
}

export default App;
