import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    // By default, Vite runs on port 5173 in development.
    // You can set a custom port or proxy your backend here if needed.
    port: 5173,
    proxy: {
      // Optionally proxy calls to /api to your server on port 3001
      // '^/api': {
      //   target: 'http://localhost:3001',
      //   changeOrigin: true
      // }
    }
  },
  // Adjust build output folder if you want something other than 'dist'
  build: {
    outDir: 'dist'
  }
});
