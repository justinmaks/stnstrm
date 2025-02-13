<template>
    <div class="container">
      <h1>Movie Streamer</h1>
  
      <!-- Search Form -->
      <form class="search-form" @submit.prevent="handleSearch">
        <input
          type="text"
          class="search-input"
          placeholder="Search for a movie..."
          v-model="query"
        />
        <button type="submit" class="search-button">Search</button>
      </form>
  
      <!-- Display search results -->
      <div class="movie-grid">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="movie-item"
          @click="handleSelectMovie(movie.id)"
        >
          <img :src="getPosterUrl(movie.poster_path)" :alt="movie.title" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView',
    data() {
      return {
        query: '',
        movies: [],
      };
    },
    methods: {
      async handleSearch() {
        if (!this.query.trim()) return;
        try {
          const response = await fetch(
            `http://localhost:3001/api/search?query=${encodeURIComponent(
              this.query
            )}`
          );
          const data = await response.json();
          this.movies = data;
        } catch (error) {
          console.error('Search error:', error);
        }
      },
      handleSelectMovie(id) {
        // Navigate to /movie/:id
        this.$router.push(`/movie/${id}`);
      },
      getPosterUrl(posterPath) {
        return posterPath
          ? `https://image.tmdb.org/t/p/w200${posterPath}`
          : 'https://via.placeholder.com/200x300?text=No+Image';
      },
    },
  };
  </script>
  
  <style scoped>
  /* Example basic styling */
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  .search-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  .movie-item {
    cursor: pointer;
  }
  .movie-item img {
    width: 100%;
    height: auto;
  }
  </style>
  