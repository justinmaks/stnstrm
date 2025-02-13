<template>
    <div style="padding: 1rem;">
      <h2>Movie Details</h2>
  
      <div v-if="details" style="margin-bottom: 1rem;">
        <h3>{{ details.title }}</h3>
        <p><strong>Release Date:</strong> {{ details.release_date }}</p>
        <p><strong>Overview:</strong> {{ details.overview }}</p>
      </div>
  
      <div
        style="
          position: relative;
          width: 100%;
          max-width: 800px;
          aspect-ratio: 16 / 9;
        "
      >
        <iframe
          v-if="movieId"
          :src="`https://embed.su/embed/movie/${movieId}`"
          title="Movie Player"
          style="width: 100%; height: 100%; border: none;"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    name: 'MovieView',
    setup() {
      const route = useRoute();
      const movieId = route.params.id; // from /movie/:id
  
      const details = ref(null);
  
      onMounted(() => {
        fetchMovieDetails(movieId);
      });
  
      async function fetchMovieDetails(id) {
        try {
          const response = await fetch(`http://localhost:3001/api/movie/${id}`);
          const data = await response.json();
          details.value = data;
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      }
  
      return {
        details,
        movieId,
      };
    },
  };
  </script>
  
  <style scoped>
  /* styling as needed */
  </style>
  