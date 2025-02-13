# Dockerized Nginx Proxy for Vue + Node

This README describes how to set up an **Nginx reverse proxy** in Docker for a Vue frontend and Node/Express backend, including support for local development (HTTP) and production (HTTPS + custom domain).

---

## Overview

The project has three main services:
1. **server**: Node/Express backend (port `3001`)
2. **client**: Vue frontend (port `3000`)
3. **nginx**: Reverse proxy that routes traffic to the appropriate container, optionally handling SSL.

**Local Dev** runs on HTTP at `localhost`, and **Production** uses HTTPS on a real domain (e.g., `example.com`) with your SSL certificates. DNS must be set to point `example.com` to your server's IP.

---

## docker-compose.yml

Below is an example `docker-compose.yml` that defines the three containers on a single `movie_net` network.

```yaml
version: "3.8"

services:
  server:
    build: ./server
    container_name: movie_server
    env_file:
      - .env
    environment:
      - TMDB_API_KEY=${TMDB_API_KEY}
    expose:
      - "3001"
    networks:
      - movie_net

  client:
    build: ./client
    container_name: movie_client
    expose:
      - "3000"
    depends_on:
      - server
    networks:
      - movie_net

  nginx:
    build: ./nginx
    container_name: movie_nginx
    ports:
      - "80:80"       # HTTP
      - "443:443"     # HTTPS
    environment:
      # We'll set these in .env or pass them in at runtime
      - DOMAIN=${DOMAIN:-example.com}
      - USE_SSL=${USE_SSL:-false}
    depends_on:
      - server
      - client
    networks:
      - movie_net

networks:
  movie_net:
    driver: bridge
```

### Explanation
1. **`server`**: Node/Express container on port `3001` (internally). Not published externally.
2. **`client`**: Vue container on port `3000` (internally). Not published externally.
3. **`nginx`**: Binds host ports `80` and `443` to the container. Uses environment variables `DOMAIN` and `USE_SSL` to configure the final Nginx config. Routes `http://...` and `https://...` requests to either the Vue client or Node server.
4. We rely on a custom network `movie_net` so containers can communicate.

---

## Nginx Directory

Inside the `nginx/` folder are:

1. **Dockerfile**:
   ```dockerfile
   FROM nginx:stable

   # Install envsubst for variable substitution
   RUN apt-get update && apt-get install -y gettext-base

   # Copy certs if embedding them in the image
   COPY certs/fullchain.pem /etc/nginx/certs/fullchain.pem
   COPY certs/privkey.pem /etc/nginx/certs/privkey.pem

   # Copy the default.conf template & entry script
   COPY default.conf.template /etc/nginx/templates/default.conf.template
   COPY entrypoint.sh /entrypoint.sh
   RUN chmod +x /entrypoint.sh

   ENTRYPOINT ["/entrypoint.sh"]
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **default.conf.template**:
   ```nginx
   server {
       listen 80;
       server_name $DOMAIN;

       # If we're using SSL, redirect HTTP -> HTTPS
       if ($USE_SSL = "true") {
           return 301 https://$host$request_uri;
       }

       # Proxy non-SSL traffic to the Vue client
       location / {
           proxy_pass http://movie_client:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       # Proxy /api to the Node server
       location /api/ {
           proxy_pass http://movie_server:3001/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }

   # HTTPS Server
   server {
       listen 443 ssl;
       server_name $DOMAIN;

       ssl_certificate /etc/nginx/certs/fullchain.pem;
       ssl_certificate_key /etc/nginx/certs/privkey.pem;

       location /api/ {
           proxy_pass http://movie_server:3001/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location / {
           proxy_pass http://movie_client:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **entrypoint.sh**:
   ```bash
   #!/bin/sh

   # Replace variables in default.conf.template with env values
   envsubst '$DOMAIN $USE_SSL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

   exec "$@"
   ```

4. **certs/**: Contains two files for production:
   - `fullchain.pem` (your cert + intermediates)
   - `privkey.pem` (private key)

If you want to mount them at runtime instead, skip the `COPY` steps in Dockerfile and use volumes in `docker-compose.yml`.

---

## Local Development

1. **No Domain**: Use `DOMAIN=localhost` or omit it so the default is `example.com`.
2. **Disable SSL** by setting `USE_SSL=false`. This means the Nginx config will **not** redirect HTTP to HTTPS.
3. Ensure your Node server uses open CORS, for instance:
   ```js
   const cors = require('cors');
   app.use(cors({ origin: '*' }));
   ```
4. **Run**:
   ```bash
   docker compose up --build
   ```
   - Nginx listens on `localhost:80`.  
   - Navigate to `http://localhost` → loads Vue app.
   - Vue calls `http://localhost/api/...` for the Node server.

> You’ll get plain HTTP. No domain or SSL required.

---

## Production Setup

1. **Certificates**:
   - Obtain real SSL certs from your CA or Let’s Encrypt (manually). You’ll have `fullchain.pem` + `privkey.pem`.
   - Place them in `nginx/certs/` or mount them at runtime.
2. **DNS**:
   - In your domain registrar’s DNS settings, create an **A record** pointing `example.com` (or your domain) to the public IP of your server.
3. **Environment Variables**:
   - Set `DOMAIN=example.com` in `.env` or pass `DOMAIN=example.com` at docker run.
   - Set `USE_SSL=true`.
   - .env:
    ```
    DOMAIN=example.com
    USE_SSL=true
    TMDB_API_KEY=your_key
    ```

4. **Build & Run**:
   ```bash
   docker compose up --build -d
   ```
   - Nginx listens on ports 80 and 443.
   - HTTP requests get redirected to HTTPS.
   - `https://example.com` loads the Vue site. The server is proxied at `https://example.com/api/...`.

---

## DNS Configuration

- **A Record**: Create an A record for `example.com` → `<your_server_ip>`.
- If you want subdomains (like `api.example.com`), update the `server_name` in your config and add another A record.
- Wait for DNS propagation (usually quick, can take a few hours).


---

## Additional Notes

1. **Mounting Certs**: Instead of copying certs, you can do:
   ```yaml
   volumes:
     - ./nginx/certs:/etc/nginx/certs:ro
   ```
   in the `nginx` service.
2. **CORS**: For production, you might want to restrict CORS on your Node server to only `origin: 'https://example.com'`.
    - Node: If you want locked-down CORS in production, do something like:
        ```
        const corsOptions = {
        origin: 'https://example.com',
        optionsSuccessStatus: 200,
        };
        app.use(cors(corsOptions));
        ```
3. **Automatic Certs**: If you prefer Let’s Encrypt automation, consider using `nginx-proxy` + `letsencrypt-nginx-proxy-companion` or a tool like Traefik.
4. **Local vs. Production**: You can store different environment values (like `USE_SSL=true` or `USE_SSL=false`) in `.env.production` vs. `.env.development` and reference them accordingly.


---

## Summary

- **Local Dev**: Run `docker compose up` with `USE_SSL=false` and either `DOMAIN=localhost` or leave it as default. Access your site at `http://localhost`.
- **Production**: Set `DOMAIN=yourdomain.com`, `USE_SSL=true`, and ensure valid certs + DNS. Access at `https://yourdomain.com`.
