# Movie Streaming App

A simple full-stack application for searching movies (via TMDB) and embedding a video player (via `embed.su`).  
It consists of:

1. **server/** – A Node.js/Express server (protects TMDB key, provides `/api/search`).  
2. **client/** – A React front-end that lets users:
   - Search movies
   - Display posters
   - Embed a playable stream

---

## Features

- **TMDB Search**: Uses your **TMDB_API_KEY** to fetch movie data.
- **Movie Embedding**: Renders an embedded iframe player from [embed.su](https://embed.su).
- **Dockerized**: Easily deployable with `docker-compose`.

---

## Prerequisites

- **Node.js** (if running locally without Docker)
- **npm** or **yarn**
- **Docker** & **Docker Compose** (for container-based deployment)
- A **TMDB API Key** (sign up at [TMDB](https://www.themoviedb.org/))

---

## Environment Setup

1. Create a `.env` file in the project root:

`TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE`

2. `docker compose up --build`

3. Access the app at localhost:3000
