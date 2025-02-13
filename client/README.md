# Vue Movie Streamer Frontend

This is a Vue 3 frontend application, bundled with [Vite](https://vitejs.dev/). It provides a user interface for searching and streaming movies, using data from [TMDB](https://www.themoviedb.org/) via a Node/Express server (running separately).

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Scripts](#scripts)
  - [Development](#development)
  - [Production Build](#production-build)
  - [Preview Build](#preview-build)
- [Docker Usage](#docker-usage)
  - [Local Docker Build](#local-docker-build)
  - [Docker Compose](#docker-compose)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Features

- **Movie Search**: Enter a search query to find movies (powered by TMDB API).
- **Movie Details**: Displays title, release date, and overview.
- **Embedded Player**: An `<iframe>` that points to an external streaming service.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node)
- A running **backend server** that listens on port `3001` by default. (See the companion [Node/Express server](../server) in this project.)

---

## Project Structure

```
client/
├─ Dockerfile
├─ index.html             # Vite entry point
├─ package.json
├─ package-lock.json
├─ vite.config.js
└─ src/
   ├─ main.js             # Initializes Vue app
   ├─ App.vue             # Root Vue component
   ├─ router/
   │  └─ index.js         # Vue Router setup
   ├─ views/
   │  ├─ HomeView.vue
   │  └─ MovieView.vue
   └─ assets/
      └─ ...             # Static assets, images, CSS, etc.
```

---

## Installation

1. **Clone** this repository (or your fork).
2. **Navigate** to the `client` folder:
   ```bash
   cd client
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
   This will install Vue, Vite, Vue Router, and other required packages.

---

## Scripts

### Development

Run a local development server with hot-reloading on port 5173 by default:

```bash
npm run dev
```

You can then open [http://localhost:5173](http://localhost:5173) in your browser.  
Make sure your Node/Express server is also running on port `3001` (or update the fetch URLs in the Vue components if needed).

### Production Build

Generate a production-ready build in the `dist` folder:

```bash
npm run build
```

Then you can serve the `dist` folder with any static file server or via Docker (see below).

### Preview Build

After building, you can run:

```bash
npm run preview
```

This starts a local server so you can preview the production build on [http://localhost:4173](http://localhost:4173).

---

## Docker Usage

### Local Docker Build

From within the `client` directory, you can build and run this as a container:

1. **Build** the Docker image:
   ```bash
   docker build -t vue-movie-client .
   ```
2. **Run** the container:
   ```bash
   docker run -p 3000:3000 --name vue_client vue-movie-client
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

> **Note**: This container calls the backend at `http://localhost:3001`. You need to ensure that your Node server container is also running and accessible at that address (e.g., via Docker Compose or a correct network setup).

### Docker Compose

If your project root has a `docker-compose.yml` that defines both `server` and `client` services, simply run:

```bash
docker compose up --build
```

- The Node server (port `3001`) and the Vue client (port `3000`) will both start in containers.
- Open [http://localhost:3000](http://localhost:3000) to access the frontend.
- The frontend calls the backend at `http://localhost:3001`.

---

## Environment Variables

Typically, the frontend does not need environment variables when making direct requests to `http://localhost:3001`. If you do need to configure external URLs or adjust environment settings, you can:
- Use `.env` files recognized by Vite (e.g., `.env.development`, `.env.production`) and reference them with `import.meta.env`.
- Or directly update your fetch calls in the Vue components.

For a production environment, you might:
- Proxy API calls in `vite.config.js` via the `server.proxy` setting.
- Use environment variables in Docker or a reverse proxy to handle external API addresses.

---


